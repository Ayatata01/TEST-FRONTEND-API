const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/auth");
const JWT = require("../../middleware/authentication");

const router = express.Router();

router.post(
  "/login",
  [
    body("username").notEmpty(),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  controller.Login
);
router.post(
  "/register",
  [
    body("username").notEmpty().isString(),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  controller.Register
);

module.exports = router;
