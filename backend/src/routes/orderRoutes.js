const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  expireOrder,
} = require("../controllers/orderController");

const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

// CREATE ORDER
router.post(
  "/",
  authenticateToken,
  createOrder
);

// GET MY ORDERS
router.get(
  "/my-orders",
  authenticateToken,
  getMyOrders
);

// GET ORDER DETAIL
router.get(
  "/:id",
  authenticateToken,
  getOrderDetail
);
router.patch(
  "/:id/cancel",
  authenticateToken,
  cancelOrder, 
)

router.patch(
  "/:id/expire",
  authenticateToken,
  expireOrder,
)

module.exports = router;