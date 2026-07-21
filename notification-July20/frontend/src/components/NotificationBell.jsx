import React, { useState } from 'react';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell({ notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button className="bell-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="bell-btn__count">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <strong style={{ fontSize: 14 }}>Notifications</strong>
            {unreadCount > 0 && (
              <button className="btn btn--ghost btn--sm" onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 && <div className="empty-state">You're all caught up.</div>}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif notif--${n.type} ${!n.is_read ? 'notif--unread' : ''}`}
              onClick={() => !n.is_read && onMarkRead(n.id)}
              style={{ cursor: n.is_read ? 'default' : 'pointer' }}
            >
              <div className="notif__title">{n.title}</div>
              <div className="notif__msg">{n.message}</div>
              <div className="notif__time">{timeAgo(n.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
