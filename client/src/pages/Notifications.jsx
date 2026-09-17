import { Bell, CheckCheck } from "lucide-react";
import NotificationItem from "../components/notifications/NotificationItem";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import Button from "../components/common/Button";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "../hooks/useNotifications";
import "./Notifications.css";

const Notifications = () => {
  const { data, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  return (
    <div>
      <div className="notifications-page__toolbar">
        <p className="notifications-page__hint">
          {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up."}
        </p>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={() => markAllRead.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="We couldn't load your notifications." onRetry={refetch} />}

      {!isLoading && !isError && notifications.length === 0 && (
        <EmptyState icon={Bell} title="No notifications" message="Budget alerts, goal milestones and reminders will show up here." />
      )}

      {notifications.length > 0 && (
        <div className="notifications-page__list">
          {notifications.map((n) => (
            <NotificationItem key={n._id} notification={n} onMarkRead={(id) => markRead.mutate(id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
