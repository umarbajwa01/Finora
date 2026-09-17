const express = require("express");
const { requireAuth } = require("../middleware/auth");
const analyticsController = require("../controllers/analytics.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/summary", analyticsController.getSummary);
router.get("/spending", analyticsController.getSpending);
router.get("/income-expense", analyticsController.getIncomeVsExpense);
router.get("/categories", analyticsController.getCategories);
router.get("/insights", analyticsController.getInsights);

module.exports = router;
