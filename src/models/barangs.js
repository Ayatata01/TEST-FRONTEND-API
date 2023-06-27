const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Barangs = new Schema(
  {
    foto_barang: {
      type: String,
      required: true,
    },
    nama_barang: {
      type: String,
      required: true,
      unique: true,
    },
    harga_beli: {
      type: Number,
      required: true,
    },
    harga_jual: {
      type: Number,
      required: true,
    },
    stok: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Barangs", Barangs);
