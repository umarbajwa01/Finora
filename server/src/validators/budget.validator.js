const { z } = require("zod");

const createBudgetSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  amount: z.coerce.number().positive("Budget amount must be greater than 0"),
  period: z.enum(["weekly", "monthly", "yearly"]).optional().default("monthly"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

const updateBudgetSchema = createBudgetSchema.partial();

module.exports = { createBudgetSchema, updateBudgetSchema };
