import api from "./axios";

export const userApi = {
  me: () => api.get("/users/me").then((r) => r.data),
  updateMe: (payload) => api.put("/users/me", payload).then((r) => r.data),
  changePassword: (payload) => api.post("/users/change-password", payload).then((r) => r.data),
  // A plain <a href> download can't carry the Authorization header, so the
  // protected /users/export route would 401. Instead we fetch it through the
  // authenticated axios instance as a blob, then trigger the save manually.
  exportTransactions: async () => {
    const response = await api.get("/users/export", { responseType: "blob" });
    downloadBlob(response.data, "finora-transactions.csv");
  },
};

const downloadBlob = (blobData, filename) => {
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadCSVBlob = downloadBlob;
