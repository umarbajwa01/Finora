import api from "./axios";

export const transactionApi = {
  list: (params) => api.get("/transactions", { params }).then((r) => r.data),
  getById: (id) => api.get(`/transactions/${id}`).then((r) => r.data),
  create: (payload) => api.post("/transactions", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/transactions/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/transactions/${id}`).then((r) => r.data),
};
