import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";
import { USE_MOCK } from "../constants/config";
import { mockNotifications } from "../mocks/mockData";

const QUERY_KEY = "notifications";

const mockFetch = () => {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  return Promise.resolve({ data: { notifications: [...mockNotifications], unreadCount } });
};

export const useNotifications = () =>
  useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => (USE_MOCK ? mockFetch() : notificationApi.list()),
    refetchInterval: 60000,
  });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      if (USE_MOCK) {
        const n = mockNotifications.find((item) => item._id === id);
        if (n) n.read = true;
        return Promise.resolve({ data: n });
      }
      return notificationApi.markRead(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => {
      if (USE_MOCK) {
        mockNotifications.forEach((n) => { n.read = true; });
        return Promise.resolve({ data: null });
      }
      return notificationApi.markAllRead();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
