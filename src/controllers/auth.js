const User = require("../models/users");
const Authentication = require("../../middleware/authentication");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.Login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const userData = await User.findOne({ username: username });

    if (userData) {
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (isPasswordMatch) {
        const user = {
          id_user: userData._id,
        };

        const jwt = Authentication.CreateToken(user);

        res.status(200).json({
          jwt,
        });
      } else {
        res.json({
          message: "password mismatch",
        });
      }
    } else {
      res.status(404).json({
        message: "akun tidak ditemukan",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

exports.Register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const username = req.body.username;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  const saveData = {
    username,
    password: hashedPassword,
  };

  try {
    const findUsername = await User.findOne({ username: username });

    if (findUsername) {
      return res.status(200).json({
        message: "username sudah digunakan",
      });
    }

    await User.create(saveData);

    res.status(201).json({
      message: "akun berhasil dibuat",
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
