import api from "./axios";

export const analyticsApi = {
  summary: () => api.get("/analytics/summary").then((r) => r.data),
  spending: (range) => api.get("/analytics/spending", { params: { range } }).then((r) => r.data),
  incomeVsExpense: (months) =>
    api.get("/analytics/income-expense", { params: { months } }).then((r) => r.data),
  categories: (range, type) =>
    api.get("/analytics/categories", { params: { range, type } }).then((r) => r.data),
  insights: () => api.get("/analytics/insights").then((r) => r.data),
};
