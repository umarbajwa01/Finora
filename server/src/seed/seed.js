require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const Notification = require("../models/Notification");

const EXPENSE_CATS = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Subscriptions"];
const INCOME_CATS = ["Salary", "Freelance"];

const randomBetween = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;
const randomDateWithinMonths = (months) => {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - months);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

const seed = async () => {
  await connectDB();

  console.log("Clearing existing demo data...");
  await User.deleteMany({ email: "demo@finora.app" });

  console.log("Creating demo user...");
  const user = await User.create({
    name: "Alex Morgan",
    email: "demo@finora.app",
    password: "Demo1234",
    currency: "USD",
    theme: "system",
  });

  console.log("Generating transactions...");
  const transactions = [];

  // Monthly salary for the last 6 months
  for (let i = 0; i < 6; i += 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(1);
    transactions.push({
      userId: user._id,
      type: "income",
      amount: randomBetween(4200, 4800),
      category: "Salary",
      description: "Monthly salary",
      date,
      paymentMethod: "bank_transfer",
    });
  }

  // Occasional freelance income
  for (let i = 0; i < 8; i += 1) {
    transactions.push({
      userId: user._id,
      type: "income",
      amount: randomBetween(150, 900),
      category: "Freelance",
      description: "Freelance project payment",
      date: randomDateWithinMonths(6),
      paymentMethod: "bank_transfer",
    });
  }

  // Expenses across categories
  for (let i = 0; i < 140; i += 1) {
    const category = EXPENSE_CATS[Math.floor(Math.random() * EXPENSE_CATS.length)];
    const amountRanges = {
      Food: [8, 60],
      Transport: [5, 45],
      Shopping: [15, 220],
      Bills: [40, 180],
      Entertainment: [10, 90],
      Subscriptions: [5, 20],
    };
    const [min, max] = amountRanges[category];

    transactions.push({
      userId: user._id,
      type: "expense",
      amount: randomBetween(min, max),
      category,
      description: `${category} purchase`,
      date: randomDateWithinMonths(6),
      paymentMethod: Math.random() > 0.5 ? "card" : "cash",
    });
  }

  await Transaction.insertMany(transactions);

  console.log("Creating budgets...");
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  await Budget.insertMany([
    { userId: user._id, category: "Food", amount: 300, startDate: startOfMonth, endDate: endOfMonth },
    { userId: user._id, category: "Transport", amount: 150, startDate: startOfMonth, endDate: endOfMonth },
    { userId: user._id, category: "Shopping", amount: 250, startDate: startOfMonth, endDate: endOfMonth },
    { userId: user._id, category: "Entertainment", amount: 100, startDate: startOfMonth, endDate: endOfMonth },
  ]);

  console.log("Creating goals...");
  await Goal.insertMany([
    {
      userId: user._id,
      name: "Emergency Fund",
      icon: "shield",
      color: "#0EA5A5",
      targetAmount: 10000,
      currentAmount: 4200,
      targetDate: new Date(now.getFullYear() + 1, now.getMonth(), 1),
    },
    {
      userId: user._id,
      name: "New Laptop",
      icon: "laptop",
      color: "#2563EB",
      targetAmount: 2000,
      currentAmount: 850,
      targetDate: new Date(now.getFullYear(), now.getMonth() + 4, 1),
    },
    {
      userId: user._id,
      name: "Japan Trip",
      icon: "plane",
      color: "#D97706",
      targetAmount: 3500,
      currentAmount: 1200,
      targetDate: new Date(now.getFullYear(), now.getMonth() + 8, 1),
    },
  ]);

  console.log("Creating notifications...");
  await Notification.insertMany([
    {
      userId: user._id,
      title: "Budget warning",
      message: "You've used 78% of your Food budget this month.",
      type: "budget_warning",
    },
    {
      userId: user._id,
      title: "Goal progress",
      message: "You're 42% of the way to your Emergency Fund goal.",
      type: "goal_progress",
    },
    {
      userId: user._id,
      title: "Monthly summary",
      message: "Your monthly financial summary is ready to view.",
      type: "monthly_summary",
    },
  ]);

  console.log("Seed complete.");
  console.log("Demo login -> email: demo@finora.app | password: Demo1234");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
