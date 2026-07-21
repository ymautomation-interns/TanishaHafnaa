import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationBell from '../components/NotificationBell.jsx';

const NAV_ITEMS = [
  { key: 'employees', label: 'Employees' },
  { key: 'tasks', label: 'Assign Task' },
  { key: 'meetings', label: 'Schedule Meeting' },
  { key: 'salary', label: 'Salary Credit' },
];

const emptyEmployeeForm = { fullName: '', email: '', password: '', department: '', designation: '', salary: '', dob: '', phone: '' };
const emptyTaskForm = { title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' };
const emptyMeetingForm = { employeeId: '', title: '', meetingTime: '', location: '', notes: '' };

export default function AdminDashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('employees');

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [meetingForm, setMeetingForm] = useState(emptyMeetingForm);
  const [salaryTarget, setSalaryTarget] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [showNewEmployee, setShowNewEmployee] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [emps, allTasks] = await Promise.all([api.getEmployees(token), api.getAllTasks(token)]);
      setEmployees(emps);
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Admin has no personal notifications by default in this scaffold — kept
  // empty-state ready in case you wire up admin-facing alerts later.
  useEffect(() => { setNotifications([]); }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  async function handleCreateEmployee(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api.createEmployee(token, employeeForm);
      setMsg('Employee created.');
      setEmployeeForm(emptyEmployeeForm);
      setShowNewEmployee(false);
      loadAll();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleAssignTask(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api.assignTask(token, taskForm);
      setMsg('Task assigned — employee has been notified.');
      setTaskForm(emptyTaskForm);
      loadAll();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleScheduleMeeting(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api.scheduleMeeting(token, meetingForm);
      setMsg('Meeting scheduled — employee has been notified.');
      setMeetingForm(emptyMeetingForm);
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function handleCreditSalary(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api.creditSalary(token, salaryTarget, { amount: salaryAmount || undefined });
      setMsg('Salary-credited notification sent.');
      setSalaryTarget('');
      setSalaryAmount('');
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__brand">Roster <span>ADMIN</span></div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.key} className={tab === item.key ? 'active' : ''} onClick={() => { setTab(item.key); setMsg(''); }}>
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
            <h1>{NAV_ITEMS.find((n) => n.key === tab)?.label}</h1>
            <div className="topbar__sub">{employees.length} employee{employees.length !== 1 ? 's' : ''} on roster</div>
          </div>
          <NotificationBell notifications={notifications} onMarkRead={() => {}} onMarkAllRead={() => {}} />
        </div>

        {msg && <div className="card" style={{ fontSize: 13.5, padding: 12, marginBottom: 16 }}>{msg}</div>}

        {tab === 'employees' && (
          <>
            <div className="card">
              <div className="card__title">
                Roster
                <button className="btn btn--sm" onClick={() => setShowNewEmployee((s) => !s)}>
                  {showNewEmployee ? 'Close' : '+ Add employee'}
                </button>
              </div>

              {showNewEmployee && (
                <form onSubmit={handleCreateEmployee} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
                  <div className="grid-2">
                    <div className="field"><label>Full name</label><input required value={employeeForm.fullName} onChange={(e) => setEmployeeForm({ ...employeeForm, fullName: e.target.value })} /></div>
                    <div className="field"><label>Email (login)</label><input required type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} /></div>
                    <div className="field"><label>Temporary password</label><input required value={employeeForm.password} onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })} /></div>
                    <div className="field"><label>Department</label><input value={employeeForm.department} onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })} /></div>
                    <div className="field"><label>Designation</label><input value={employeeForm.designation} onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })} /></div>
                    <div className="field"><label>Salary (₹)</label><input type="number" value={employeeForm.salary} onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })} /></div>
                    <div className="field"><label>Date of birth</label><input type="date" value={employeeForm.dob} onChange={(e) => setEmployeeForm({ ...employeeForm, dob: e.target.value })} /></div>
                    <div className="field"><label>Phone</label><input value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} /></div>
                  </div>
                  <button className="btn" type="submit">Create employee</button>
                </form>
              )}

              {employees.length === 0 && <div className="empty-state">No employees yet — add your first one above.</div>}
              {employees.map((emp) => (
                <div className="row-item" key={emp.id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.full_name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--slate)' }}>· {emp.employee_code}</span></div>
                    <div style={{ fontSize: 12, color: 'var(--slate)' }}>{emp.designation || '—'} · {emp.department || '—'} · {emp.email}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>₹{Number(emp.salary).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="card__title">All tasks across the team</div>
              {tasks.length === 0 && <div className="empty-state">No tasks assigned yet.</div>}
              {tasks.map((t) => (
                <div className="row-item" key={t.id}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate)' }}>{t.employee_name} {t.due_date ? `· Due ${new Date(t.due_date).toLocaleDateString()}` : ''}</div>
                  </div>
                  <span className={`pill pill--${t.status}`}>{t.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'tasks' && (
          <div className="card" style={{ maxWidth: 480 }}>
            <div className="card__title">Assign a task</div>
            <form onSubmit={handleAssignTask}>
              <div className="field">
                <label>Employee</label>
                <select required value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                  <option value="">Select employee</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_code})</option>)}
                </select>
              </div>
              <div className="field"><label>Task title</label><input required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} /></div>
              <div className="field"><label>Description</label><textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} /></div>
              <div className="grid-2">
                <div className="field">
                  <label>Priority</label>
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="field"><label>Due date</label><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} /></div>
              </div>
              <button className="btn" type="submit">Assign task</button>
              <div className="hint-text">The employee gets a notification in their panel instantly.</div>
            </form>
          </div>
        )}

        {tab === 'meetings' && (
          <div className="card" style={{ maxWidth: 480 }}>
            <div className="card__title">Schedule a meeting</div>
            <form onSubmit={handleScheduleMeeting}>
              <div className="field">
                <label>Employee</label>
                <select required value={meetingForm.employeeId} onChange={(e) => setMeetingForm({ ...meetingForm, employeeId: e.target.value })}>
                  <option value="">Select employee</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_code})</option>)}
                </select>
              </div>
              <div className="field"><label>Title</label><input required value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })} /></div>
              <div className="field"><label>Date &amp; time</label><input required type="datetime-local" value={meetingForm.meetingTime} onChange={(e) => setMeetingForm({ ...meetingForm, meetingTime: e.target.value })} /></div>
              <div className="field"><label>Location / link</label><input value={meetingForm.location} onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })} /></div>
              <div className="field"><label>Notes</label><textarea value={meetingForm.notes} onChange={(e) => setMeetingForm({ ...meetingForm, notes: e.target.value })} /></div>
              <button className="btn" type="submit">Schedule meeting</button>
            </form>
          </div>
        )}

        {tab === 'salary' && (
          <div className="card" style={{ maxWidth: 480 }}>
            <div className="card__title">Send salary-credited notification</div>
            <form onSubmit={handleCreditSalary}>
              <div className="field">
                <label>Employee</label>
                <select required value={salaryTarget} onChange={(e) => setSalaryTarget(e.target.value)}>
                  <option value="">Select employee</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_code})</option>)}
                </select>
              </div>
              <div className="field">
                <label>Amount (₹) — optional, defaults to their profile salary</label>
                <input type="number" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} />
              </div>
              <button className="btn" type="submit">Send notification</button>
              <div className="hint-text">This is a manual trigger for this scaffold — hook it up to your real payroll run to automate it.</div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
