const express = require("express");

const {
  createPayment,
  paymentSuccess,
  uploadProof,
  createMidtransSnapToken,
  getMidtransConfig,
  handleMidtransNotification,
  syncMidtransStatus,
} = require("../controllers/paymentController");

const authenticateToken = require("../middlewares/authMiddleware");
const { uploadProofFile } = require("../middlewares/uploadProof");

const router = express.Router();

// Webhook notifikasi Midtrans (dipanggil oleh server Midtrans, tanpa JWT)
router.post("/midtrans/notification", handleMidtransNotification);

// Konfigurasi Midtrans publik (client key & environment)
router.get("/midtrans/config", getMidtransConfig);

// Cek / sinkronisasi status transaksi langsung dari Midtrans API
router.get("/midtrans/status/:order_code", authenticateToken, syncMidtransStatus);
router.post("/midtrans/sync/:order_code", authenticateToken, syncMidtransStatus);

// Buat Snap Token Midtrans untuk order tertentu
router.post("/midtrans/snap-token", authenticateToken, createMidtransSnapToken);

// Membuat pembayaran (mendukung manual_transfer atau midtrans)
router.post("/", authenticateToken, createPayment);

// Pembayaran sukses (tidak untuk manual_transfer)
router.patch("/:id/success", authenticateToken, paymentSuccess);

// Upload bukti transfer manual (form-data: proof, sender_bank, sender_name)
router.post(
  "/:id/proof",
  authenticateToken,
  uploadProofFile,
  uploadProof
);

module.exports = router;
