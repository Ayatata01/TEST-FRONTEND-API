const Barang = require("../models/barangs");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");

exports.GETBARANG = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchQuery = req.query.search || "";

  try {
    const query = {};
    if (searchQuery) {
      query.nama_barang = { $regex: new RegExp(searchQuery, "i") };
    }

    const totalBarangs = await Barang.countDocuments(query);
    const totalPages = Math.ceil(totalBarangs / limit);

    const barangs = await Barang.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      totalPages,
      totalBarangs,
      data: barangs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

exports.CREATEBARANG = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      Filepath = path.join(__dirname, "../..", req.file.path);
      fs.unlink(Filepath, (err) => console.log("err :", err));
    }
    return res
      .status(400)
      .json({ statusCode: 400, validationError: errors.array() });
  }

  const { nama_barang, harga_beli, harga_jual, stok } = req.body;

  try {
    const barang = await Barang.findOne({ nama_barang: nama_barang });
    if (barang) {
      if (req.file) {
        Filepath = path.join(__dirname, "../..", req.file.path);
        fs.unlink(Filepath, (err) => console.log("err :", err));
      }
      res.status(400).json({
        statusCode: 400,
        msg: `barang dengan nama ${nama_barang} sudah ada!`,
      });
    }
    const newBarang = await Barang.create({
      foto_barang: req.file.path,
      nama_barang: nama_barang,
      harga_beli: harga_beli,
      harga_jual: harga_jual,
      stok: stok,
    });

    res.status(201).json({
      msg: "Barang berhasil dibuat",
      data: newBarang,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

exports.UPDATEBARANG = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      Filepath = path.join(__dirname, "../..", req.file.path);
      fs.unlink(Filepath, (err) => console.log("err :", err));
    }
    return res
      .status(400)
      .json({ statusCode: 400, validationError: errors.array() });
  }

  const { nama_barang, harga_beli, harga_jual, stok } = req.body;
  const barangId = req.params.id;

  try {
    const barang = await Barang.findById(barangId);
    if (barang) {
      Filepath = path.join(__dirname, "../..", barang.foto_barang);
      fs.unlink(Filepath, (err) => console.log("err :", err));
    }

    const updatedBarang = await Barang.findByIdAndUpdate(
      barangId,
      {
        foto_barang: req.file.path,
        nama_barang: nama_barang,
        harga_beli: harga_beli,
        harga_jual: harga_jual,
        stok: stok,
      },
      { new: true }
    );

    if (!updatedBarang) {
      return res.status(404).json({
        msg: "Barang tidak ditemukan",
      });
    }

    res.status(200).json({
      msg: "Barang berhasil diperbarui",
      data: updatedBarang,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

exports.DELETEBARANG = async (req, res, next) => {
  const barangId = req.params.id;

  try {
    const barang = await Barang.findById(barangId);
    if (barang) {
      Filepath = path.join(__dirname, "../..", barang.foto_barang);
      fs.unlink(Filepath, (err) => console.log("err :", err));
    }
    const deletedBarang = await Barang.findByIdAndDelete(barangId);

    if (!deletedBarang) {
      return res.status(404).json({
        msg: "Barang tidak ditemukan",
      });
    }

    res.status(200).json({
      msg: "Barang berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
