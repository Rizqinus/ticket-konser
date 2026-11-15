const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const POSTER_DIR = path.join(__dirname, "../../uploads/posters");

const EXT = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        if (!fs.existsSync(POSTER_DIR)) {
          fs.mkdirSync(POSTER_DIR, { recursive: true });
        }
      } catch (err) {
        console.error("Gagal membuat direktori upload poster:", err);
      }
      cb(null, POSTER_DIR);
    },
    filename: (req, file, cb) => {
      const ext = EXT[file.mimetype] || path.extname(file.originalname) || ".jpg";
      cb(null, crypto.randomUUID() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar (png, jpg, webp)"));
    }
  },
});

const uploadPosterFile = (req, res, next) =>
  upload.single("image")(req, res, (err) => {
    if (!err) return next();
    res.status(400).json({
      success: false,
      message: err.message || "Gagal mengupload poster",
    });
  });

module.exports = { uploadPosterFile, POSTER_DIR };
