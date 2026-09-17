const express = require("express");
const { requireAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createGoalSchema,
  updateGoalSchema,
  contributeSchema,
} = require("../validators/goal.validator");
const goalController = require("../controllers/goal.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", goalController.getGoals);
router.post("/", validate(createGoalSchema), goalController.createGoal);
router.put("/:id", validate(updateGoalSchema), goalController.updateGoal);
router.patch("/:id/contribute", validate(contributeSchema), goalController.contributeToGoal);
router.delete("/:id", goalController.deleteGoal);

module.exports = router;
