const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

const { ObjectId } = mongoose.Types;

// Computes how much of a budget has been used within its active period.
const getBudgetUsage = async (budget) => {
  const rows = await Transaction.aggregate([
    {
      $match: {
        userId: new ObjectId(budget.userId),
        type: "expense",
        category: budget.category,
        date: { $gte: budget.startDate, $lte: budget.endDate },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const used = rows[0]?.total || 0;
  const percentage = budget.amount > 0 ? Number(((used / budget.amount) * 100).toFixed(1)) : 0;
  const remaining = Math.max(budget.amount - used, 0);
  const daysRemaining = Math.max(
    Math.ceil((new Date(budget.endDate) - new Date()) / (1000 * 60 * 60 * 24)),
    0
  );

  let status = "on_track";
  if (percentage >= 100) status = "exceeded";
  else if (percentage >= 90) status = "critical";
  else if (percentage >= 75) status = "warning";

  return { used, remaining, percentage, daysRemaining, status };
};

// Checks a budget against alert thresholds and creates a notification if a new
// threshold has just been crossed (avoids duplicate spam via lastAlertedThreshold).
const checkBudgetAlerts = async (budget) => {
  const usage = await getBudgetUsage(budget);
  const crossedThresholds = (budget.alertThresholds || [75, 90, 100]).filter(
    (t) => usage.percentage >= t && t > budget.lastAlertedThreshold
  );

  if (crossedThresholds.length > 0) {
    const highest = Math.max(...crossedThresholds);
    await Notification.create({
      userId: budget.userId,
      title: highest >= 100 ? "Budget exceeded" : "Budget warning",
      message: `You've used ${usage.percentage}% of your ${budget.category} budget.`,
      type: highest >= 100 ? "budget_exceeded" : "budget_warning",
      meta: { budgetId: budget._id, percentage: usage.percentage },
    });
    budget.lastAlertedThreshold = highest;
    await budget.save();
  }

  return usage;
};

module.exports = { getBudgetUsage, checkBudgetAlerts };
