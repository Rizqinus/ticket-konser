const crypto = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("dotenv").config();

const getServerKey = () => process.env.MIDTRANS_SERVER_KEY || "";
const getClientKey = () => process.env.MIDTRANS_CLIENT_KEY || "";

const isProduction = () => {
  if (process.env.MIDTRANS_IS_PRODUCTION !== undefined) {
    return process.env.MIDTRANS_IS_PRODUCTION === "true";
  }
  const key = getServerKey();
  return key.startsWith("Mid-server-") && !key.includes("sandbox");
};

const getSnapUrl = () => {
  return isProduction()
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
};

/**
 * Membuat Snap Token dan Redirect URL ke Midtrans
 * @param {Object} params
 * @param {Object} params.order { id, order_code, total_price }
 * @param {Object} params.user { name, email, phone }
 * @param {Array} params.items [{ id, name, price, quantity }]
 */
const createSnapTransaction = async ({ order, user, items = [] }) => {
  const serverKey = getServerKey();
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi di environment backend");
  }

  const snapUrl = getSnapUrl();
  const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;

  const grossAmount = Math.round(Number(order.total_price));

  // Midtrans membutuhkan item_details yang totalnya sama persis dengan gross_amount
  let itemDetails = items.map((it, idx) => ({
    id: String(it.ticket_category_id || it.id || `item-${idx + 1}`),
    price: Math.round(Number(it.price)),
    quantity: Number(it.quantity),
    name: String(it.ticket_name || it.name || "Tiket Konser").slice(0, 50),
  }));

  const itemsTotal = itemDetails.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  // Jika item_details kosong atau selisih pembulatan, buat fallback single item
  if (itemDetails.length === 0 || itemsTotal !== grossAmount) {
    itemDetails = [
      {
        id: String(order.id),
        price: grossAmount,
        quantity: 1,
        name: `Tiket Order ${order.order_code}`.slice(0, 50),
      },
    ];
  }

  const payload = {
    transaction_details: {
      order_id: order.order_code,
      gross_amount: grossAmount,
    },
    customer_details: {
      first_name: user?.name || "Customer",
      email: user?.email || "customer@example.com",
      phone: user?.phone || undefined,
    },
    item_details: itemDetails,
  };

  const response = await fetch(snapUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      (data.error_messages && data.error_messages.join(", ")) ||
      data.message ||
      "Gagal membuat transaksi di Midtrans";
    throw new Error(`Midtrans API Error (${response.status}): ${errorMsg}`);
  }

  return {
    token: data.token,
    redirect_url: data.redirect_url,
  };
};

/**
 * Validasi signature SHA-512 dari Webhook Midtrans
 */
const verifySignatureKey = ({
  order_id,
  status_code,
  gross_amount,
  signature_key,
}) => {
  const serverKey = getServerKey();
  if (!serverKey) return false;

  const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const computed = crypto.createHash("sha512").update(raw).digest("hex");
  return computed === signature_key;
};

/**
 * Mengecek status transaksi langsung ke Midtrans Core API
 * @param {string} orderCode Kode pesanan (order_code) yang didaftarkan ke Midtrans
 */
const checkTransactionStatus = async (orderCode) => {
  const serverKey = getServerKey();
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi di environment");
  }

  const baseUrl = isProduction()
    ? "https://api.midtrans.com/v2"
    : "https://api.sandbox.midtrans.com/v2";

  const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;

  const response = await fetch(`${baseUrl}/${orderCode}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: authHeader,
    },
  });

  const data = await response.json();
  return { httpStatus: response.status, data };
};

module.exports = {
  getServerKey,
  getClientKey,
  isProduction,
  getSnapUrl,
  createSnapTransaction,
  verifySignatureKey,
  checkTransactionStatus,
};
