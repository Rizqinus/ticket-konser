const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const PROOF_DIR = path.join(__dirname, "../../uploads/proofs");

// Ekstensi diambil dari mimetype atau ekstensi asli file
const EXT = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/jfif": ".jpg",
  "image/pjpeg": ".jpg",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        if (!fs.existsSync(PROOF_DIR)) {
          fs.mkdirSync(PROOF_DIR, { recursive: true });
        }
      } catch (err) {
        console.error("Gagal membuat direktori upload:", err);
      }
      cb(null, PROOF_DIR);
    },
    filename: (req, file, cb) => {
      const mime = (file.mimetype || "").toLowerCase();
      const ext = EXT[mime] || path.extname(file.originalname) || ".png";
      cb(null, crypto.randomUUID() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Naikkan limit ke 5MB agar foto kamera hp tidak terpotong
  fileFilter: (req, file, cb) => {
    const mime = (file.mimetype || "").toLowerCase();
    if (mime in EXT || mime.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Format gambar bukti transfer harus berupa JPG, PNG, atau WEBP"));
    }
  },
});

// Field form-data: "proof"
const uploadProofFile = (req, res, next) =>
  upload.single("proof")(req, res, (err) => {
    if (!err) return next();

    res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Ukuran foto bukti transfer maksimal 5MB"
          : err.message || "Gagal mengunggah foto bukti transfer",
    });
  });

module.exports = { uploadProofFile, PROOF_DIR };
