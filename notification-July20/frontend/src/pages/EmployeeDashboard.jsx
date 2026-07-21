import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import ToastStack from '../components/ToastStack.jsx';

// How often to check the server for new notifications.
const POLL_INTERVAL_MS = 12000;

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview' },
  { key: 'profile', label: 'My Profile' },
  { key: 'tasks', label: 'My Tasks' },
  { key: 'meetings', label: 'Meetings' },
];

export default function EmployeeDashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editForm, setEditForm] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const seenIds = useRef(new Set());

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [me, myTasks, myMeetings, myNotifs] = await Promise.all([
        api.getMe(token),
        api.getMyTasks(token),
        api.getMyMeetings(token),
        api.getMyNotifications(token),
      ]);
      setProfile(me);
      setEditForm({ dob: me.dob?.slice(0, 10) || '', phone: me.phone || '', address: me.address || '', salary: me.salary || 0 });
      setTasks(myTasks);
      setMeetings(myMeetings);
      setNotifications(myNotifs);
      // Notifications that already existed on first load shouldn't pop up
      // as toasts — only ones that arrive afterwards should.
      seenIds.current = new Set(myNotifs.map((n) => n.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Poll for new notifications. Anything with an id we haven't seen yet
  // slides in as a toast; it's already in `notifications` (and therefore
  // the bell) the moment it's fetched, so the toast is purely an
  // additional, temporary heads-up.
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const fresh = await api.getMyNotifications(token);
        const incoming = fresh.filter((n) => !seenIds.current.has(n.id));
        if (incoming.length > 0) {
          incoming.forEach((n) => seenIds.current.add(n.id));
          setToasts((prev) => [...prev, ...incoming]);
        }
        setNotifications(fresh);
      } catch (err) {
        console.error(err);
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [token]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaveMsg('');
    try {
      const updated = await api.updateMe(token, editForm);
      setProfile(updated);
      setSaveMsg('Profile updated.');
    } catch (err) {
      setSaveMsg(err.message);
    }
  }

  async function handleTaskStatus(id, status) {
    const updated = await api.updateTaskStatus(token, id, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleMarkRead(id) {
    await api.markNotificationRead(token, id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  async function handleMarkAllRead() {
    await api.markAllNotificationsRead(token);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (loading || !profile) {
    return <div className="shell"><div className="main">Loading…</div></div>;
  }

  return (
    <div className="shell">
      <ToastStack toasts={toasts} onDone={dismissToast} />
      <aside className="sidebar">
        <div className="sidebar__brand">Roster <span>EMP</span></div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={tab === item.key ? 'active' : ''}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          Signed in as<br /><strong style={{ color: '#fff' }}>{user.email}</strong>
          <div>
            <button className="sidebar__logout" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <h1>{tab === 'overview' ? `Welcome, ${profile.full_name.split(' ')[0]}` : NAV_ITEMS.find((n) => n.key === tab)?.label}</h1>
            <div className="topbar__sub">{profile.designation || 'Employee'} · {profile.department || '—'}</div>
          </div>
          <NotificationBell notifications={notifications} onMarkRead={handleMarkRead} onMarkAllRead={handleMarkAllRead} />
        </div>

        {tab === 'overview' && (
          <div className="grid-2">
            <div className="badge">
              <div className="badge__code">{profile.employee_code}</div>
              <div className="badge__name">{profile.full_name}</div>
              <div className="badge__role">{profile.designation || 'Employee'} · {profile.department || '—'}</div>
              <div className="badge__divider" />
              <div className="badge__row"><span>Date of birth</span><b>{profile.dob ? new Date(profile.dob).toLocaleDateString() : '—'}</b></div>
              <div className="badge__row"><span>Phone</span><b>{profile.phone || '—'}</b></div>
              <div className="badge__row"><span>Salary</span><b>₹{Number(profile.salary).toLocaleString()}</b></div>
              <div className="badge__row"><span>Joined</span><b>{new Date(profile.date_joined).toLocaleDateString()}</b></div>
            </div>

            <div className="card">
              <div className="card__title">Upcoming meetings</div>
              {meetings.length === 0 && <div className="empty-state">No meetings scheduled.</div>}
              {meetings.slice(0, 4).map((m) => (
                <div className="row-item" key={m.id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate)' }}>{new Date(m.meeting_time).toLocaleString()}{m.location ? ` · ${m.location}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <div className="card__title">Recent tasks</div>
              {tasks.length === 0 && <div className="empty-state">No tasks assigned yet.</div>}
              {tasks.slice(0, 5).map((t) => (
                <div className="row-item" key={t.id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate)' }}>{t.due_date ? `Due ${new Date(t.due_date).toLocaleDateString()}` : 'No due date'}</div>
                  </div>
                  <span className={`pill pill--${t.status}`}>{t.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="card" style={{ maxWidth: 480 }}>
            <div className="card__title">Edit my info</div>
            <form onSubmit={handleSaveProfile}>
              <div className="field">
                <label>Date of birth</label>
                <input type="date" value={editForm.dob} onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>Address</label>
                <textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
              </div>
              <div className="field">
                <label>Salary (₹)</label>
                <input type="number" value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} />
                <div className="hint-text">Editable per your request — most companies gate this behind admin approval.</div>
              </div>
              <button className="btn" type="submit">Save changes</button>
              {saveMsg && <div className="hint-text" style={{ marginTop: 10 }}>{saveMsg}</div>}
            </form>
          </div>
        )}

        {tab === 'tasks' && (
          <div className="card">
            <div className="card__title">All my tasks</div>
            {tasks.length === 0 && <div className="empty-state">Nothing assigned yet — enjoy the calm.</div>}
            {tasks.map((t) => (
              <div className="row-item" key={t.id}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                  {t.description && <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 2 }}>{t.description}</div>}
                  <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 4 }}>
                    {t.due_date ? `Due ${new Date(t.due_date).toLocaleDateString()}` : 'No due date'} · <span className={`pill pill--${t.priority}`}>{t.priority}</span>
                  </div>
                </div>
                <select value={t.status} onChange={(e) => handleTaskStatus(t.id, e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {tab === 'meetings' && (
          <div className="card">
            <div className="card__title">My meetings</div>
            {meetings.length === 0 && <div className="empty-state">No meetings scheduled.</div>}
            {meetings.map((m) => (
              <div className="row-item" key={m.id}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>
                    {new Date(m.meeting_time).toLocaleString()}{m.location ? ` · ${m.location}` : ''}
                  </div>
                  {m.notes && <div style={{ fontSize: 13, marginTop: 4 }}>{m.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
