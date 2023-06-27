const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const auth = require("./routers/auth");
const barang = require("./routers/barang");
const FILE = require("../utils/file_manager");
const path = require("path");
require("dotenv").config;

// DATABASE CONFIGURATION
mongoose
  .connect(
    `mongodb://seco:seco@ac-ixm2sjd-shard-00-00.jdpfnzu.mongodb.net:27017,ac-ixm2sjd-shard-00-01.jdpfnzu.mongodb.net:27017,ac-ixm2sjd-shard-00-02.jdpfnzu.mongodb.net:27017/?ssl=true&replicaSet=atlas-cmxyzd-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("successfully connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

// EXPRESS CONFIGURATION
const app = express();
const port = process.env.PORT || 5000;

app.use(FILE.upload.single("image"));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(express.json());

// CORS CONFIGURATION
app.use(cors());

// ROUTER CONFIGURATION
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "API TEST FRONTEND BY YOGA RIZYA PRATAMA",
  });
});

app.use("/auth", auth);
app.use("/barang", barang);

app.use((err, req, res, next) => {
  if (err) {
    if (req.file) {
      // Hapus file gambar yang diunggah
      fs.unlinkSync(req.file.path);
    }
    if (err instanceof multer.MulterError) {
      // Jika terjadi error multer
      let message = "Terjadi kesalahan saat mengunggah gambar";

      if (err.code === "LIMIT_FILE_SIZE") {
        message = "Ukuran gambar terlalu besar. Maksimum 100KB diizinkan";
      } else if (err.code === "LIMIT_FILE_TYPE") {
        message =
          "Format file tidak didukung. Hanya file JPG dan PNG yang diperbolehkan";
      }

      return res.status(400).json({ statusCode: 400, error: message });
    }
    res.status(400).json({ statusCode: 400, msg: err.message });
  }
  next(err);
});

module.exports = app;
