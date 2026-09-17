const express = require("express");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createBudgetSchema, updateBudgetSchema } = require("../validators/budget.validator");
const budgetController = require("../controllers/budget.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", budgetController.getBudgets);
router.post("/", validate(createBudgetSchema), budgetController.createBudget);
router.put("/:id", validate(updateBudgetSchema), budgetController.updateBudget);
router.delete("/:id", budgetController.deleteBudget);

module.exports = router;
