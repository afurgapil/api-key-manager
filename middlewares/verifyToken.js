const jwt = require("jsonwebtoken");
const pool = require("../utils/settings/usePool");

const secretKey = process.env.SECRET_KEY;

module.exports = async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  const userId = req.body.userId;
  if (!token) {
    return res.status(401).json({ error: "Token not found." });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }

    if (userId === decoded.userId) {
      next();
    } else {
      console.error("Token verification error: ");
      res.status(500).json({ error: "Token verification error." });
    }
  });
};
