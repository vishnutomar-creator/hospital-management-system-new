"use client";

import { useEffect, useState } from "react";
import { notificationAPI } from "../../services/api";
import {
  Bell,
  CheckCheck,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  CalendarDays,
  Package,
  Wallet,
  UserCog,
  Wrench,
} from "lucide-react";

/* ----------------------------- Dummy Data ----------------------------- */

const categories = [
  "All Categories",
  "Appointments",
  "Inventory",
  "HR",
  "Finance",
  "Assets",
];

const filters = ["All", "Unread"];

const typeStyles = {
  alert: {
    icon: AlertTriangle,
    iconBg:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    iconBg:
      "bg-[#FCEFC7] text-[#8A6D1D] dark:bg-[#FCEFC7]/10 dark:text-[#E8C766]",
  },
  success: {
    icon: CheckCircle2,
    iconBg:
      "bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#0F766E]/20 dark:text-[#5EEAD4]",
  },
  info: {
    icon: Info,
    iconBg: "bg-[#F1F3EF] text-[#64746E] dark:bg-white/10 dark:text-[#AAB6B0]",
  },
};

const categoryIcons = {
  Appointments: CalendarDays,
  Inventory: Package,
  HR: UserCog,
  Finance: Wallet,
  Assets: Wrench,
};

const initialNotifications = [
  {
    id: "NTF-901",
    category: "Inventory",
    type: "warning",
    title: "Low stock alert",
    message: "Metformin 500mg has dropped to 90 units, below the 150 reorder level.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "NTF-902",
    category: "Appointments",
    type: "info",
    title: "New appointment booked",
    message: "Kavya Reddy scheduled with Dr. Shreya Iyer for 3:00 PM tomorrow.",
    time: "32 min ago",
    read: false,
  },
  {
    id: "NTF-903",
    category: "Assets",
    type: "alert",
    title: "Maintenance overdue",
    message: "Ambulance (AST-1007) service ticket MNT-502 is past its due date.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "NTF-904",
    category: "HR",
    type: "info",
    title: "Leave request submitted",
    message: "Rahul Verma applied for 1 day of casual leave on Aug 29.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "NTF-905",
    category: "Finance",
    type: "success",
    title: "Payment received",
    message: "₹42,500 collected from Meera Joshi against bill BIL-4401.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "NTF-906",
    category: "Inventory",
    type: "alert",
    title: "Expiry warning",
    message: "Insulin Glargine batch expires within 7 days — 35 units in stock.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "NTF-907",
    category: "HR",
    type: "success",
    title: "Payroll processed",
    message: "August payroll for Nursing department has been marked as paid.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "NTF-908",
    category: "Appointments",
    type: "warning",
    title: "Appointment no-show",
    message: "Kavya Reddy missed her 3:00 PM appointment with Dr. Shreya Iyer.",
    time: "Yesterday",
    read: true,
  },
];

/* --------------------------------- Page -------------------------------- */

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getMyNotifications();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((n) => ({
          id: n._id || n.id,
          category: n.category || "Appointments",
          type: n.type || "info",
          title: n.title || "Hospital Alert",
          message: n.message || n.content || "Notification detail",
          time: n.createdAt ? String(n.createdAt).slice(11, 16) : "Just now",
          read: !!n.read,
        }));
        setNotifications(formatted);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.warn("Notification API load notice:", err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    const matchesFilter = filter === "All" || !n.read;
    const matchesCategory =
      category === "All Categories" || n.category === category;
    return matchesFilter && matchesCategory;
  });

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationAPI.markAllAsRead();
    } catch (err) {
      console.warn("Mark read API notice:", err.message);
    }
  };

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const dismiss = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationAPI.deleteNotification(id);
    } catch (err) {
      console.warn("Delete notification API notice:", err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[#87938E]">
        <span>Hospital</span>
        <span>›</span>
        <span className="font-semibold text-[#17201D] dark:text-white">
          Notifications
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#17201D] dark:text-white">
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#0F766E] px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-[#7B8882] dark:text-[#87938E]">
            Stay on top of alerts across the hospital.
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-[#0F766E] px-4 py-2.5
            text-sm font-semibold text-white
            transition hover:bg-[#0F766E]/90
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#17201D]">
        <div className="flex gap-1 rounded-xl bg-[#F1F3EF] p-1 dark:bg-white/5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                rounded-lg px-4 py-1.5 text-sm font-semibold transition
                ${
                  filter === f
                    ? "bg-white text-[#0F766E] shadow-sm dark:bg-[#17201D] dark:text-[#5EEAD4]"
                    : "text-[#64746E] dark:text-[#AAB6B0]"
                }
              `}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-[#E3E0D7] bg-[#FAFAF7] px-3 py-2 text-sm text-[#52615B] outline-none focus:border-[#0F766E] dark:border-white/10 dark:bg-[#202B27] dark:text-[#AAB6B0]"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Notification List */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white dark:border-white/10 dark:bg-[#17201D]">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F3EF] text-[#8A9691] dark:bg-white/10">
              <Bell size={20} />
            </div>
            <p className="text-sm text-[#87938E]">
              You're all caught up — no notifications here.
            </p>
          </div>
        )}

        {filtered.map((n, idx) => {
          const { icon: TypeIcon, iconBg } = typeStyles[n.type];
          const CategoryIcon = categoryIcons[n.category];

          return (
            <div
              key={n.id}
              className={`
                group flex items-start gap-4 px-5 py-4
                ${idx !== filtered.length - 1 ? "border-b border-[#EEECE5] dark:border-white/10" : ""}
                ${!n.read ? "bg-[#F7FBFA] dark:bg-[#0F766E]/5" : ""}
              `}
            >
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
              >
                <TypeIcon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]" />
                      )}
                      <p className="truncate font-semibold text-[#17201D] dark:text-white">
                        {n.title}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-[#52615B] dark:text-[#AAB6B0]">
                      {n.message}
                    </p>
                  </div>

                  <button
                    onClick={() => dismiss(n.id)}
                    className="shrink-0 rounded-lg p-1 text-[#B8BFBB] opacity-0 transition hover:bg-[#F1F3EF] hover:text-[#64746E] group-hover:opacity-100 dark:hover:bg-white/10"
                    aria-label="Dismiss notification"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#F1F3EF] px-2.5 py-1 text-[11px] font-semibold text-[#52615B] dark:bg-white/10 dark:text-[#AAB6B0]">
                    <CategoryIcon size={11} />
                    {n.category}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#87938E]">{n.time}</span>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-xs font-semibold text-[#0F766E] hover:underline dark:text-[#5EEAD4]"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}