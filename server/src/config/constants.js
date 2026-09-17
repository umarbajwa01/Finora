const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Subscriptions",
  "Rent",
  "Travel",
  "Other",
];

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Refund",
  "Other",
];

const RECURRING_FREQUENCIES = ["daily", "weekly", "monthly", "yearly"];

const PAYMENT_METHODS = ["cash", "card", "bank_transfer", "wallet", "other"];

const NOTIFICATION_TYPES = [
  "budget_warning",
  "budget_exceeded",
  "recurring_reminder",
  "goal_progress",
  "monthly_summary",
  "system",
];

const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD"];

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  RECURRING_FREQUENCIES,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  CURRENCIES,
};
