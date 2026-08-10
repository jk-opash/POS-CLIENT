"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead, markAllAsRead } from "../../store/slices/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Clock, Info, AlertTriangle, CheckCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";
import LottieLoader from "../common/LottieLoader";

export function NotificationSlider({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { items: notifications, loading, unreadCount } = useSelector((state) => state.notifications || { items: [], loading: false, unreadCount: 0 });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isOpen]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getBgColor = (type, isRead) => {
    if (isRead) return "bg-white";
    switch (type?.toLowerCase()) {
      case "success":
        return "bg-emerald-50";
      case "warning":
        return "bg-amber-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-indigo-50";
    }
  };

  // Close when clicking escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent body scrolling
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Slider Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                  <p className="text-sm text-slate-500">
                    {unreadCount} unread update{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                    title="Mark all as read"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
              {loading && notifications.length === 0 ? (
                <div className="p-8 flex flex-col items-center">
                  <LottieLoader size={60} text="Loading notifications..." />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                  <div className="h-16 w-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">All caught up!</h3>
                  <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                    You have no new notifications at the moment.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100/60">
                  {notifications.map((notification, index) => {
                    const isRead = notification.isRead || notification.read || notification.is_read;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={notification.id || index}
                        className={cn(
                          "p-4 sm:p-5 flex gap-4 transition-colors relative group border-b border-slate-100",
                          getBgColor(notification.type, isRead),
                          !isRead && "hover:bg-indigo-50/50 cursor-pointer"
                        )}
                        onClick={() => !isRead && handleMarkAsRead(notification.id)}
                      >
                        {!isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                        )}
                        
                        <div className="shrink-0 mt-0.5">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center shadow-sm",
                            isRead ? "bg-slate-100" : "bg-white"
                          )}>
                            {getIcon(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={cn(
                              "text-sm font-bold text-slate-800",
                              !isRead && "text-slate-900"
                            )}>
                              {notification.title || notification.subject || "Notification"}
                            </h4>
                          </div>
                          <p className={cn(
                            "text-sm text-slate-600 mb-2",
                            !isRead && "text-slate-700 font-medium"
                          )}>
                            {notification.message || notification.description || "You have a new update."}
                          </p>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium uppercase tracking-wider">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.created_at || notification.createdAt || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
