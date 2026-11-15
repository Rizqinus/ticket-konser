// Self-check alur pembayaran (tanpa MySQL): node tests/payment.check.js
const assert = require("assert");
const path = require("path");

// ---- DB tiruan di memori ----
const state = {};
const reset = (method = "manual_transfer", proof = "proof.png") => {
  state.payment = {
    id: 1, order_id: 10, payment_method: method,
    payment_status: "pending", proof_image: proof,
  };
  state.order = { id: 10, user_id: 7, order_code: "ORD-1", status: "pending" };
  state.tickets = [];
  state.notifications = [];
};

const conn = {
  beginTransaction: async () => {},
  commit: async () => {},
  rollback: async () => {},
  release: () => {},
  query: async (sql, params = []) => {
    if (sql.includes("FROM orders WHERE order_code = ?")) {
      return [[state.order]];
    }
    if (sql.includes("FROM payments WHERE order_id = ?")) {
      return [[state.payment]];
    }
    if (sql.includes("FOR UPDATE")) {
      const owned = !sql.includes("o.user_id = ?") || params[1] === state.order.user_id;
      const found = params[0] === state.payment.id && owned;
      return [found ? [{ ...state.payment, order_code: state.order.order_code,
        user_id: state.order.user_id, order_status: state.order.status }] : []];
    }
    if (sql.includes("UPDATE orders SET status = ?")) {
      state.order.status = params[0];
    }
    if (sql.includes("payment_status = 'success'")) state.payment.payment_status = "success";
    else if (sql.includes("payment_status = 'failed'")) state.payment.payment_status = "failed";
    else if (sql.includes("UPDATE orders SET status = 'paid'")) state.order.status = "paid";
    else if (sql.includes("INSERT INTO notifications")) state.notifications.push(params);
    else if (sql.includes("FROM order_items")) return [[{ ticket_category_id: 3, quantity: 2 }]];
    else if (sql.includes("INSERT INTO tickets")) {
      state.tickets.push(params);
      return [{ insertId: state.tickets.length }];
    }
    return [[]];
  },
};

require.cache[require.resolve("../src/config/db")] = {
  id: "db", filename: "db", loaded: true,
  exports: { getConnection: async () => conn, query: conn.query },
};

const pay = require("../src/controllers/paymentController");

const call = async (fn, { id = 1, user = 7, body = {} } = {}) => {
  const res = { code: 200, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  await fn({ params: { id }, user: { id: user }, body }, res);
  return res;
};

(async () => {
  // user tidak boleh melewati verifikasi admin
  reset();
  let r = await call(pay.paymentSuccess);
  assert.strictEqual(r.code, 403);
  assert.strictEqual(state.payment.payment_status, "pending");

  // admin verify tanpa bukti ditolak
  reset("manual_transfer", null);
  r = await call(pay.verifyPayment, { user: 1 });
  assert.strictEqual(r.code, 400);

  // admin verify: lunas + tiket sesuai qty + notifikasi
  reset();
  r = await call(pay.verifyPayment, { user: 1 });
  assert.strictEqual(r.code, 200);
  assert.strictEqual(state.payment.payment_status, "success");
  assert.strictEqual(state.order.status, "paid");
  assert.strictEqual(state.tickets.length, 2);
  assert.strictEqual(state.notifications.length, 1);

  // verify dua kali ditolak (tiket tidak dobel)
  r = await call(pay.verifyPayment, { user: 1 });
  assert.strictEqual(r.code, 400);
  assert.strictEqual(state.tickets.length, 2);

  // reject: payment gagal, order tetap pending, user dapat notifikasi alasan
  reset();
  r = await call(pay.rejectPayment, { user: 1, body: { reason: "Nominal kurang" } });
  assert.strictEqual(r.code, 200);
  assert.strictEqual(state.payment.payment_status, "failed");
  assert.strictEqual(state.order.status, "pending");
  assert.ok(state.notifications[0][2].includes("Nominal kurang"));

  // pembayaran non-manual tetap bisa dikonfirmasi pemiliknya
  reset("gopay", null);
  r = await call(pay.paymentSuccess);
  assert.strictEqual(r.code, 200);
  assert.strictEqual(state.tickets.length, 2);

  // bukan pemilik -> 404
  reset("gopay", null);
  r = await call(pay.paymentSuccess, { user: 99 });
  assert.strictEqual(r.code, 404);

  // ---- Midtrans Tests ----
  // config
  const cfgRes = { code: 200, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  pay.getMidtransConfig({}, cfgRes);
  assert.strictEqual(cfgRes.code, 200);
  assert.strictEqual(cfgRes.body.data.is_production, false);
  assert.ok(cfgRes.body.data.client_key.startsWith("Mid-client-"));

  // notification signature salah ditolak 403
  reset("midtrans", null);
  let notifRes = { code: 200, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  await pay.handleMidtransNotification({
    body: {
      order_id: "ORD-1",
      status_code: "200",
      gross_amount: "500000.00",
      signature_key: "invalid_signature",
      transaction_status: "settlement",
    },
  }, notifRes);
  assert.strictEqual(notifRes.code, 403);

  // notification signature valid & settlement: order lunas & tiket terbit
  const crypto = require("crypto");
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const validSig = crypto
    .createHash("sha512")
    .update(`ORD-1200500000.00${serverKey}`)
    .digest("hex");

  reset("midtrans", null);
  notifRes = { code: 200, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  await pay.handleMidtransNotification({
    body: {
      order_id: "ORD-1",
      status_code: "200",
      gross_amount: "500000.00",
      signature_key: validSig,
      transaction_status: "settlement",
      transaction_id: "TRX-MID-12345",
      payment_type: "qris",
    },
  }, notifRes);
  assert.strictEqual(notifRes.code, 200);
  assert.strictEqual(state.payment.payment_status, "success");
  assert.strictEqual(state.order.status, "paid");
  assert.strictEqual(state.tickets.length, 2);

  // notification expire: order expired & payment failed
  const expireSig = crypto
    .createHash("sha512")
    .update(`ORD-1202500000.00${serverKey}`)
    .digest("hex");

  reset("midtrans", null);
  notifRes = { code: 200, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  await pay.handleMidtransNotification({
    body: {
      order_id: "ORD-1",
      status_code: "202",
      gross_amount: "500000.00",
      signature_key: expireSig,
      transaction_status: "expire",
    },
  }, notifRes);
  assert.strictEqual(notifRes.code, 200);
  assert.strictEqual(state.payment.payment_status, "failed");
  assert.strictEqual(state.order.status, "expired");

  console.log("payment.check: semua OK");
})().catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
