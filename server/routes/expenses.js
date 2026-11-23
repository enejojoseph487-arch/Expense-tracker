const express = require("express");
const Expense = require("../models/Expense");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

// Only these fields can be set from the request body
const pick = ({ title, amount, category, date, note }) => ({
  title,
  amount,
  category,
  date,
  note,
});

// GET /api/expenses  -> my expenses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  })
);
// adding a new expense
// POST /api/expenses
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const expense = await Expense.create({ ...pick(req.body), user: req.user._id });
    res.status(201).json(expense);
  })
);

// updating an expense
// PUT /api/expenses/:id
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  })
);

// DELETE /api/expenses/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  })
);

module.exports = router;
