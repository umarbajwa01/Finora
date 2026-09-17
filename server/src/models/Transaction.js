const mongoose = require("mongoose");
const { RECURRING_FREQUENCIES, PAYMENT_METHODS } = require("../config/constants");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 120, default: "" },
    note: { type: String, trim: true, maxlength: 500, default: "" },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "card",
    },
    location: { type: String, trim: true, default: "" },
    receiptUrl: { type: String, default: "" },
    isRecurring: { type: Boolean, default: false },
    recurring: {
      frequency: { type: String, enum: RECURRING_FREQUENCIES, default: null },
      nextRunDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      lastGeneratedAt: { type: Date, default: null },
      active: { type: Boolean, default: true },
    },
    // If this transaction was auto-generated from a recurring template
    generatedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, category: 1 });
transactionSchema.index({ userId: 1, "recurring.active": 1, "recurring.nextRunDate": 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
