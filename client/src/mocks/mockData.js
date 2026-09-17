// Mock/demo data layer used only when USE_MOCK is true (see constants/config.js).
// This is intentionally isolated from the real api/*.api.js files so it can be
// deleted or disabled without touching any real API integration code.

const rand = (min, max) => Math.round((Math.random() * (max - min) + min) * 100) / 100;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const mockUser = {
  id: "u_demo_1",
  name: "Eleanor Whitfield",
  email: "eleanor.whitfield@finora.app",
  avatar: "",
  currency: "USD",
  theme: "system",
  notificationPreferences: {
    budgetWarnings: true,
    recurringReminders: true,
    goalProgress: true,
    monthlySummary: true,
  },
};

const EXPENSE_CATS = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Subscriptions", "Health"];

const genTransactions = () => {
  const items = [];
  let id = 1;

  for (let i = 0; i < 6; i += 1) {
    items.push({
      _id: `t_income_${id++}`,
      type: "income",
      amount: rand(6200, 6800),
      category: "Salary",
      description: "Monthly salary",
      date: daysAgo(i * 30 + 2),
      paymentMethod: "bank_transfer",
    });
  }

  for (let i = 0; i < 6; i += 1) {
    items.push({
      _id: `t_freelance_${id++}`,
      type: "income",
      amount: rand(300, 1400),
      category: "Freelance",
      description: "Client project payment",
      date: daysAgo(rand(2, 175)),
      paymentMethod: "bank_transfer",
    });
  }

  const descriptions = {
    Food: ["Whole Foods", "Blue Bottle Coffee", "Nobu Dinner", "Sunday Farmers Market"],
    Transport: ["Uber", "Metro Card", "Gas Station", "Parking"],
    Shopping: ["Nordstrom", "Apple Store", "Sephora", "Amazon"],
    Bills: ["Electricity", "Water & Sewer", "Internet", "Phone Plan"],
    Entertainment: ["Cinema", "Concert Tickets", "Spotify", "Museum"],
    Subscriptions: ["Netflix", "iCloud+", "The Economist", "Notion"],
    Health: ["Pharmacy", "Gym Membership", "Dental Checkup", "Yoga Studio"],
  };

  for (let i = 0; i < 160; i += 1) {
    const category = EXPENSE_CATS[Math.floor(Math.random() * EXPENSE_CATS.length)];
    const ranges = {
      Food: [12, 85],
      Transport: [8, 55],
      Shopping: [20, 340],
      Bills: [45, 210],
      Entertainment: [15, 120],
      Subscriptions: [6, 25],
      Health: [15, 140],
    };
    const [min, max] = ranges[category];
    const descList = descriptions[category];

    items.push({
      _id: `t_exp_${id++}`,
      type: "expense",
      amount: rand(min, max),
      category,
      description: descList[Math.floor(Math.random() * descList.length)],
      date: daysAgo(rand(0, 180)),
      paymentMethod: Math.random() > 0.5 ? "card" : "cash",
    });
  }

  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const mockTransactions = genTransactions();

export const mockBudgets = [
  { _id: "b1", category: "Food", amount: 800, period: "monthly", usage: { used: 620, remaining: 180, percentage: 77.5, daysRemaining: 9, status: "warning" } },
  { _id: "b2", category: "Transport", amount: 300, period: "monthly", usage: { used: 145, remaining: 155, percentage: 48.3, daysRemaining: 9, status: "on_track" } },
  { _id: "b3", category: "Shopping", amount: 500, period: "monthly", usage: { used: 470, remaining: 30, percentage: 94, daysRemaining: 9, status: "critical" } },
  { _id: "b4", category: "Entertainment", amount: 200, period: "monthly", usage: { used: 212, remaining: 0, percentage: 106, daysRemaining: 9, status: "exceeded" } },
  { _id: "b5", category: "Subscriptions", amount: 80, period: "monthly", usage: { used: 42, remaining: 38, percentage: 52.5, daysRemaining: 9, status: "on_track" } },
];

export const mockGoals = [
  {
    _id: "g1",
    name: "Emergency Fund",
    icon: "shield",
    color: "#b89b62",
    targetAmount: 20000,
    currentAmount: 12400,
    targetDate: new Date(new Date().getFullYear() + 1, 2, 1).toISOString(),
    progress: { percentage: 62, remaining: 7600, daysLeft: 340 },
  },
  {
    _id: "g2",
    name: "Travel Fund",
    icon: "plane",
    color: "#4f6f52",
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: new Date(new Date().getFullYear(), 11, 1).toISOString(),
    progress: { percentage: 64, remaining: 1800, daysLeft: 95 },
  },
  {
    _id: "g3",
    name: "New Laptop",
    icon: "laptop",
    color: "#8f7448",
    targetAmount: 2800,
    currentAmount: 900,
    targetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 4, 1).toISOString(),
    progress: { percentage: 32, remaining: 1900, daysLeft: 120 },
  },
];

export const mockNotifications = [
  { _id: "n1", title: "Budget warning", message: "You've used 94% of your Shopping budget this month.", type: "budget_warning", read: false, createdAt: daysAgo(0.2) },
  { _id: "n2", title: "Budget exceeded", message: "Your Entertainment budget has been exceeded by $12.", type: "budget_exceeded", read: false, createdAt: daysAgo(0.8) },
  { _id: "n3", title: "Goal progress", message: "You're 64% of the way to your Travel Fund goal.", type: "goal_progress", read: true, createdAt: daysAgo(2) },
  { _id: "n4", title: "Recurring transaction processed", message: "Netflix: $15.99 was recorded automatically.", type: "recurring_reminder", read: true, createdAt: daysAgo(3) },
  { _id: "n5", title: "Monthly summary", message: "Your monthly financial summary for last month is ready.", type: "monthly_summary", read: true, createdAt: daysAgo(6) },
];

export const mockSummary = {
  totalBalance: 24680.5,
  totalIncome: 48200,
  totalExpense: 23519.5,
  thisMonthIncome: 6800,
  thisMonthExpense: 3940,
  monthlyChangePercent: 8.4,
  savingsRate: 42.1,
};

export const mockInsights = [
  { type: "warning", message: "You spent 18% more on dining this month compared to last month." },
  { type: "positive", message: "Your savings rate improved to 42.1% this month." },
  { type: "info", message: "Shopping is your second-highest expense category this month." },
  { type: "positive", message: "You're on track to reach your Travel Fund goal by November." },
];

// Builds a spending trend series for a given range, from the mock transactions.
export const buildSpendingTrend = (range) => {
  const daysMap = { "7d": 7, "30d": 30, "3m": 90, "6m": 180, "1y": 365 };
  const days = daysMap[range] || 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const byDate = {};
  mockTransactions
    .filter((t) => new Date(t.date) >= cutoff)
    .forEach((t) => {
      const key = t.date.split("T")[0];
      if (!byDate[key]) byDate[key] = { date: key, income: 0, expense: 0 };
      byDate[key][t.type] += t.amount;
    });

  return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const buildIncomeVsExpense = (months = 6) => {
  const byMonth = {};
  mockTransactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = { month: key, income: 0, expense: 0 };
    byMonth[key][t.type] += t.amount;
  });
  return Object.values(byMonth)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .slice(-months);
};

export const buildCategoryBreakdown = (range = "30d", type = "expense") => {
  const daysMap = { "7d": 7, "30d": 30, "3m": 90, "6m": 180, "1y": 365 };
  const days = daysMap[range] || 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const byCategory = {};
  mockTransactions
    .filter((t) => t.type === type && new Date(t.date) >= cutoff)
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });

  const total = Object.values(byCategory).reduce((s, v) => s + v, 0);

  return Object.entries(byCategory)
    .map(([category, value]) => ({
      category,
      total: value,
      percentage: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.total - a.total);
};
