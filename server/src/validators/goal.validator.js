const { z } = require("zod");

const createGoalSchema = z.object({
  name: z.string().trim().min(1, "Goal name is required").max(60),
  icon: z.string().trim().optional().default("target"),
  color: z.string().trim().optional().default("#0EA5A5"),
  targetAmount: z.coerce.number().positive("Target amount must be greater than 0"),
  currentAmount: z.coerce.number().min(0).optional().default(0),
  targetDate: z.coerce.date({ required_error: "Target date is required" }),
});

const updateGoalSchema = createGoalSchema.partial();

const contributeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

module.exports = { createGoalSchema, updateGoalSchema, contributeSchema };
