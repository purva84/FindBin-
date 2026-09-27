import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCircle2,
  Package,
  Truck,
  Star,
  Clock,
  Trash2,
  CheckCheck,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    user,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    requests,
    setSelectedRequestForJourney,
    setSelectedRequestForFeedback,
  } = useApp();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  // Filter for current user's notifications
  const userNotifs = notifications.filter(
    (n) => n.user_id === user.id || !n.user_id
  );

  const displayedNotifs =
    filter === 'unread' ? userNotifs.filter((n) => !n.read) : userNotifs;

  const unreadCount = userNotifs.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'collected':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'assigned':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'feedback':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  const getBadgeStyle = (type: AppNotification['type']) => {
    switch (type) {
      case 'confirmation':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'collected':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold';
      case 'assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'feedback':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const handleAction = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (!notif.request_id) return;

    const req = requests.find((r) => r.id === notif.request_id);
    if (!req) return;

    if (notif.type === 'collected') {
      setSelectedRequestForFeedback(req);
    } else {
      setSelectedRequestForJourney(req);
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 sm:right-4 top-16 w-[92vw] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-fadeIn"
    >
      {/* Header */}
      <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900">Notifications</h3>
            <p className="text-[11px] text-stone-500">
              {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Mark read</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-100 px-4 pt-2 bg-white text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-3 border-b-2 cursor-pointer transition-colors ${
            filter === 'all'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          All ({userNotifs.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 px-3 border-b-2 cursor-pointer transition-colors ${
            filter === 'unread'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-stone-100">
        {displayedNotifs.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-xs font-bold text-stone-800">No notifications</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {filter === 'unread'
                ? "You've read all your recent notifications."
                : 'Confirmations and pickup status updates will appear here.'}
            </p>
          </div>
        ) : (
          displayedNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-3.5 transition-colors relative hover:bg-stone-50/80 cursor-pointer ${
                !notif.read ? 'bg-emerald-50/30' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon box */}
                <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200/80 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getBadgeStyle(
                        notif.type
                      )}`}
                    >
                      {notif.type === 'confirmation'
                        ? 'Confirmed'
                        : notif.type === 'collected'
                        ? 'Collected 🎉'
                        : notif.type === 'assigned'
                        ? 'Collector'
                        : notif.type === 'feedback'
                        ? 'Rating'
                        : 'Update'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {notif.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  {/* Actions row */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {notif.action_label && notif.request_id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(notif);
                        }}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                          notif.type === 'collected'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {notif.type === 'collected' && <Sparkles className="w-3 h-3 text-amber-300" />}
                        <span>{notif.action_label}</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                      </button>
                    ) : <div />}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="text-stone-300 hover:text-rose-500 p-1 rounded-md transition-colors"
                      title="Remove notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
        <p className="text-[10px] text-stone-400">
          FindBin Live Notification Service ♻️
        </p>
      </div>
    </div>
  );
};
