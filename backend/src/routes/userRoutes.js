const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/userController");

const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();


// ========================================
// GET MY PROFILE
// ========================================

router.get(
  "/profile",
  authenticateToken,
  getMyProfile
);


// ========================================
// UPDATE MY PROFILE
// ========================================

router.put(
  "/profile",
  authenticateToken,
  updateMyProfile
);


module.exports = router;