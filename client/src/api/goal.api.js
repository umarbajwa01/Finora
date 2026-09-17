import api from "./axios";

export const goalApi = {
  list: () => api.get("/goals").then((r) => r.data),
  create: (payload) => api.post("/goals", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/goals/${id}`, payload).then((r) => r.data),
  contribute: (id, amount) =>
    api.patch(`/goals/${id}/contribute`, { amount }).then((r) => r.data),
  remove: (id) => api.delete(`/goals/${id}`).then((r) => r.data),
};
