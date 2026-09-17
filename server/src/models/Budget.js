const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    period: { type: String, enum: ["weekly", "monthly", "yearly"], default: "monthly" },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    alertThresholds: {
      type: [Number],
      default: [75, 90, 100],
    },
    lastAlertedThreshold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, category: 1, startDate: -1 });

module.exports = mongoose.model("Budget", budgetSchema);
