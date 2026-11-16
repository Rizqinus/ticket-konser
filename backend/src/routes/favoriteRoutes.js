const express = require("express");

const {
  getMyFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();


// GET MY FAVORITES
router.get(
  "/",
  authenticateToken,
  getMyFavorites
);


// ADD FAVORITE
router.post(
  "/:concertId",
  authenticateToken,
  addFavorite
);


// REMOVE FAVORITE
router.delete(
  "/:concertId",
  authenticateToken,
  removeFavorite
);


module.exports = router;