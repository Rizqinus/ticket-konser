const express = require("express");

const {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} = require("../controllers/artistController");

const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");

const { uploadArtistFile } = require("../middlewares/uploadArtist");

const router = express.Router();

router.get("/", authenticateToken, getArtists);
router.get("/:id", authenticateToken, getArtistById);

// Upload gambar artis (multipart form-data 'image')
router.post(
  "/upload",
  authenticateToken,
  authorizeRole("admin"),
  uploadArtistFile,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File gambar artis wajib diunggah",
      });
    }
    const imageUrl = `/uploads/artists/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "Gambar artis berhasil diunggah",
      data: {
        url: imageUrl,
        filename: req.file.filename,
      },
    });
  }
);

router.post("/", authenticateToken, authorizeRole("admin"), createArtist);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateArtist);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteArtist);

module.exports = router;
