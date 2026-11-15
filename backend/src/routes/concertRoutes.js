const express = require("express");

const {
  getAllConcerts,
  getConcertById,
  createConcert,
  updateConcert,
  deleteConcert, 
} = require("../controllers/concertController");

const {
  getConcertArtists,
  addArtistToConcert,
  removeArtistFromConcert,
} = require("../controllers/concertArtistController");

const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const { uploadPosterFile } = require("../middlewares/uploadPoster");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// GET semua konser
router.get("/", getAllConcerts);

// GET detail konser
router.get("/:id", getConcertById);

// GET lineup artis konser
router.get("/:concertId/artists", getConcertArtists);


// ========================================
// ADMIN ROUTES
// ========================================

// POST tambah konser (dukung multipart file upload 'image')
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  uploadPosterFile,
  createConcert
);

// PUT edit konser (dukung multipart file upload 'image')
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  uploadPosterFile,
  updateConcert
);

// DELETE hapus konser
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteConcert
);

// POST tambah artis ke lineup (body: { artist_id })
router.post(
  "/:concertId/artists",
  authenticateToken,
  authorizeRole("admin"),
  addArtistToConcert
);

// DELETE hapus artis dari lineup
router.delete(
  "/:concertId/artists/:artistId",
  authenticateToken,
  authorizeRole("admin"),
  removeArtistFromConcert
);

module.exports = router;