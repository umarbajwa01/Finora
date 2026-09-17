import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalApi } from "../api/goal.api";
import { USE_MOCK } from "../constants/config";
import { mockGoals } from "../mocks/mockData";

const QUERY_KEY = "goals";

const computeProgress = (goal) => {
  const percentage = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const daysLeft = Math.max(Math.ceil((new Date(goal.targetDate) - new Date()) / 86400000), 0);
  return { percentage: Number(percentage.toFixed(1)), remaining, daysLeft };
};

export const useGoals = () =>
  useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => (USE_MOCK ? Promise.resolve({ data: mockGoals }) : goalApi.list()),
  });

export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      if (USE_MOCK) {
        const item = { _id: `g_${Date.now()}`, currentAmount: 0, ...payload };
        item.progress = computeProgress(item);
        mockGoals.unshift(item);
        return Promise.resolve({ data: item });
      }
      return goalApi.create(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => {
      if (USE_MOCK) {
        const idx = mockGoals.findIndex((g) => g._id === id);
        if (idx !== -1) {
          mockGoals[idx] = { ...mockGoals[idx], ...payload };
          mockGoals[idx].progress = computeProgress(mockGoals[idx]);
        }
        return Promise.resolve({ data: mockGoals[idx] });
      }
      return goalApi.update(id, payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useContributeToGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }) => {
      if (USE_MOCK) {
        const idx = mockGoals.findIndex((g) => g._id === id);
        if (idx !== -1) {
          mockGoals[idx].currentAmount = Math.min(
            mockGoals[idx].currentAmount + amount,
            mockGoals[idx].targetAmount
          );
          mockGoals[idx].progress = computeProgress(mockGoals[idx]);
        }
        return Promise.resolve({ data: mockGoals[idx] });
      }
      return goalApi.contribute(id, amount);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_MOCK) {
        const idx = mockGoals.findIndex((g) => g._id === id);
        if (idx !== -1) mockGoals.splice(idx, 1);
        return Promise.resolve({ data: null });
      }
      return goalApi.remove(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
