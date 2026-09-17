const express = require("express");

const authRoutes = require("./auth.routes");
const transactionRoutes = require("./transaction.routes");
const analyticsRoutes = require("./analytics.routes");
const budgetRoutes = require("./budget.routes");
const goalRoutes = require("./goal.routes");
const notificationRoutes = require("./notification.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/budgets", budgetRoutes);
router.use("/goals", goalRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", userRoutes);

module.exports = router;
