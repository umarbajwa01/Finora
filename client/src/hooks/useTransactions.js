import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../api/transaction.api";
import { USE_MOCK } from "../constants/config";
import { mockTransactions } from "../mocks/mockData";

const QUERY_KEY = "transactions";

// Applies the same filter/sort/paginate contract the backend uses, so the
// mock layer behaves identically to the real API from the UI's perspective.
const mockList = (params = {}) => {
  let items = [...mockTransactions];

  if (params.type && params.type !== "all") {
    items = items.filter((t) => t.type === params.type);
  }
  if (params.category) {
    items = items.filter((t) => t.category === params.category);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(
      (t) =>
        t.description?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)
    );
  }
  if (params.minAmount !== undefined) items = items.filter((t) => t.amount >= params.minAmount);
  if (params.maxAmount !== undefined) items = items.filter((t) => t.amount <= params.maxAmount);

  const sortFns = {
    newest: (a, b) => new Date(b.date) - new Date(a.date),
    oldest: (a, b) => new Date(a.date) - new Date(b.date),
    highest: (a, b) => b.amount - a.amount,
    lowest: (a, b) => a.amount - b.amount,
  };
  items.sort(sortFns[params.sort] || sortFns.newest);

  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return Promise.resolve({
    data: {
      items: paged,
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
        hasMore: start + paged.length < items.length,
      },
    },
  });
};

export const useTransactions = (params) =>
  useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => (USE_MOCK ? mockList(params) : transactionApi.list(params)),
    keepPreviousData: true,
  });

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      if (USE_MOCK) {
        const item = { _id: `t_${Date.now()}`, ...payload, date: payload.date || new Date().toISOString() };
        mockTransactions.unshift(item);
        return Promise.resolve({ data: item });
      }
      return transactionApi.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useUpdateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => {
      if (USE_MOCK) {
        const idx = mockTransactions.findIndex((t) => t._id === id);
        if (idx !== -1) mockTransactions[idx] = { ...mockTransactions[idx], ...payload };
        return Promise.resolve({ data: mockTransactions[idx] });
      }
      return transactionApi.update(id, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_MOCK) {
        const idx = mockTransactions.findIndex((t) => t._id === id);
        if (idx !== -1) mockTransactions.splice(idx, 1);
        return Promise.resolve({ data: null });
      }
      return transactionApi.remove(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
