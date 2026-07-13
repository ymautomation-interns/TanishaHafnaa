import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard, Users, Settings as SettingsIcon, Search, Plus, Pencil, Trash2, X,
  Sun, Moon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserCheck, UserX, TrendingUp
} from 'lucide-react';

/* ================================================================== */
/*  Design tokens                                                      */
/* ================================================================== */
const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const DEPARTMENTS = [
  { name: 'Engineering', color: '#3E6259' },
  { name: 'Design', color: '#B5613E' },
  { name: 'Sales', color: '#C9A15A' },
  { name: 'Marketing', color: '#6B5B95' },
  { name: 'HR', color: '#4C7A94' },
  { name: 'Finance', color: '#8A8F6B' },
];

const ROLES = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'QA Engineer', 'DevOps Engineer'],
  Design: ['Product Designer', 'UX Researcher', 'Visual Designer'],
  Sales: ['Account Executive', 'Sales Development Rep', 'Sales Manager'],
  Marketing: ['Marketing Specialist', 'Content Strategist', 'Growth Marketer'],
  HR: ['HR Generalist', 'Recruiter', 'People Ops Lead'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager'],
};

const THEMES = {
  light: {
    name: 'light', bg: '#EAF0EF', surface: '#FFFFFF', surfaceAlt: '#F3F6F5',
    border: '#D7E0DE', text: '#152420', textSoft: '#5B6B67',
    accent: '#C9A15A', accentText: '#3B2E12',
    sidebarBg: '#0F1F1C', sidebarText: '#CFE0DB', sidebarTextSoft: '#7FA398',
    danger: '#B5482F',
  },
  dark: {
    name: 'dark', bg: '#0B1512', surface: '#111F1B', surfaceAlt: '#0E1A17',
    border: '#20302B', text: '#EAF2EF', textSoft: '#8FA39D',
    accent: '#D9A85C', accentText: '#241B08',
    sidebarBg: '#081512', sidebarText: '#CFE0DB', sidebarTextSoft: '#5D7A72',
    danger: '#E07A5A',
  },
};

const STATUS_COLORS = {
  Active: { bg: 'rgba(62,124,107,0.15)', text: '#3E7C6B' },
  'On Leave': { bg: 'rgba(193,99,62,0.15)', text: '#C1633E' },
};

/* ================================================================== */
/*  useLocalStorage — reusable custom hook (req 6)                     */
/*  Claude.ai artifacts run in a sandboxed iframe where the real        */
/*  window.localStorage throws / isn't reliable, so this hook keeps     */
/*  the exact same signature you'd use in a real app                    */
/*  ([value, setValue] = useLocalStorage(key, initialValue)) but backs  */
/*  onto an in-memory module-level store instead. Swap the internals    */
/*  for window.localStorage.getItem/setItem in a normal browser app.    */
/* ================================================================== */
const memoryStore = {};

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() =>
    key in memoryStore ? memoryStore[key] : (typeof initialValue === 'function' ? initialValue() : initialValue)
  );

  const setStoredValue = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      memoryStore[key] = resolved;
      return resolved;
    });
  }, [key]);

  return [value, setStoredValue];
}

/* ================================================================== */
/*  Theme Context / Provider (req 9)                                   */
/* ================================================================== */
const ThemeContext = createContext(null);

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

function ThemeProvider({ children }) {
  const [mode, setMode] = useLocalStorage('emp-dashboard-theme', 'light');
  const toggleTheme = useCallback(() => setMode((prev) => (prev === 'light' ? 'dark' : 'light')), [setMode]);
  const value = useMemo(() => ({ mode, toggleTheme, t: THEMES[mode] }), [mode, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/* ================================================================== */
/*  Mock "server" + simulated fetch (req 2)                            */
/*  Shaped like @tanstack/react-query's useQuery/useMutation:           */
/*  { data, isLoading, isError, refetch } plus optimistic mutations.    */
/* ================================================================== */
const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Krishna', 'Ishaan', 'Rohan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Kavya', 'Meera', 'Riya', 'Priya', 'Neha', 'Pooja', 'Karthik', 'Rahul', 'Suresh', 'Anil', 'Deepak', 'Manish', 'Sanjay', 'Ravi', 'Vikram', 'Arun', 'Lakshmi', 'Sunita', 'Anjali', 'Divya'];
const LAST_NAMES = ['Sharma', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Rao', 'Gupta', 'Mehta', 'Kapoor', 'Joshi', 'Patel', 'Menon', 'Pillai', 'Chatterjee', 'Bose', 'Mukherjee', 'Desai', 'Shah', 'Agarwal', 'Bhatt', 'Krishnan', 'Subramaniam', 'Naidu', 'Chauhan', 'Malhotra', 'Kulkarni', 'Deshpande', 'Bansal', 'Trivedi', 'Ghosh', 'Rathore', 'Yadav', 'Singh', 'Chopra'];

function generateEmployees(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length].name;
    const roles = ROLES[dept];
    const role = roles[i % roles.length];
    const status = i % 6 === 0 ? 'On Leave' : 'Active';
    const year = 2019 + (i % 6);
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 27)).padStart(2, '0');
    list.push({
      id: i + 1,
      empId: `EMP-${String(i + 1).padStart(4, '0')}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@northfield.co`,
      department: dept,
      role,
      status,
      joined: `${year}-${month}-${day}`,
    });
  }
  return list;
}

let serverDb = generateEmployees(34);
let nextId = serverDb.length + 1;

function useEmployeesQuery() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (cancelled) return;
      setData([...serverDb]);
      setIsLoading(false);
    }, 550);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [refetchKey]);

  const refetch = useCallback(() => setRefetchKey((k) => k + 1), []);

  const addEmployee = useCallback((employee) => {
    const created = { ...employee, id: nextId, empId: `EMP-${String(nextId).padStart(4, '0')}` };
    nextId += 1;
    serverDb = [created, ...serverDb];
    setData([...serverDb]);
  }, []);

  const updateEmployee = useCallback((id, updates) => {
    serverDb = serverDb.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setData([...serverDb]);
  }, []);

  const removeEmployee = useCallback((id) => {
    serverDb = serverDb.filter((e) => e.id !== id);
    setData([...serverDb]);
  }, []);

  return { data, isLoading, isError, refetch, addEmployee, updateEmployee, removeEmployee };
}

/* ================================================================== */
/*  Small presentational pieces                                        */
/* ================================================================== */
function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Active;
  return (
    <span style={{ background: c.bg, color: c.text, fontFamily: FONT_BODY }} className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
      {status}
    </span>
  );
}

// React.memo + useCallback pairing (req 8): StatCard only re-renders when its own props change
const StatCard = React.memo(function StatCard({ label, value, icon: Icon, accent, t }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderTop: `3px solid ${accent}` }} className="rounded-lg p-4 flex items-center justify-between">
      <div>
        <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs uppercase tracking-wide mb-1">{label}</p>
        <p style={{ color: t.text, fontFamily: FONT_DISPLAY }} className="text-2xl font-semibold">{value}</p>
      </div>
      <div style={{ background: `${accent}22`, color: accent }} className="p-2.5 rounded-md">
        <Icon size={20} />
      </div>
    </div>
  );
});

// React.memo (req 8): row identity is stable thanks to useCallback handlers passed from the parent,
// so unrelated state changes (e.g. typing in search before results update) don't re-render every row.
const EmployeeRow = React.memo(function EmployeeRow({ employee, t, onEdit, onDelete }) {
  const deptColor = (DEPARTMENTS.find((d) => d.name === employee.department) || {}).color || t.accent;
  return (
    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span style={{ background: deptColor }} className="w-2 h-2 rounded-full flex-shrink-0" />
          <span style={{ color: t.textSoft, fontFamily: FONT_MONO }} className="text-xs">{employee.empId}</span>
        </div>
      </td>
      <td className="py-3 px-3">
        <p style={{ color: t.text, fontFamily: FONT_BODY }} className="text-sm font-medium">{employee.name}</p>
        <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs">{employee.email}</p>
      </td>
      <td className="py-3 px-3" style={{ color: deptColor, fontFamily: FONT_BODY }}>
        <span className="text-sm">{employee.department}</span>
      </td>
      <td className="py-3 px-3" style={{ color: t.textSoft, fontFamily: FONT_BODY }}>
        <span className="text-sm">{employee.role}</span>
      </td>
      <td className="py-3 px-3"><StatusBadge status={employee.status} /></td>
      <td className="py-3 px-3" style={{ color: t.textSoft, fontFamily: FONT_MONO }}>
        <span className="text-xs">{employee.joined}</span>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => onEdit(employee)} style={{ color: t.textSoft }} className="p-1.5 rounded hover:opacity-70" aria-label={`Edit ${employee.name}`}>
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(employee.id)} style={{ color: t.danger }} className="p-1.5 rounded hover:opacity-70" aria-label={`Delete ${employee.name}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
});

/* ================================================================== */
/*  Add / Edit modal (req 5)                                            */
/* ================================================================== */
function EmployeeModal({ t, initial, onClose, onSave }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(() => initial || {
    name: '', email: '', department: DEPARTMENTS[0].name, role: ROLES[DEPARTMENTS[0].name][0],
    status: 'Active', joined: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState({});

  const handleDeptChange = (dept) => setForm((f) => ({ ...f, department: dept, role: ROLES[dept][0] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,12,10,0.55)' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: t.surface, border: `1px solid ${t.border}` }} className="w-full max-w-md rounded-xl overflow-hidden">
        <div style={{ borderBottom: `1px solid ${t.border}` }} className="flex items-center justify-between px-5 py-4">
          <h2 style={{ color: t.text, fontFamily: FONT_DISPLAY }} className="text-lg font-semibold">{isEdit ? 'Edit employee' : 'Add employee'}</h2>
          <button onClick={onClose} style={{ color: t.textSoft }} aria-label="Close"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs block mb-1">Full name</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={{ background: t.surfaceAlt, border: `1px solid ${errors.name ? t.danger : t.border}`, color: t.text, fontFamily: FONT_BODY }}
              className="w-full rounded-md px-3 py-2 text-sm outline-none" placeholder="Jordan Blake" />
            {errors.name && <p style={{ color: t.danger }} className="text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs block mb-1">Email</label>
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              style={{ background: t.surfaceAlt, border: `1px solid ${errors.email ? t.danger : t.border}`, color: t.text, fontFamily: FONT_BODY }}
              className="w-full rounded-md px-3 py-2 text-sm outline-none" placeholder="jordan.blake@northfield.co" />
            {errors.email && <p style={{ color: t.danger }} className="text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs block mb-1">Department</label>
              <select value={form.department} onChange={(e) => handleDeptChange(e.target.value)}
                style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }}
                className="w-full rounded-md px-3 py-2 text-sm outline-none">
                {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs block mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }}
                className="w-full rounded-md px-3 py-2 text-sm outline-none">
                {ROLES[form.department].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs block mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }}
                className="w-full rounded-md px-3 py-2 text-sm outline-none">
                <option>Active</option>
                <option>On Leave</option>
              </select>
            </div>
            <div>
              <label style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs block mb-1">Joined</label>
              <input type="date" value={form.joined} onChange={(e) => setForm((f) => ({ ...f, joined: e.target.value }))}
                style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_MONO }}
                className="w-full rounded-md px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} style={{ color: t.textSoft, border: `1px solid ${t.border}`, fontFamily: FONT_BODY }} className="px-4 py-2 rounded-md text-sm">Cancel</button>
            <button type="submit" style={{ background: t.accent, color: t.accentText, fontFamily: FONT_BODY }} className="px-4 py-2 rounded-md text-sm font-medium">
              {isEdit ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Pagination (req 3)                                                  */
/* ================================================================== */
function Pagination({ t, page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button disabled={page === 1} onClick={() => setPage(1)} style={{ color: t.textSoft, opacity: page === 1 ? 0.35 : 1 }} className="p-1.5" aria-label="First page"><ChevronsLeft size={16} /></button>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ color: t.textSoft, opacity: page === 1 ? 0.35 : 1 }} className="p-1.5" aria-label="Previous page"><ChevronLeft size={16} /></button>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} style={{ color: t.textSoft, opacity: page === totalPages ? 0.35 : 1 }} className="p-1.5" aria-label="Next page"><ChevronRight size={16} /></button>
        <button disabled={page === totalPages} onClick={() => setPage(totalPages)} style={{ color: t.textSoft, opacity: page === totalPages ? 0.35 : 1 }} className="p-1.5" aria-label="Last page"><ChevronsRight size={16} /></button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Sidebar / "routing" (req 10)                                        */
/*  react-router isn't available in this sandbox, so navigation is      */
/*  simulated with a route key in state — same idea, no URL history.    */
/* ================================================================== */
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'employees', label: 'Employees', icon: Users },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

function Sidebar({ t, route, setRoute, collapsed, setCollapsed }) {
  return (
    <div style={{ background: t.sidebarBg, width: collapsed ? 68 : 220, transition: 'width 0.2s ease' }} className="flex-shrink-0 flex flex-col py-5">
      <div className="flex items-center gap-2 px-4 mb-8">
        <div style={{ background: t.accent }} className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0">
          <span style={{ color: t.accentText, fontFamily: FONT_DISPLAY }} className="text-xs font-bold">NF</span>
        </div>
        {!collapsed && <span style={{ color: t.sidebarText, fontFamily: FONT_DISPLAY }} className="text-sm font-semibold tracking-wide">Northfield HR</span>}
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = route === item.key;
          return (
            <button key={item.key} onClick={() => setRoute(item.key)}
              style={{ background: active ? 'rgba(201,161,90,0.14)' : 'transparent', color: active ? t.accent : t.sidebarTextSoft, fontFamily: FONT_BODY }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors hover:opacity-90">
              <item.icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed((c) => !c)} style={{ color: t.sidebarTextSoft, fontFamily: FONT_BODY }} className="mx-2 px-3 py-2 flex items-center gap-2 text-xs">
        {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /> <span>Collapse</span></>}
      </button>
    </div>
  );
}

/* ================================================================== */
/*  Dashboard page                                                      */
/* ================================================================== */
function DashboardPage({ t, data, isLoading }) {
  // useMemo (req 7): recompute stats only when the underlying data changes
  const stats = useMemo(() => {
    if (!data) return null;
    const total = data.length;
    const active = data.filter((e) => e.status === 'Active').length;
    const onLeave = total - active;
    const deptCounts = {};
    data.forEach((e) => { deptCounts[e.department] = (deptCounts[e.department] || 0) + 1; });
    const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    return { total, active, onLeave, topDept: topDept ? topDept[0] : '—' };
  }, [data]);

  const recent = useMemo(() => (data ? [...data].sort((a, b) => b.id - a.id).slice(0, 4) : []), [data]);

  if (isLoading || !stats) {
    return <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-sm">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard t={t} label="Total employees" value={stats.total} icon={Users} accent={t.accent} />
        <StatCard t={t} label="Active" value={stats.active} icon={UserCheck} accent="#3E7C6B" />
        <StatCard t={t} label="On leave" value={stats.onLeave} icon={UserX} accent="#C1633E" />
        <StatCard t={t} label="Top department" value={stats.topDept} icon={TrendingUp} accent="#4C7A94" />
      </div>
      <div>
        <h3 style={{ color: t.text, fontFamily: FONT_DISPLAY }} className="text-sm font-semibold mb-3">Recently added</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.map((emp) => {
            const deptColor = (DEPARTMENTS.find((d) => d.name === emp.department) || {}).color || t.accent;
            return (
              <div key={emp.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderLeft: `3px solid ${deptColor}` }} className="rounded-lg p-4">
                <p style={{ color: t.textSoft, fontFamily: FONT_MONO }} className="text-[10px] mb-1">{emp.empId}</p>
                <p style={{ color: t.text, fontFamily: FONT_BODY }} className="text-sm font-medium">{emp.name}</p>
                <p style={{ color: deptColor, fontFamily: FONT_BODY }} className="text-xs mt-1">{emp.role}</p>
                <div className="mt-2"><StatusBadge status={emp.status} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Employees page — CRUD, search/filter, pagination (req 1,3,4)        */
/* ================================================================== */
const PAGE_SIZE = 8;

function EmployeesPage({ t, query }) {
  const { data, isLoading, addEmployee, updateEmployee, removeEmployee } = query;
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // useMemo (req 7): filtering only re-runs when data/search/filters actually change
  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((e) => {
      const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q);
      const matchesDept = deptFilter === 'All' || e.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [data, search, deptFilter, statusFilter]);

  useEffect(() => { setPage(1); }, [search, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  // useCallback (req 8): stable handler identities so EmployeeRow's React.memo actually prevents re-renders
  const openAdd = useCallback(() => { setEditing(null); setModalOpen(true); }, []);
  const openEdit = useCallback((emp) => { setEditing(emp); setModalOpen(true); }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const handleDelete = useCallback((id) => removeEmployee(id), [removeEmployee]);
  const handleSave = useCallback((form) => {
    if (editing) updateEmployee(editing.id, form);
    else addEmployee(form);
    setModalOpen(false);
  }, [editing, updateEmployee, addEmployee]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="flex items-center gap-2 rounded-md px-3 py-2 flex-1">
          <Search size={15} style={{ color: t.textSoft }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, or ID…"
            style={{ color: t.text, fontFamily: FONT_BODY, background: 'transparent' }} className="text-sm outline-none flex-1" />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
          style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }} className="rounded-md px-3 py-2 text-sm">
          <option value="All">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }} className="rounded-md px-3 py-2 text-sm">
          <option value="All">All statuses</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>
        <button onClick={openAdd} style={{ background: t.accent, color: t.accentText, fontFamily: FONT_BODY }} className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium">
          <Plus size={16} /> Add employee
        </button>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="rounded-lg overflow-x-auto">
        {isLoading ? (
          <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-sm p-6">Loading employees…</p>
        ) : paged.length === 0 ? (
          <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-sm p-6">No employees match your search.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {['ID', 'Employee', 'Department', 'Role', 'Status', 'Joined', ''].map((h) => (
                  <th key={h} style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-left text-xs uppercase tracking-wide font-medium py-3 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((emp) => (
                <EmployeeRow key={emp.id} employee={emp} t={t} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination t={t} page={page} totalPages={totalPages} setPage={setPage} />

      {modalOpen && <EmployeeModal t={t} initial={editing} onClose={closeModal} onSave={handleSave} />}
    </div>
  );
}

/* ================================================================== */
/*  Settings page                                                       */
/* ================================================================== */
function SettingsPage({ t, mode, toggleTheme, collapsed, setCollapsed }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}` }} className="rounded-lg p-5 max-w-md space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: t.text, fontFamily: FONT_BODY }} className="text-sm font-medium">Theme</p>
          <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs">Persisted via the useLocalStorage hook.</p>
        </div>
        <button onClick={toggleTheme} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm">
          {mode === 'light' ? <Moon size={15} /> : <Sun size={15} />} {mode === 'light' ? 'Switch to dark' : 'Switch to light'}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: t.text, fontFamily: FONT_BODY }} className="text-sm font-medium">Sidebar</p>
          <p style={{ color: t.textSoft, fontFamily: FONT_BODY }} className="text-xs">Collapse the navigation rail.</p>
        </div>
        <button onClick={() => setCollapsed((c) => !c)} style={{ background: t.surfaceAlt, border: `1px solid ${t.border}`, color: t.text, fontFamily: FONT_BODY }} className="px-3 py-2 rounded-md text-sm">
          {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Shell + App root                                                    */
/* ================================================================== */
function DashboardShell() {
  const { t, mode, toggleTheme } = useTheme();
  const [route, setRoute] = useState('dashboard');
  const [collapsed, setCollapsed] = useLocalStorage('emp-dashboard-sidebar', false);
  const query = useEmployeesQuery();

  const titleMap = { dashboard: 'Dashboard', employees: 'Employees', settings: 'Settings' };

  return (
    <div style={{ background: t.bg, minHeight: '640px', fontFamily: FONT_BODY }} className="flex rounded-xl overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>
      <Sidebar t={t} route={route} setRoute={setRoute} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <div style={{ borderBottom: `1px solid ${t.border}` }} className="flex items-center justify-between px-6 py-4">
          <h1 style={{ color: t.text, fontFamily: FONT_DISPLAY }} className="text-lg font-semibold">{titleMap[route]}</h1>
          <button onClick={toggleTheme} style={{ color: t.textSoft }} className="p-2 rounded-md" aria-label="Toggle theme">
            {mode === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {route === 'dashboard' && <DashboardPage t={t} data={query.data} isLoading={query.isLoading} />}
          {route === 'employees' && <EmployeesPage t={t} query={query} />}
          {route === 'settings' && <SettingsPage t={t} mode={mode} toggleTheme={toggleTheme} collapsed={collapsed} setCollapsed={setCollapsed} />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardShell />
    </ThemeProvider>
  );
}
