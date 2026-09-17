const { z } = require("zod");
const { RECURRING_FREQUENCIES, PAYMENT_METHODS } = require("../config/constants");

const recurringSchema = z
  .object({
    frequency: z.enum(RECURRING_FREQUENCIES),
    endDate: z.coerce.date().optional().nullable(),
  })
  .optional()
  .nullable();

const createTransactionSchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Type is required" }),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().max(120).optional().default(""),
  note: z.string().trim().max(500).optional().default(""),
  date: z.coerce.date().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional().default("card"),
  location: z.string().trim().max(120).optional().default(""),
  receiptUrl: z.string().trim().optional().default(""),
  isRecurring: z.boolean().optional().default(false),
  recurring: recurringSchema,
});

const updateTransactionSchema = createTransactionSchema.partial();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  type: z.enum(["income", "expense", "all"]).optional().default("all"),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  sort: z
    .enum(["newest", "oldest", "highest", "lowest"])
    .optional()
    .default("newest"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
  listQuerySchema,
};
