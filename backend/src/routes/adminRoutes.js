const express = require("express");

const { getDashboard } = require("../controllers/adminController");
const { getAllUsers, updateUserRole } = require("../controllers/adminUserController");
const { getAdminReport } = require("../controllers/adminReportController");
const {
  listPayments,
  getProof,
  verifyPayment,
  rejectPayment,
  syncMidtransStatus,
} = require("../controllers/paymentController");

const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// Semua route di bawah ini khusus admin
router.use(authenticateToken, authorizeRole("admin"));

// Dashboard
router.get("/dashboard", getDashboard);

// Laporan penjualan (?start_date&end_date&concert_id)
router.get("/reports", getAdminReport);

// Pengguna
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

// Verifikasi transaksi (?status=waiting|approved|rejected)
router.get("/payments", listPayments);
router.get("/payments/:id/proof", getProof);
router.patch("/payments/:id/verify", verifyPayment);
router.patch("/payments/:id/reject", rejectPayment);
router.post("/payments/:order_code/sync-midtrans", syncMidtransStatus);

module.exports = router;
