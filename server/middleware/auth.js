const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

// Requires a valid "Authorization: Bearer <token>" header
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ message: "User no longer exists" });

  req.user = user;
  next();
});

// Use after protect
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { protect, adminOnly };
