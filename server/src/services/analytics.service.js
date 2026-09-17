const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const { ObjectId } = mongoose.Types;

const RANGE_TO_DAYS = {
  "7d": 7,
  "30d": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

const getDateRange = (range) => {
  const days = RANGE_TO_DAYS[range] || 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

// Overall summary: total balance, income, expense, and month-over-month change.
const getSummary = async (userId) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [allTimeAgg, thisMonthAgg, lastMonthAgg] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { userId: new ObjectId(userId), date: { $gte: startOfThisMonth } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          date: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        },
      },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
  ]);

  const toMap = (agg) =>
    agg.reduce((acc, row) => ({ ...acc, [row._id]: row.total }), { income: 0, expense: 0 });

  const allTime = toMap(allTimeAgg);
  const thisMonth = toMap(thisMonthAgg);
  const lastMonth = toMap(lastMonthAgg);

  const totalBalance = allTime.income - allTime.expense;
  const thisMonthNet = thisMonth.income - thisMonth.expense;
  const lastMonthNet = lastMonth.income - lastMonth.expense;

  let monthlyChangePercent = 0;
  if (lastMonthNet !== 0) {
    monthlyChangePercent = ((thisMonthNet - lastMonthNet) / Math.abs(lastMonthNet)) * 100;
  } else if (thisMonthNet !== 0) {
    monthlyChangePercent = 100;
  }

  const savingsRate =
    thisMonth.income > 0
      ? ((thisMonth.income - thisMonth.expense) / thisMonth.income) * 100
      : 0;

  return {
    totalBalance,
    totalIncome: allTime.income,
    totalExpense: allTime.expense,
    thisMonthIncome: thisMonth.income,
    thisMonthExpense: thisMonth.expense,
    monthlyChangePercent: Number(monthlyChangePercent.toFixed(1)),
    savingsRate: Number(savingsRate.toFixed(1)),
  };
};

// Spending trend (for line/bar chart) grouped by day within a range.
const getSpendingTrend = async (userId, range) => {
  const { startDate, endDate } = getDateRange(range);

  const rows = await Transaction.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  const byDate = {};
  rows.forEach((row) => {
    const date = row._id.date;
    if (!byDate[date]) byDate[date] = { date, income: 0, expense: 0 };
    byDate[date][row._id.type] = row.total;
  });

  return Object.values(byDate);
};

// Income vs expense comparison, grouped by month, for the last N months.
const getIncomeVsExpense = async (userId, months = 6) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const rows = await Transaction.aggregate([
    { $match: { userId: new ObjectId(userId), date: { $gte: startDate } } },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%Y-%m", date: "$date" } },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const byMonth = {};
  rows.forEach((row) => {
    const month = row._id.month;
    if (!byMonth[month]) byMonth[month] = { month, income: 0, expense: 0 };
    byMonth[month][row._id.type] = row.total;
  });

  return Object.values(byMonth);
};

// Category breakdown (for donut chart + top categories list).
const getCategoryBreakdown = async (userId, range = "30d", type = "expense") => {
  const { startDate, endDate } = getDateRange(range);

  const rows = await Transaction.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
        type,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  return rows.map((r) => ({
    category: r._id,
    total: r.total,
    count: r.count,
    percentage: grandTotal > 0 ? Number(((r.total / grandTotal) * 100).toFixed(1)) : 0,
  }));
};

// Simple, explainable financial insights derived from real aggregated data.
const generateInsights = async (userId) => {
  const insights = [];

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthCats, lastMonthCats, summary] = await Promise.all([
    getCategoryBreakdownBetween(userId, startOfThisMonth, now, "expense"),
    getCategoryBreakdownBetween(userId, startOfLastMonth, startOfThisMonth, "expense"),
    getSummary(userId),
  ]);

  // Compare each category month over month
  const lastMap = Object.fromEntries(lastMonthCats.map((c) => [c.category, c.total]));
  thisMonthCats.forEach((cat) => {
    const prev = lastMap[cat.category];
    if (prev && prev > 0) {
      const changePct = ((cat.total - prev) / prev) * 100;
      if (Math.abs(changePct) >= 15) {
        insights.push({
          type: changePct > 0 ? "warning" : "positive",
          message: `You spent ${Math.abs(changePct).toFixed(0)}% ${
            changePct > 0 ? "more" : "less"
          } on ${cat.category} this month compared to last month.`,
        });
      }
    }
  });

  if (summary.savingsRate >= 0) {
    insights.push({
      type: "positive",
      message: `Your savings rate this month is ${summary.savingsRate}%.`,
    });
  } else {
    insights.push({
      type: "warning",
      message: `You spent more than you earned this month (savings rate ${summary.savingsRate}%).`,
    });
  }

  if (thisMonthCats.length >= 2) {
    insights.push({
      type: "info",
      message: `${thisMonthCats[1].category} is your second-highest expense category this month.`,
    });
  }

  return insights.slice(0, 5);
};

// Internal helper used only by generateInsights
const getCategoryBreakdownBetween = async (userId, start, end, type) => {
  const rows = await Transaction.aggregate([
    { $match: { userId: new ObjectId(userId), type, date: { $gte: start, $lt: end } } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);
  return rows.map((r) => ({ category: r._id, total: r.total }));
};

module.exports = {
  getSummary,
  getSpendingTrend,
  getIncomeVsExpense,
  getCategoryBreakdown,
  generateInsights,
  getDateRange,
};
