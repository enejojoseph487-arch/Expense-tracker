const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

// POST /api/auth/register  (always creates a normal "user")
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({ token: signToken(user._id), user: publicUser(user) });
  }),
);

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: (email || "").toLowerCase(),
    }).select("+password");
    if (!user || !(await user.matchPassword(password || ""))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: signToken(user._id), user: publicUser(user) });
  }),
);

// GET /api/auth/me
// meaning of JWT token.
router.get("/me", protect, (req, res) => {
  console.log("req.user=", req.user);
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
