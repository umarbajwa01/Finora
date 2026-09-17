const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Goal = require("../models/Goal");

const withProgress = (goal) => {
  const obj = goal.toObject ? goal.toObject() : goal;
  const percentage =
    obj.targetAmount > 0 ? Math.min((obj.currentAmount / obj.targetAmount) * 100, 100) : 0;
  const remaining = Math.max(obj.targetAmount - obj.currentAmount, 0);

  const daysLeft = Math.max(
    Math.ceil((new Date(obj.targetDate) - new Date()) / (1000 * 60 * 60 * 24)),
    0
  );

  return {
    ...obj,
    progress: {
      percentage: Number(percentage.toFixed(1)),
      remaining,
      daysLeft,
    },
  };
};

// GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, goals.map(withProgress)));
});

// POST /api/goals
const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, userId: req.userId });
  res.status(201).json(new ApiResponse(201, withProgress(goal), "Goal created."));
});

// PUT /api/goals/:id
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!goal) throw new ApiError(404, "Goal not found.");
  res.json(new ApiResponse(200, withProgress(goal), "Goal updated."));
});

// PATCH /api/goals/:id/contribute
const contributeToGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
  if (!goal) throw new ApiError(404, "Goal not found.");

  goal.currentAmount += req.body.amount;
  if (goal.currentAmount >= goal.targetAmount) {
    goal.currentAmount = goal.targetAmount;
    goal.isCompleted = true;
  }
  await goal.save();

  res.json(new ApiResponse(200, withProgress(goal), "Contribution added."));
});

// DELETE /api/goals/:id
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!goal) throw new ApiError(404, "Goal not found.");
  res.json(new ApiResponse(200, null, "Goal deleted."));
});

module.exports = { getGoals, createGoal, updateGoal, contributeToGoal, deleteGoal };
