const db = require("../config/db");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { PROOF_DIR } = require("../middlewares/uploadProof");
const midtransService = require("../services/midtransService");

const MANUAL = "manual_transfer";

// ========================================
// HELPER
// ========================================

const notify = (conn, userId, title, message) =>
  conn.query(
    `INSERT INTO notifications (user_id, title, message, is_read)
     VALUES (?, ?, ?, FALSE)`,
    [userId, title, message]
  );

// Kunci payment + order-nya. userId null = admin (tanpa cek pemilik)
const lockPayment = async (conn, id, userId) => {
  const [rows] = await conn.query(
    `SELECT
      p.id,
      p.order_id,
      p.payment_method,
      p.payment_status,
      p.proof_image,
      o.order_code,
      o.user_id,
      o.status AS order_status
    FROM payments p
    JOIN orders o
      ON p.order_id = o.id
    WHERE p.id = ?
    ${userId ? "AND o.user_id = ?" : ""}
    FOR UPDATE`,
    userId ? [id, userId] : [id]
  );

  return rows[0];
};

const payableError = (p) =>
  p.payment_status !== "pending"
    ? `Payment already ${p.payment_status}`
    : p.order_status !== "pending"
    ? `Order cannot be paid because its status is ${p.order_status}`
    : null;

// Tandai lunas, terbitkan tiket, kirim notifikasi
const settlePayment = async (conn, payment) => {
  const reference = `PAY-${Date.now()}`;

  await conn.query(
    `UPDATE payments
     SET
       payment_status = 'success',
       payment_reference = ?,
       paid_at = NOW()
     WHERE id = ?`,
    [reference, payment.id]
  );

  await conn.query(`UPDATE orders SET status = 'paid' WHERE id = ?`, [
    payment.order_id,
  ]);

  await notify(
    conn,
    payment.user_id,
    "Payment Successful",
    "Your payment has been successfully processed."
  );

  const [items] = await conn.query(
    `SELECT ticket_category_id, quantity
     FROM order_items
     WHERE order_id = ?`,
    [payment.order_id]
  );

  const tickets = [];

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      const ticketCode = `TICKET-${Date.now()}-${Math.floor(
        Math.random() * 100000
      )}`;

      const qrCode = await QRCode.toDataURL(
        JSON.stringify({
          ticket_code: ticketCode,
          order_id: payment.order_id,
        })
      );

      const [result] = await conn.query(
        `INSERT INTO tickets
        (order_id, ticket_category_id, ticket_code, qr_code, status)
        VALUES (?, ?, ?, ?, 'active')`,
        [payment.order_id, item.ticket_category_id, ticketCode, qrCode]
      );

      tickets.push({
        ticket_id: result.insertId,
        ticket_code: ticketCode,
        ticket_category_id: item.ticket_category_id,
        status: "active",
      });
    }
  }

  return {
    payment_id: payment.id,
    payment_reference: reference,
    order_id: payment.order_id,
    order_code: payment.order_code,
    payment_status: "success",
    order_status: "paid",
    tickets,
  };
};

// Transaction wrapper: fn mengembalikan { error: [status, msg] } atau { message, data }
const inTransaction = async (res, label, fn) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const result = await fn(conn);

    if (result.error) {
      await conn.rollback();

      return res.status(result.error[0]).json({
        success: false,
        message: result.error[1],
      });
    }

    await conn.commit();

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    await conn.rollback();

    console.error(`${label} Error:`, error);

    res.status(500).json({
      success: false,
      message: "Payment processing failed",
    });
  } finally {
    conn.release();
  }
};

const serverError = (res, label, error) => {
  console.error(`${label} Error:`, error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

// ========================================
// CREATE PAYMENT
// payment_method: "manual_transfer" = perlu bukti + verifikasi admin
// payment_method: "midtrans" / "midtrans_snap" = payment gateway otomatis
// ========================================
const createPayment = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { order_id, payment_method } = req.body;

    if (!order_id || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "order_id and payment_method are required",
      });
    }

    const [orders] = await db.query(
      `SELECT id, order_code, total_price, status
       FROM orders
       WHERE id = ?
       AND user_id = ?`,
      [order_id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be paid because its status is ${order.status}`,
      });
    }

    const isMidtrans =
      payment_method === "midtrans" ||
      payment_method === "midtrans_snap" ||
      payment_method.startsWith("midtrans_");

    // Periksa apakah sudah ada pembayaran aktif/pending untuk order ini
    const [existingPayments] = await db.query(
      `SELECT id, payment_method, payment_status, snap_token, snap_redirect_url
       FROM payments
       WHERE order_id = ? AND payment_status = 'pending'
       ORDER BY id DESC LIMIT 1`,
      [order_id]
    );

    if (existingPayments.length > 0) {
      const existing = existingPayments[0];
      if (existing.payment_method !== payment_method) {
        await db.query(`UPDATE payments SET payment_method = ? WHERE id = ?`, [
          payment_method,
          existing.id,
        ]);
        existing.payment_method = payment_method;
      }

      // Jika bukan Midtrans, atau sudah memiliki Snap Token, gunakan kembali record yang ada
      if (!isMidtrans || existing.snap_token) {
        return res.status(200).json({
          success: true,
          message: "Payment retrieved successfully",
          data: {
            payment_id: existing.id,
            order_id: order.id,
            order_code: order.order_code,
            total_price: order.total_price,
            payment_method: existing.payment_method,
            payment_status: "pending",
            snap_token: existing.snap_token,
            snap_redirect_url: existing.snap_redirect_url,
            client_key: isMidtrans ? midtransService.getClientKey() : undefined,
          },
        });
      }
    }

    let snapData = null;

    if (isMidtrans) {
      const [users] = await db.query(
        `SELECT name, email, phone FROM users WHERE id = ?`,
        [user_id]
      );
      const customer = users[0] || req.user;

      const [items] = await db.query(
        `SELECT
          oi.id,
          oi.ticket_category_id,
          oi.quantity,
          oi.price,
          tc.name AS ticket_name
        FROM order_items oi
        JOIN ticket_categories tc ON oi.ticket_category_id = tc.id
        WHERE oi.order_id = ?`,
        [order.id]
      );

      try {
        snapData = await midtransService.createSnapTransaction({
          order,
          user: customer,
          items,
        });
      } catch (snapErr) {
        console.error("Midtrans Snap Error:", snapErr.message);
        return res.status(502).json({
          success: false,
          message: `Gagal membuat transaksi Midtrans: ${snapErr.message}`,
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO payments
      (order_id, payment_method, payment_status, snap_token, snap_redirect_url)
      VALUES (?, ?, 'pending', ?, ?)`,
      [
        order_id,
        payment_method,
        snapData ? snapData.token : null,
        snapData ? snapData.redirect_url : null,
      ]
    );

    const payment_id = result.insertId;

    // QR transaksi
    const qr_code = await QRCode.toDataURL(
      JSON.stringify({
        payment_id,
        order_id: order.id,
        order_code: order.order_code,
        amount: order.total_price,
        payment_method,
        payment_status: "pending",
        snap_token: snapData ? snapData.token : null,
      })
    );

    await db.query(`UPDATE payments SET qr_code = ? WHERE id = ?`, [
      qr_code,
      payment_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: {
        payment_id,
        order_id: order.id,
        order_code: order.order_code,
        total_price: order.total_price,
        payment_method,
        payment_status: "pending",
        snap_token: snapData ? snapData.token : null,
        snap_redirect_url: snapData ? snapData.redirect_url : null,
        client_key: isMidtrans ? midtransService.getClientKey() : undefined,
        qr_code,
      },
    });
  } catch (error) {
    serverError(res, "Create Payment", error);
  }
};

// ========================================
// CREATE MIDTRANS SNAP TOKEN (KHUSUS SNAP)
// ========================================
const createMidtransSnapToken = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "order_id is required",
      });
    }

    const [orders] = await db.query(
      `SELECT id, order_code, total_price, status
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [order_id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be paid because its status is ${order.status}`,
      });
    }

    // Cek apakah sudah ada pembayaran pending dengan snap_token
    const [existingPayments] = await db.query(
      `SELECT id, snap_token, snap_redirect_url
       FROM payments
       WHERE order_id = ? AND payment_status = 'pending' AND snap_token IS NOT NULL
       ORDER BY id DESC LIMIT 1`,
      [order.id]
    );

    if (existingPayments.length > 0 && existingPayments[0].snap_token) {
      return res.status(200).json({
        success: true,
        message: "Snap token retrieved",
        data: {
          payment_id: existingPayments[0].id,
          order_id: order.id,
          order_code: order.order_code,
          gross_amount: order.total_price,
          token: existingPayments[0].snap_token,
          redirect_url: existingPayments[0].snap_redirect_url,
          client_key: midtransService.getClientKey(),
          is_production: midtransService.isProduction(),
        },
      });
    }

    const [users] = await db.query(
      `SELECT name, email, phone FROM users WHERE id = ?`,
      [user_id]
    );
    const customer = users[0] || req.user;

    const [items] = await db.query(
      `SELECT
        oi.id,
        oi.ticket_category_id,
        oi.quantity,
        oi.price,
        tc.name AS ticket_name
      FROM order_items oi
      JOIN ticket_categories tc ON oi.ticket_category_id = tc.id
      WHERE oi.order_id = ?`,
      [order.id]
    );

    const snapData = await midtransService.createSnapTransaction({
      order,
      user: customer,
      items,
    });

    const [result] = await db.query(
      `INSERT INTO payments
      (order_id, payment_method, payment_status, snap_token, snap_redirect_url)
      VALUES (?, 'midtrans', 'pending', ?, ?)`,
      [order.id, snapData.token, snapData.redirect_url]
    );

    res.status(201).json({
      success: true,
      message: "Snap token created successfully",
      data: {
        payment_id: result.insertId,
        order_id: order.id,
        order_code: order.order_code,
        gross_amount: order.total_price,
        token: snapData.token,
        redirect_url: snapData.redirect_url,
        client_key: midtransService.getClientKey(),
        is_production: midtransService.isProduction(),
      },
    });
  } catch (error) {
    serverError(res, "Create Snap Token", error);
  }
};

// ========================================
// GET MIDTRANS CONFIG
// ========================================
const getMidtransConfig = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      client_key: midtransService.getClientKey(),
      is_production: midtransService.isProduction(),
      snap_script_url: midtransService.isProduction()
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js",
    },
  });
};

// ========================================
// WEBHOOK NOTIFIKASI MIDTRANS
// ========================================
const handleMidtransNotification = async (req, res) => {
  try {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
    } = req.body;

    if (!order_id || !signature_key) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    const isValid = midtransService.verifySignatureKey({
      order_id,
      status_code,
      gross_amount,
      signature_key,
    });

    if (!isValid) {
      console.warn(`Midtrans notification: Invalid signature for ${order_id}`);
      return res.status(403).json({ success: false, message: "Invalid signature" });
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [orders] = await connection.query(
        `SELECT id, order_code, user_id, status FROM orders WHERE order_code = ? FOR UPDATE`,
        [order_id]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const order = orders[0];

      const [payments] = await connection.query(
        `SELECT * FROM payments WHERE order_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [order.id]
      );

      let payment = payments[0];
      if (!payment) {
        const [inserted] = await connection.query(
          `INSERT INTO payments (order_id, payment_method, payment_status, payment_reference)
           VALUES (?, ?, 'pending', ?)`,
          [order.id, `midtrans_${payment_type || "snap"}`, transaction_id || null]
        );
        const [newRows] = await connection.query(`SELECT * FROM payments WHERE id = ?`, [inserted.insertId]);
        payment = newRows[0];
      }

      const isSuccess =
        transaction_status === "settlement" ||
        (transaction_status === "capture" && fraud_status === "accept");

      const isFailure =
        transaction_status === "cancel" ||
        transaction_status === "deny" ||
        transaction_status === "expire";

      if (isSuccess) {
        if (payment.payment_status !== "success" || order.status !== "paid") {
          payment.order_code = order.order_code;
          payment.user_id = order.user_id;

          await settlePayment(connection, payment);

          await connection.query(
            `UPDATE payments
             SET payment_reference = ?,
                 payment_method = ?
             WHERE id = ?`,
            [transaction_id || `MID-${order.order_code}`, `midtrans_${payment_type || "snap"}`, payment.id]
          );

          console.log(`Midtrans notification: Order ${order.order_code} berhasil LUNAS.`);
        }
      } else if (isFailure) {
        if (order.status === "pending") {
          const [items] = await connection.query(
            `SELECT ticket_category_id, quantity FROM order_items WHERE order_id = ?`,
            [order.id]
          );

          for (const item of items) {
            await connection.query(
              `UPDATE ticket_categories SET stock = stock + ? WHERE id = ?`,
              [item.quantity, item.ticket_category_id]
            );
          }

          const targetStatus = transaction_status === "expire" ? "expired" : "cancelled";
          await connection.query(`UPDATE orders SET status = ? WHERE id = ?`, [targetStatus, order.id]);
          await connection.query(
            `UPDATE payments SET payment_status = 'failed', reject_reason = ? WHERE id = ?`,
            [`Midtrans: ${transaction_status}`, payment.id]
          );

          console.log(`Midtrans notification: Order ${order.order_code} ${targetStatus}.`);
        }
      }

      await connection.commit();
      return res.status(200).json({ success: true, message: "Notification processed" });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }
  } catch (error) {
    serverError(res, "Midtrans Notification", error);
  }
};

// ========================================
// PAYMENT SUCCESS (non-manual)
// ========================================
const paymentSuccess = (req, res) =>
  inTransaction(res, "Payment Success", async (conn) => {
    const payment = await lockPayment(conn, req.params.id, req.user.id);

    if (!payment) return { error: [404, "Payment not found"] };

    // Tanpa ini user bisa melewati verifikasi admin
    if (payment.payment_method === MANUAL) {
      return { error: [403, "Manual transfer must be verified by an admin"] };
    }

    const error = payableError(payment);
    if (error) return { error: [400, error] };

    return {
      message: "Payment successful and tickets generated",
      data: await settlePayment(conn, payment),
    };
  });

// ========================================
// UPLOAD PROOF (user, manual transfer)
// multipart/form-data: proof (file), sender_bank, sender_name
// ========================================
const uploadProof = async (req, res) => {
  const fail = (status, message) => {
    if (req.file) fs.unlink(req.file.path, () => {});

    return res.status(status).json({ success: false, message });
  };

  try {
    const { sender_bank, sender_name } = req.body;

    if (!req.file) {
      return fail(400, "Proof image (png, jpg or webp, max 2MB) is required");
    }

    if (!sender_bank || !sender_name) {
      return fail(400, "sender_bank and sender_name are required");
    }

    const [rows] = await db.query(
      `SELECT
        p.payment_method,
        p.payment_status,
        p.proof_image,
        o.status AS order_status
      FROM payments p
      JOIN orders o
        ON p.order_id = o.id
      WHERE p.id = ?
      AND o.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) return fail(404, "Payment not found");

    const payment = rows[0];

    if (payment.payment_method !== MANUAL) {
      return fail(400, "Proof is only needed for manual transfer");
    }

    const error = payableError(payment);
    if (error) return fail(400, error);

    await db.query(
      `UPDATE payments
       SET
         proof_image = ?,
         sender_bank = ?,
         sender_name = ?,
         proof_uploaded_at = NOW()
       WHERE id = ?`,
      [req.file.filename, sender_bank, sender_name, req.params.id]
    );

    // Bukti lama diganti
    if (payment.proof_image) {
      fs.unlink(path.join(PROOF_DIR, payment.proof_image), () => {});
    }

    res.status(200).json({
      success: true,
      message: "Proof uploaded, waiting for admin verification",
    });
  } catch (error) {
    if (req.file) fs.unlink(req.file.path, () => {});

    serverError(res, "Upload Proof", error);
  }
};

// ========================================
// ADMIN: LIST PAYMENTS
// ?status=waiting | approved | rejected (kosong = semua)
// ========================================
const STATUS_FILTER = {
  waiting: "p.payment_status = 'pending'",
  pending: "p.payment_status = 'pending'",
  approved: "p.payment_status = 'success'",
  success: "p.payment_status = 'success'",
  rejected: "p.payment_status = 'failed'",
  failed: "p.payment_status = 'failed'",
};

const listPayments = async (req, res) => {
  try {
    // Sinkronisasi otomatis: jika ada pesanan pending yang belum memiliki record pembayaran,
    // buatkan record pembayaran 'manual_transfer' berstatus 'pending' agar langsung tampil di verifikasi admin.
    await db.query(`
      INSERT INTO payments (order_id, payment_method, payment_status, created_at)
      SELECT o.id, 'manual_transfer', 'pending', o.created_at
      FROM orders o
      WHERE o.status = 'pending'
        AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.order_id = o.id)
    `).catch(() => {});

    const filterKey = (req.query.status || "").toLowerCase().trim();
    const whereClause = STATUS_FILTER[filterKey] || "1 = 1";

    const [payments] = await db.query(`
      SELECT
        p.id,
        p.order_id,
        o.order_code,
        o.total_price,
        p.payment_method,
        p.payment_status,
        p.sender_bank,
        p.sender_name,
        p.proof_uploaded_at,
        p.reject_reason,
        p.created_at,
        (p.proof_image IS NOT NULL) AS has_proof,
        u.name AS customer_name,
        u.email AS customer_email,
        (SELECT SUM(oi.quantity)
         FROM order_items oi
         WHERE oi.order_id = o.id) AS quantity,
        (SELECT STRING_AGG(DISTINCT tc.name, ', ')
         FROM order_items oi
         JOIN ticket_categories tc ON oi.ticket_category_id = tc.id
         WHERE oi.order_id = o.id) AS ticket_categories,
        (SELECT STRING_AGG(DISTINCT c.title, ', ')
         FROM order_items oi
         JOIN ticket_categories tc ON oi.ticket_category_id = tc.id
         JOIN concerts c ON tc.concert_id = c.id
         WHERE oi.order_id = o.id) AS concerts
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
    `);

    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    serverError(res, "List Payments", error);
  }
};

// ========================================
// ADMIN: VIEW PROOF IMAGE
// ========================================
const getProof = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT proof_image FROM payments WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0 || !rows[0].proof_image) {
      return res.status(404).json({
        success: false,
        message: "Proof not found",
      });
    }

    res.sendFile(rows[0].proof_image, { root: PROOF_DIR }, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ success: false, message: "Proof not found" });
      }
    });
  } catch (error) {
    serverError(res, "Get Proof", error);
  }
};

// Dipakai verify & reject: hanya manual transfer yang sudah ada buktinya
const lockWaitingPayment = async (conn, id) => {
  const payment = await lockPayment(conn, id, null);

  if (!payment) return { error: [404, "Payment not found"] };

  const error = payableError(payment);

  return error ? { error: [400, error] } : { payment };
};

// ========================================
// ADMIN: VERIFY (approve)
// ========================================
const verifyPayment = (req, res) =>
  inTransaction(res, "Verify Payment", async (conn) => {
    const { payment, error } = await lockWaitingPayment(conn, req.params.id);

    if (error) return { error };

    return {
      message: "Payment verified and tickets generated",
      data: await settlePayment(conn, payment),
    };
  });

// ========================================
// ADMIN: REJECT
// body: { reason? }
// Order tetap pending dan akan expire lewat cron (stok kembali)
// ========================================
const rejectPayment = (req, res) =>
  inTransaction(res, "Reject Payment", async (conn) => {
    const { payment, error } = await lockWaitingPayment(conn, req.params.id);

    if (error) return { error };

    const reason = req.body.reason || null;

    await conn.query(
      `UPDATE payments
       SET payment_status = 'failed', reject_reason = ?
       WHERE id = ?`,
      [reason, payment.id]
    );

    await notify(
      conn,
      payment.user_id,
      "Payment Rejected",
      reason
        ? `Your transfer proof was rejected: ${reason}`
        : "Your transfer proof was rejected."
    );

    return {
      message: "Payment rejected",
      data: { payment_id: payment.id, payment_status: "failed" },
    };
  });

// ========================================
// SINKRONISASI STATUS MIDTRANS (USER & ADMIN)
// ========================================
const syncMidtransStatus = async (req, res) => {
  try {
    const { order_code } = req.params;
    if (!order_code) {
      return res.status(400).json({ success: false, message: "order_code wajib diisi" });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [orders] = await connection.query(
        `SELECT id, order_code, user_id, status, total_price FROM orders WHERE order_code = ? FOR UPDATE`,
        [order_code]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan" });
      }

      const order = orders[0];

      // Admin atau pemilik pesanan
      if (req.user.role !== "admin" && req.user.id !== order.user_id) {
        await connection.rollback();
        return res.status(403).json({ success: false, message: "Akses ditolak untuk pesanan ini" });
      }

      const [payments] = await connection.query(
        `SELECT * FROM payments WHERE order_id = ? ORDER BY id DESC LIMIT 1 FOR UPDATE`,
        [order.id]
      );

      let payment = payments[0];
      if (!payment) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: "Data pembayaran tidak ditemukan" });
      }

      // Tanya Midtrans Core API
      const { httpStatus, data: midtransRes } = await midtransService.checkTransactionStatus(order.order_code);

      if (httpStatus !== 200 || !midtransRes.transaction_status) {
        await connection.rollback();
        return res.status(200).json({
          success: true,
          message: "Belum ada transaksi aktif di Midtrans",
          data: {
            order_status: order.status,
            payment_status: payment.payment_status,
            midtrans: midtransRes,
          },
        });
      }

      const { transaction_status, fraud_status, transaction_id, payment_type } = midtransRes;

      const isSuccess =
        transaction_status === "settlement" ||
        (transaction_status === "capture" && fraud_status === "accept");

      const isFailure =
        transaction_status === "cancel" ||
        transaction_status === "deny" ||
        transaction_status === "expire";

      if (isSuccess && (payment.payment_status !== "success" || order.status !== "paid")) {
        payment.order_code = order.order_code;
        payment.user_id = order.user_id;

        await settlePayment(connection, payment);

        await connection.query(
          `UPDATE payments
           SET payment_reference = ?,
               payment_method = ?
           WHERE id = ?`,
          [transaction_id || `MID-${order.order_code}`, `midtrans_${payment_type || "snap"}`, payment.id]
        );

        await connection.commit();
        return res.status(200).json({
          success: true,
          message: "Pembayaran Midtrans berhasil diverifikasi dan tiket telah diterbitkan",
          data: {
            order_status: "paid",
            payment_status: "success",
            midtrans: midtransRes,
          },
        });
      }

      if (isFailure && order.status === "pending") {
        const [items] = await connection.query(
          `SELECT ticket_category_id, quantity FROM order_items WHERE order_id = ?`,
          [order.id]
        );

        for (const item of items) {
          await connection.query(
            `UPDATE ticket_categories SET stock = stock + ? WHERE id = ?`,
            [item.quantity, item.ticket_category_id]
          );
        }

        const targetStatus = transaction_status === "expire" ? "expired" : "cancelled";
        await connection.query(`UPDATE orders SET status = ? WHERE id = ?`, [targetStatus, order.id]);
        await connection.query(
          `UPDATE payments SET payment_status = 'failed', reject_reason = ? WHERE id = ?`,
          [`Midtrans: ${transaction_status}`, payment.id]
        );

        await connection.commit();
        return res.status(200).json({
          success: true,
          message: `Transaksi Midtrans berstatus: ${targetStatus}`,
          data: {
            order_status: targetStatus,
            payment_status: "failed",
            midtrans: midtransRes,
          },
        });
      }

      await connection.commit();
      return res.status(200).json({
        success: true,
        message: `Status Midtrans: ${transaction_status}`,
        data: {
          order_status: order.status,
          payment_status: payment.payment_status,
          midtrans: midtransRes,
        },
      });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }
  } catch (error) {
    serverError(res, "Sync Midtrans Status", error);
  }
};

module.exports = {
  createPayment,
  paymentSuccess,
  uploadProof,
  listPayments,
  getProof,
  verifyPayment,
  rejectPayment,
  createMidtransSnapToken,
  getMidtransConfig,
  handleMidtransNotification,
  syncMidtransStatus,
};
