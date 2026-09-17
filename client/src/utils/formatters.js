const CURRENCY_SYMBOLS = { USD: "$", EUR: "€", GBP: "£", PKR: "₨", INR: "₹", AED: "د.إ", CAD: "$", AUD: "$" };

export const formatCurrency = (amount, currency = "USD") => {
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  const value = Number(amount || 0);
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
};

export const formatCompactCurrency = (amount, currency = "USD") => {
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  const value = Number(amount || 0);
  if (Math.abs(value) >= 1000) {
    return `${symbol}${(value / 1000).toFixed(1)}k`;
  }
  return `${symbol}${value.toFixed(0)}`;
};

export const formatDate = (date, options = {}) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });

export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export const formatRelativeTime = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

export const formatMonthLabel = (yyyymm) => {
  const [year, month] = yyyymm.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
};
