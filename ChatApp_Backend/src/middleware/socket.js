const jwt = require("jsonwebtoken");
const User = require("../models/user");

const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error("❌ Token missing"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return next(new Error("❌ User not found"));

    socket.user = user;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    if (err.name === "TokenExpiredError") {
      return next(new Error("❌ Token expired"));
    }
    next(new Error("❌ Invalid token"));
  }
};

module.exports = socketAuthMiddleware;
