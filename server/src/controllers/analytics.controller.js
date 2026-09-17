const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const analyticsService = require("../services/analytics.service");

// GET /api/analytics/summary
const getSummary = asyncHandler(async (req, res) => {
  const summary = await analyticsService.getSummary(req.userId);
  res.json(new ApiResponse(200, summary));
});

// GET /api/analytics/spending?range=30d
const getSpending = asyncHandler(async (req, res) => {
  const range = req.query.range || "30d";
  const trend = await analyticsService.getSpendingTrend(req.userId, range);
  res.json(new ApiResponse(200, trend));
});

// GET /api/analytics/income-expense?months=6
const getIncomeVsExpense = asyncHandler(async (req, res) => {
  const months = Number(req.query.months) || 6;
  const data = await analyticsService.getIncomeVsExpense(req.userId, months);
  res.json(new ApiResponse(200, data));
});

// GET /api/analytics/categories?range=30d&type=expense
const getCategories = asyncHandler(async (req, res) => {
  const range = req.query.range || "30d";
  const type = req.query.type || "expense";
  const data = await analyticsService.getCategoryBreakdown(req.userId, range, type);
  res.json(new ApiResponse(200, data));
});

// GET /api/analytics/insights
const getInsights = asyncHandler(async (req, res) => {
  const insights = await analyticsService.generateInsights(req.userId);
  res.json(new ApiResponse(200, insights));
});

module.exports = { getSummary, getSpending, getIncomeVsExpense, getCategories, getInsights };
