import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics.api";
import { USE_MOCK } from "../constants/config";
import {
  mockSummary,
  mockInsights,
  buildSpendingTrend,
  buildIncomeVsExpense,
  buildCategoryBreakdown,
} from "../mocks/mockData";

export const useSummary = () =>
  useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: () => (USE_MOCK ? Promise.resolve({ data: mockSummary }) : analyticsApi.summary()),
  });

export const useSpendingTrend = (range) =>
  useQuery({
    queryKey: ["analytics", "spending", range],
    queryFn: () =>
      USE_MOCK
        ? Promise.resolve({ data: buildSpendingTrend(range) })
        : analyticsApi.spending(range),
  });

export const useIncomeVsExpense = (months = 6) =>
  useQuery({
    queryKey: ["analytics", "income-expense", months],
    queryFn: () =>
      USE_MOCK
        ? Promise.resolve({ data: buildIncomeVsExpense(months) })
        : analyticsApi.incomeVsExpense(months),
  });

export const useCategoryBreakdown = (range = "30d", type = "expense") =>
  useQuery({
    queryKey: ["analytics", "categories", range, type],
    queryFn: () =>
      USE_MOCK
        ? Promise.resolve({ data: buildCategoryBreakdown(range, type) })
        : analyticsApi.categories(range, type),
  });

export const useInsights = () =>
  useQuery({
    queryKey: ["analytics", "insights"],
    queryFn: () => (USE_MOCK ? Promise.resolve({ data: mockInsights }) : analyticsApi.insights()),
  });
