import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetApi } from "../api/budget.api";
import { USE_MOCK } from "../constants/config";
import { mockBudgets } from "../mocks/mockData";

const QUERY_KEY = "budgets";

const statusFromPercentage = (pct) => {
  if (pct >= 100) return "exceeded";
  if (pct >= 90) return "critical";
  if (pct >= 75) return "warning";
  return "on_track";
};

export const useBudgets = () =>
  useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => (USE_MOCK ? Promise.resolve({ data: mockBudgets }) : budgetApi.list()),
  });

export const useCreateBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      if (USE_MOCK) {
        const item = {
          _id: `b_${Date.now()}`,
          ...payload,
          usage: { used: 0, remaining: payload.amount, percentage: 0, daysRemaining: 30, status: "on_track" },
        };
        mockBudgets.unshift(item);
        return Promise.resolve({ data: item });
      }
      return budgetApi.create(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => {
      if (USE_MOCK) {
        const idx = mockBudgets.findIndex((b) => b._id === id);
        if (idx !== -1) {
          mockBudgets[idx] = { ...mockBudgets[idx], ...payload };
          const pct = mockBudgets[idx].usage.percentage;
          mockBudgets[idx].usage.status = statusFromPercentage(pct);
        }
        return Promise.resolve({ data: mockBudgets[idx] });
      }
      return budgetApi.update(id, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_MOCK) {
        const idx = mockBudgets.findIndex((b) => b._id === id);
        if (idx !== -1) mockBudgets.splice(idx, 1);
        return Promise.resolve({ data: null });
      }
      return budgetApi.remove(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
