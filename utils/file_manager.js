const multer = require("multer");
const path = require("path");

//Set up
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

//Filter jenis image yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png"];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format file tidak didukung. Hanya file JPG dan PNG yang diperbolehkan"
      )
    );
  }
};

// Membuat middleware untuk mengunggah file gambar
exports.upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 100 * 1024, // Ukuran maksimum 100KB
  },
  fileFilter: fileFilter,
});
