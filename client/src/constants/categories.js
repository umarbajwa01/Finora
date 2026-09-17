import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  Repeat,
  Home,
  Plane,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";

export const EXPENSE_CATEGORIES = [
  { value: "Food", label: "Food", icon: UtensilsCrossed, color: "var(--color-amber)" },
  { value: "Transport", label: "Transport", icon: Car, color: "var(--color-taupe)" },
  { value: "Shopping", label: "Shopping", icon: ShoppingBag, color: "var(--color-bronze)" },
  { value: "Bills", label: "Bills", icon: Receipt, color: "var(--color-red)" },
  { value: "Entertainment", label: "Entertainment", icon: Clapperboard, color: "var(--color-forest)" },
  { value: "Health", label: "Health", icon: HeartPulse, color: "var(--color-red)" },
  { value: "Education", label: "Education", icon: GraduationCap, color: "var(--color-olive)" },
  { value: "Subscriptions", label: "Subscriptions", icon: Repeat, color: "var(--color-gold)" },
  { value: "Rent", label: "Rent", icon: Home, color: "var(--color-espresso)" },
  { value: "Travel", label: "Travel", icon: Plane, color: "var(--color-green)" },
  { value: "Other", label: "Other", icon: MoreHorizontal, color: "var(--color-taupe)" },
];

export const INCOME_CATEGORIES = [
  { value: "Salary", label: "Salary", icon: Briefcase, color: "var(--color-green)" },
  { value: "Freelance", label: "Freelance", icon: Laptop, color: "var(--color-gold)" },
  { value: "Business", label: "Business", icon: TrendingUp, color: "var(--color-bronze)" },
  { value: "Investment", label: "Investment", icon: TrendingUp, color: "var(--color-forest)" },
  { value: "Gift", label: "Gift", icon: Gift, color: "var(--color-amber)" },
  { value: "Refund", label: "Refund", icon: RotateCcw, color: "var(--color-taupe)" },
  { value: "Other", label: "Other", icon: MoreHorizontal, color: "var(--color-taupe)" },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryMeta = (name) =>
  ALL_CATEGORIES.find((c) => c.value === name) || {
    value: name,
    label: name,
    icon: MoreHorizontal,
    color: "var(--color-taupe)",
  };

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "wallet", label: "Wallet" },
  { value: "other", label: "Other" },
];

export const RECURRING_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD"];

export const ANALYTICS_RANGES = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
];
