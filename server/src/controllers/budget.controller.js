const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Budget = require("../models/Budget");
const { getBudgetUsage } = require("../services/budget.service");

const computeEndDate = (startDate, period) => {
  const end = new Date(startDate);
  if (period === "weekly") end.setDate(end.getDate() + 7);
  else if (period === "yearly") end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1); // monthly default
  return end;
};

// GET /api/budgets
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ userId: req.userId }).sort({ createdAt: -1 });
  const withUsage = await Promise.all(
    budgets.map(async (b) => ({ ...b.toObject(), usage: await getBudgetUsage(b) }))
  );
  res.json(new ApiResponse(200, withUsage));
});

// POST /api/budgets
const createBudget = asyncHandler(async (req, res) => {
  const { category, amount, period } = req.body;
  const startDate = req.body.startDate || new Date();
  const endDate = req.body.endDate || computeEndDate(startDate, period);

  const budget = await Budget.create({
    userId: req.userId,
    category,
    amount,
    period,
    startDate,
    endDate,
  });

  res.status(201).json(new ApiResponse(201, budget, "Budget created."));
});

// PUT /api/budgets/:id
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!budget) throw new ApiError(404, "Budget not found.");
  res.json(new ApiResponse(200, budget, "Budget updated."));
});

// DELETE /api/budgets/:id
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!budget) throw new ApiError(404, "Budget not found.");
  res.json(new ApiResponse(200, null, "Budget deleted."));
});

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };
