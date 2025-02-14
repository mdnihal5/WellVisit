const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(403)
      .json({ message: "Authorization header is required" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
