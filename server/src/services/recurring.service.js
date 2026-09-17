const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

const FREQUENCY_TO_MS = {
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: null, // handled with calendar month math
  yearly: null, // handled with calendar year math
};

const advanceDate = (date, frequency) => {
  const next = new Date(date);
  if (frequency === "daily") next.setDate(next.getDate() + 1);
  else if (frequency === "weekly") next.setDate(next.getDate() + 7);
  else if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
  else if (frequency === "yearly") next.setFullYear(next.getFullYear() + 1);
  return next;
};

// Finds all recurring templates whose nextRunDate has passed, generates the
// concrete transaction, advances the schedule, and creates a reminder notification.
// Intended to be invoked by a scheduled job (e.g. node-cron) or an admin/cron endpoint.
const processDueRecurringTransactions = async () => {
  const now = new Date();

  const dueTemplates = await Transaction.find({
    isRecurring: true,
    "recurring.active": true,
    "recurring.nextRunDate": { $lte: now },
  });

  const generated = [];

  for (const template of dueTemplates) {
    if (template.recurring.endDate && template.recurring.endDate < now) {
      template.recurring.active = false;
      await template.save();
      continue;
    }

    const newTransaction = await Transaction.create({
      userId: template.userId,
      type: template.type,
      amount: template.amount,
      category: template.category,
      description: template.description,
      note: template.note,
      date: template.recurring.nextRunDate,
      paymentMethod: template.paymentMethod,
      location: template.location,
      generatedFrom: template._id,
      isRecurring: false,
    });

    generated.push(newTransaction);

    await Notification.create({
      userId: template.userId,
      title: "Recurring transaction processed",
      message: `${template.description || template.category}: $${template.amount.toFixed(
        2
      )} was recorded automatically.`,
      type: "recurring_reminder",
      meta: { transactionId: newTransaction._id },
    });

    template.recurring.lastGeneratedAt = now;
    template.recurring.nextRunDate = advanceDate(
      template.recurring.nextRunDate,
      template.recurring.frequency
    );
    await template.save();
  }

  return generated;
};

module.exports = { processDueRecurringTransactions, advanceDate };
