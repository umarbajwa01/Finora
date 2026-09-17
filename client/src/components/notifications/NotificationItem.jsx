import { motion } from "framer-motion";
import { AlertTriangle, XCircle, Target, Repeat, FileText, Bell } from "lucide-react";
import { formatRelativeTime } from "../../utils/formatters";
import { cx } from "../../utils/cx";
import "./NotificationItem.css";

const TYPE_META = {
  budget_warning: { icon: AlertTriangle, className: "is-warning" },
  budget_exceeded: { icon: XCircle, className: "is-danger" },
  recurring_reminder: { icon: Repeat, className: "is-info" },
  goal_progress: { icon: Target, className: "is-gold" },
  monthly_summary: { icon: FileText, className: "is-info" },
  system: { icon: Bell, className: "is-info" },
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const meta = TYPE_META[notification.type] || TYPE_META.system;
  const Icon = meta.icon;

  return (
    <motion.div
      className={cx("notif-item", !notification.read && "is-unread")}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => !notification.read && onMarkRead(notification._id)}
    >
      <span className={cx("notif-item__icon", meta.className)}><Icon size={16} /></span>
      <div className="notif-item__body">
        <div className="notif-item__title">{notification.title}</div>
        <p>{notification.message}</p>
        <span className="notif-item__time">{formatRelativeTime(notification.createdAt)}</span>
      </div>
      {!notification.read && <span className="notif-item__dot" />}
    </motion.div>
  );
};

export default NotificationItem;
