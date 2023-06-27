const jwt = require("jsonwebtoken");
require("dotenv").config();

const CreateToken = (user) => {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "1h" });
};

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ status: 403, "message ": "Invalid Access Token" });
    }

    req.user = user;
    next();
  });
};

module.exports = { CreateToken, VerifyToken };
