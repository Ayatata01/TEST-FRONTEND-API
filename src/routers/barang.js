const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/barang");
const JWT = require("../../middleware/authentication");

const router = express.Router();

router.get("/", JWT.VerifyToken, controller.GETBARANG);

router.post(
  "/",
  [
    body("image"),
    body("nama_barang").notEmpty(),
    body("harga_beli").notEmpty().isNumeric(),
    body("harga_jual").notEmpty().isNumeric(),
    body("stok").notEmpty().isNumeric(),
  ],
  JWT.VerifyToken,
  controller.CREATEBARANG
);

router.patch(
  "/:id",
  [
    body("image"),
    body("nama_barang").notEmpty(),
    body("harga_beli").notEmpty().isNumeric(),
    body("harga_jual").notEmpty().isNumeric(),
    body("stok").notEmpty().isNumeric(),
  ],
  JWT.VerifyToken,
  controller.UPDATEBARANG
);

router.delete("/:id", JWT.VerifyToken, controller.DELETEBARANG);

module.exports = router;
