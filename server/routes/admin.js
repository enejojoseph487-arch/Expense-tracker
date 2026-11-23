const express = require("express");
const User = require("../models/User");
const Expense = require("../models/Expense");
const asyncHandler = require("../middleware/asyncHandler");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const [totalUsers, totalExpenses, totals, byCategory] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Expense.countDocuments(),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    res.json({
      totalUsers,
      totalExpenses,
      totalAmount: totals[0]?.total || 0,
      byCategory: byCategory.map((c) => ({ category: c._id, total: c.total })),
    });
  }),
);

// GET /api/admin/users
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  }),
);

// DELETE /api/admin/users/:id  (also removes that user's expenses)
router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    if (req.params.id === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await Expense.deleteMany({ user: user._id });
    res.json({ message: "User deleted" });
  }),
);

// GET /api/admin/expenses  -> everyone's expenses
router.get(
  "/expenses",
  asyncHandler(async (req, res) => {
    const expenses = await Expense.find()
      .populate("user", "name email")
      .sort({ date: -1 });
    res.json(expenses);
  }),
);

// DELETE /api/admin/expenses/:id
router.delete(
  "/expenses/:id",
  asyncHandler(async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  }),
);

module.exports = router;
