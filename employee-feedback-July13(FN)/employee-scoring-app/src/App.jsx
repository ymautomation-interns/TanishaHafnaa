import { useState, useMemo } from "react";
import {
  Users,
  MessageSquare,
  Briefcase,
  ShieldCheck,
  Lightbulb,
  BookOpen,
  Handshake,
  RefreshCw,
  Rocket,
  LineChart,
  Calendar,
  Network,
  Plus,
} from "lucide-react";

const COLORS = {
  gold: "#F5B301",
  goldEmpty: "#dcdcdc",
  ink: "#1a1a1a",
  sub: "#5b5b5b",
  line: "#d9d9d9",
  blue: "#2F7BF0",
  sideBg: "#F6F6F7",
  green: "#2E8B45",
};

function Stars({ value, size = 16, emptyChar = "☆" }) {
  const full = Math.round(value);
  return (
    <span style={{ letterSpacing: 2, fontSize: size }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < full ? COLORS.gold : COLORS.goldEmpty }}>
          {i < full ? "★" : emptyChar}
        </span>
      ))}
    </span>
  );
}

const SCORE_TABLE = [
  ["95–100", "Outstanding", 5],
  ["90–94", "Excellent", 4],
  ["80–89", "Very Good", 4],
  ["70–79", "Good", 3],
  ["60–69", "Satisfactory", 2],
  ["50–59", "Needs Improvement", 1],
  ["Below 50", "Unsatisfactory", 1],
];

const LOGIC_TEXT = `score = 100

score -= lateArrival * 0.5
score -= earlyExit * 0.5
score -= breakViolation * 0.5
score -= missingCheckout * 1
score -= unauthorizedAbsence * 2
score -= missingTimesheetDay * 3
score -= missingTimesheetWeek * 8

if score < 0:
    score = 0

if score >= 97:
    Grade = "A+"; Stars = 5
elif score >= 93:
    Grade = "A"; Stars = 4.5
elif score >= 89:
    Grade = "B+"; Stars = 4
elif score >= 85:
    Grade = "B"; Stars = 3.5
elif score >= 80:
    Grade = "C"; Stars = 3
elif score >= 70:
    Grade = "D"; Stars = 2
else:
    Grade = "F"; Stars = 1`;

/* ============================================================
   SECTION 1 — SCORING GUIDE (unchanged, do not modify)
   ============================================================ */
function ScoringGuide() {
  return (
    <div>
      <h1 className="font-bold" style={{ fontSize: 26, marginBottom: 26 }}>
        Automatic Employee Scoring System
      </h1>

      <div className="flex items-stretch" style={{ gap: 32 }}>
        {/* LEFT COLUMN: score table, formula, example — all stacked together */}
        <div style={{ flex: "0 0 auto", width: 420 }}>
          <div
            className="grid"
            style={{ gridTemplateColumns: "1.1fr 1.3fr 1.1fr", columnGap: 24, alignContent: "start" }}
          >
            <div className="font-bold" style={{ fontSize: 13, marginBottom: 10 }}>Score Range</div>
            <div className="font-bold" style={{ fontSize: 13, marginBottom: 10 }}>Performance</div>
            <div className="font-bold" style={{ fontSize: 13, marginBottom: 10 }}>Stars</div>

            {SCORE_TABLE.map(([range, perf, stars]) => (
              <>
                <div style={{ fontSize: 14, padding: "9px 0", borderBottom: `1px solid #eee` }}>{range}</div>
                <div style={{ fontSize: 14, padding: "9px 0", borderBottom: `1px solid #eee` }}>{perf}</div>
                <div style={{ padding: "9px 0", borderBottom: `1px solid #eee` }}><Stars value={stars} /></div>
              </>
            ))}
          </div>

          <h2 className="font-bold" style={{ fontSize: 17, margin: "26px 0 14px" }}>Automatic Scoring Formula</h2>
          <p className="font-semibold" style={{ fontSize: 14, margin: "0 0 6px" }}>Final Score = 100</p>
          <ul style={{ fontSize: 14, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
            <li>− (Late Arrival × 0.5)</li>
            <li>− (Early Exit × 0.5)</li>
            <li>− (Break Compliance Violations × 0.5)</li>
            <li>− (Missing Check-Out × 1)</li>
            <li>− (Unauthorized Absence × 2)</li>
            <li>− (Missing Timesheet Days × 3)</li>
            <li>− (Missing Timesheet Weeks × 8)</li>
          </ul>

          <hr style={{ border: "none", borderTop: `1px solid ${COLORS.line}`, margin: "22px 0" }} />

          <h2 className="font-bold" style={{ fontSize: 17, margin: "0 0 14px" }}>Example</h2>
          <table style={{ borderCollapse: "collapse", fontSize: 13.5 }}>
            <tbody>
              <tr>
                <th className="font-bold" style={{ textAlign: "left", padding: "4px 22px 4px 0", borderBottom: `1px solid ${COLORS.line}` }}>Item</th>
                <th className="font-bold" style={{ textAlign: "left", padding: "4px 22px 4px 0", borderBottom: `1px solid ${COLORS.line}` }}>Count</th>
                <th className="font-bold" style={{ textAlign: "left", padding: "4px 22px 4px 0", borderBottom: `1px solid ${COLORS.line}` }}>Penalty</th>
              </tr>
              {[
                ["Late Arrival", 4, "-2"],
                ["Early Exit", 2, "-1"],
                ["Break Violation", 3, "-1.5"],
                ["Missing Check-Out", 1, "-1"],
                ["Unauthorized Absence", 1, "-2"],
                ["Missing Timesheet (Day)", 1, "-3"],
                ["Missing Timesheet (Week)", 0, "0"],
              ].map(([item, count, penalty]) => (
                <tr key={item}>
                  <td style={{ padding: "4px 22px 4px 0" }}>{item}</td>
                  <td style={{ padding: "4px 22px 4px 0" }}>{count}</td>
                  <td style={{ padding: "4px 22px 4px 0" }}>{penalty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 14 }}>
            <p className="font-semibold" style={{ fontSize: 14, margin: "4px 0" }}>Total Penalty = 10.5</p>
            <p className="font-semibold" style={{ fontSize: 14, margin: "4px 0" }}>Final Score = 100 − 10.5 = 89.5</p>
            <p className="font-semibold" style={{ fontSize: 14, margin: "4px 0" }}>Score Range = 89.5</p>
            <p className="font-semibold" style={{ fontSize: 14, margin: "4px 0" }}>
              Stars : <Stars value={4} />
            </p>
            <p className="font-semibold" style={{ fontSize: 14, margin: "4px 0" }}>Performance: Very Good</p>
          </div>
        </div>

        <div style={{ flex: "0 0 1px", background: COLORS.line, alignSelf: "stretch" }} />

        {/* RIGHT COLUMN: rating logic only, sits alongside the full left column */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div className="font-bold" style={{ fontSize: 13, marginBottom: 10 }}>Rating Logic</div>
          <pre
            style={{
              fontFamily: "SFMono-Regular, Consolas, Menlo, monospace",
              fontSize: 12.5,
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre",
              margin: 0,
            }}
          >
            {LOGIC_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SHARED DATA — the 10 rated criteria (used by both the
   Performance Rated Criteria panel and the Overall Average card)
   ============================================================ */
const COLOR_MAP = {
  blue: { bg: "#E4EEFE", fg: "#3B82F6" },
  green: { bg: "#E1F5E9", fg: "#22A06B" },
  purple: { bg: "#EFE7FE", fg: "#8B5CF6" },
  orange: { bg: "#FDEFD9", fg: "#E3A008" },
};

const CRITERIA_DEFS = [
  { id: "teamwork", name: "Teamwork & Collaboration", desc: "Works effectively with others toward shared goals", Icon: Users, color: "blue" },
  { id: "communication", name: "Communication Skills", desc: "Shares information clearly, in writing and in person", Icon: MessageSquare, color: "green" },
  { id: "professionalism", name: "Professionalism", desc: "Conducts themselves appropriately in the workplace", Icon: Briefcase, color: "purple" },
  { id: "reliability", name: "Reliability & Accountability", desc: "Follows through and owns outcomes", Icon: ShieldCheck, color: "orange" },
  { id: "problemSolving", name: "Problem Solving", desc: "Identifies issues and works through them methodically", Icon: Lightbulb, color: "blue" },
  { id: "knowledgeSharing", name: "Knowledge Sharing", desc: "Helps others learn and grow through their expertise", Icon: BookOpen, color: "green" },
  { id: "respect", name: "Respect for Others", desc: "Treats colleagues with courtesy and consideration", Icon: Handshake, color: "purple" },
  { id: "adaptability", name: "Adaptability", desc: "Adjusts well to change and new circumstances", Icon: RefreshCw, color: "orange" },
  { id: "initiative", name: "Initiative", desc: "Takes action without needing to be asked", Icon: Rocket, color: "blue" },
  { id: "overallPerformance", name: "Overall Performance", desc: "Holistic view of this review period", Icon: LineChart, color: "green" },
];

const RATING_LABELS_FULL = ["Poor", "Needs Improvement", "Meets Expectations", "Exceeds Expectations", "Outstanding"];

function defaultRatings() {
  return Object.fromEntries(CRITERIA_DEFS.map((c) => [c.id, 4]));
}

const INITIAL_EMPLOYEES = [
  {
    id: "EID001",
    name: "Sathishkumar",
    title: "Project Manager",
    department: "Design Team",
    joinedDate: "01 Dec 2025",
    ratings: defaultRatings(),
    remarks: "",
  },
  {
    id: "EID002",
    name: "Divya Bharathi",
    title: "UI/UX Designer",
    department: "Design Team",
    joinedDate: "15 Jan 2026",
    ratings: defaultRatings(),
    remarks: "",
  },
  {
    id: "EID003",
    name: "Arun Kumar",
    title: "Backend Engineer",
    department: "Engineering Team",
    joinedDate: "10 Feb 2026",
    ratings: defaultRatings(),
    remarks: "",
  },
];

function IconBadge({ Icon, color, size = 40 }) {
  const c = COLOR_MAP[color];
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, borderRadius: "50%", background: c.bg, flexShrink: 0 }}
    >
      <Icon size={size * 0.5} color={c.fg} strokeWidth={2} />
    </div>
  );
}

function InteractiveStars({ value, onChange, size = 17 }) {
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          onClick={() => onChange(i + 1)}
          className="cursor-pointer"
          style={{ fontSize: size, color: i < value ? COLORS.gold : COLORS.goldEmpty, lineHeight: 1 }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function avgOf(ratings) {
  const vals = Object.values(ratings);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/* ============================================================
   SECTION 2 — EMPLOYEE CARDS (grid) + Add Employee tile
   + Performance Rated Criteria panel (modal, per employee)
   ============================================================ */
function EmployeeCard({ employee, onClick }) {
  const initials = employee.name.slice(0, 2).toUpperCase();
  const rating = Math.round(avgOf(employee.ratings));
  return (
    <div style={{ position: "relative", width: "100%", marginTop: 48 }}>
      <div
        style={{
          position: "absolute",
          top: -48,
          left: "50%",
          transform: "translateX(-50%)",
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5B8DEF, #2F5FCF)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 28,
          fontWeight: 700,
          border: "4px solid #fff",
          boxShadow: "0 4px 14px rgba(0,0,0,.12)",
          zIndex: 2,
        }}
      >
        {initials}
      </div>

      <div
        onClick={onClick}
        className="cursor-pointer"
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 24,
          padding: "58px 24px 22px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          border: `1px solid ${COLORS.line}`,
        }}
      >
        <span
          className="font-bold"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: COLORS.green,
            color: "#fff",
            fontSize: 13,
            padding: "5px 12px",
            borderRadius: 20,
          }}
        >
          ★ {rating}
        </span>

        <div className="font-bold" style={{ fontSize: 15 }}>{employee.id}</div>
        <div className="font-bold" style={{ fontSize: 17, color: COLORS.blue, marginTop: 4 }}>{employee.name}</div>
        <div style={{ fontSize: 13.5, color: COLORS.sub, marginTop: 2, marginBottom: 18 }}>{employee.title}</div>

        <div style={{ background: "#EEF1F4", borderRadius: 14, padding: "14px 16px", textAlign: "left" }}>
          <div className="flex items-center" style={{ gap: 10, fontSize: 13.5, padding: "6px 0" }}>
            <Network size={16} color={COLORS.sub} />
            <span style={{ color: COLORS.sub }}>Department</span>
            <span style={{ marginLeft: "auto", fontWeight: 700 }}>{employee.department}</span>
          </div>
          <div className="flex items-center" style={{ gap: 10, fontSize: 13.5, padding: "6px 0" }}>
            <Calendar size={16} color={COLORS.sub} />
            <span style={{ color: COLORS.sub }}>Joined Date</span>
            <span style={{ marginLeft: "auto", fontWeight: 700 }}>{employee.joinedDate}</span>
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#9a9a9a", marginTop: 12 }}>
        Tap the card to rate {employee.name.split(" ")[0]}
      </p>
    </div>
  );
}

function AddEmployeeCard({ onClick }) {
  return (
    <div style={{ position: "relative", width: "100%", marginTop: 48 }}>
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center cursor-pointer"
        style={{
          height: "100%",
          minHeight: 214,
          borderRadius: 24,
          border: `2px dashed ${COLORS.line}`,
          color: COLORS.sub,
          textAlign: "center",
          padding: "22px 24px",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 48, height: 48, borderRadius: "50%", background: COLORS.sideBg, marginBottom: 12 }}
        >
          <Plus size={22} color={COLORS.blue} />
        </div>
        <div className="font-bold" style={{ fontSize: 14.5, color: COLORS.ink }}>Add Employee</div>
        <div style={{ fontSize: 12.5, marginTop: 4 }}>Create a new employee card</div>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "#9a9a9a", marginTop: 12 }}>&nbsp;</p>
    </div>
  );
}

function EmployeeCardsGrid({ employees, onSelectEmployee, onAddClick }) {
  return (
    <div>
      <h1 className="font-bold" style={{ fontSize: 22, marginBottom: 4 }}>Employee Cards</h1>
      <p style={{ fontSize: 13.5, color: COLORS.sub, margin: "0 0 8px" }}>
        Tap any card to open its Performance Rated Criteria panel.
      </p>
      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", columnGap: 32, rowGap: 8 }}
      >
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} onClick={() => onSelectEmployee(emp.id)} />
        ))}
        <AddEmployeeCard onClick={onAddClick} />
      </div>
    </div>
  );
}

function PerformanceCriteriaPanel({ employee, ratings, onRate, remarks, setRemarks, open, onClose, onSubmit }) {
  if (!open || !employee) return null;

  return (
    <div
      onClick={onClose}
      className="flex items-center justify-center"
      style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.5)", padding: 24, zIndex: 50 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.line}`,
          borderRadius: 18,
          padding: 24,
          width: "100%",
          maxWidth: 720,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        }}
      >
        <h2 className="font-bold" style={{ fontSize: 18, margin: "0 0 4px" }}>
          Performance Rated Criteria — {employee.name}
        </h2>
        <p style={{ fontSize: 13, color: COLORS.sub, margin: "0 0 18px" }}>
          Click a star to set the rating. Each star represents one point, up to a maximum of five points.
        </p>

        {CRITERIA_DEFS.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between"
            style={{ gap: 16, padding: "12px 0", borderBottom: "1px solid #eee" }}
          >
            <div className="flex items-center" style={{ gap: 12 }}>
              <IconBadge Icon={c.Icon} color={c.color} size={36} />
              <div>
                <div className="font-bold" style={{ fontSize: 14 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: COLORS.sub }}>{c.desc}</div>
              </div>
            </div>
            <div className="flex items-center" style={{ gap: 10, flexShrink: 0 }}>
              <InteractiveStars value={ratings[c.id]} onChange={(v) => onRate(c.id, v)} />
              <span style={{ fontSize: 12.5, color: COLORS.sub, width: 140, textAlign: "right" }}>
                {RATING_LABELS_FULL[Math.max(0, ratings[c.id] - 1)]}
              </span>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18 }}>
          <label className="font-semibold" style={{ fontSize: 13, display: "block", marginBottom: 6 }}>
            Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              border: `1px solid ${COLORS.line}`,
              borderRadius: 10,
              padding: 10,
              fontSize: 13.5,
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        <div className="flex items-center justify-end" style={{ gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: `1px solid ${COLORS.line}`,
              background: "#fff",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            Close
          </button>
          <button
            onClick={onSubmit}
            className="cursor-pointer text-white"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              border: "none",
              background: COLORS.blue,
              fontSize: 13.5,
              fontWeight: 700,
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADD EMPLOYEE — modal form
   ============================================================ */
function AddEmployeeModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  if (!open) return null;

  const fieldStyle = {
    width: "100%",
    border: `1px solid ${COLORS.line}`,
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13.5,
    fontFamily: "inherit",
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      title: title.trim() || "Team Member",
      department: department.trim() || "Unassigned",
      joinedDate: joinedDate.trim() || "—",
    });
    setName("");
    setTitle("");
    setDepartment("");
    setJoinedDate("");
  };

  return (
    <div
      onClick={onClose}
      className="flex items-center justify-center"
      style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,.5)", padding: 24, zIndex: 50 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.line}`,
          borderRadius: 18,
          padding: 24,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        }}
      >
        <h2 className="font-bold" style={{ fontSize: 18, margin: "0 0 4px" }}>Add Employee</h2>
        <p style={{ fontSize: 13, color: COLORS.sub, margin: "0 0 18px" }}>
          New cards start at a default 4-star rating on every criterion — adjust it afterwards.
        </p>

        <div className="flex flex-col" style={{ gap: 14 }}>
          <div>
            <label className="font-semibold" style={{ fontSize: 12.5, display: "block", marginBottom: 5 }}>Name</label>
            <input style={fieldStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Raman" />
          </div>
          <div>
            <label className="font-semibold" style={{ fontSize: 12.5, display: "block", marginBottom: 5 }}>Title</label>
            <input style={fieldStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. QA Engineer" />
          </div>
          <div>
            <label className="font-semibold" style={{ fontSize: 12.5, display: "block", marginBottom: 5 }}>Department</label>
            <input style={fieldStyle} value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering Team" />
          </div>
          <div>
            <label className="font-semibold" style={{ fontSize: 12.5, display: "block", marginBottom: 5 }}>Joined Date</label>
            <input style={fieldStyle} value={joinedDate} onChange={(e) => setJoinedDate(e.target.value)} placeholder="e.g. 01 Jul 2026" />
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${COLORS.line}`, background: "#fff", fontSize: 13.5, fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="cursor-pointer text-white"
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: COLORS.blue, fontSize: 13.5, fontWeight: 700 }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 3 — OVERALL AVERAGE (gauge + category breakdown)
   ============================================================ */
function Gauge({ percentage }) {
  const angle = percentage * 180 - 90;
  return (
    <svg viewBox="0 0 300 170" style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }}>
      <path d="M 20 150 A 130 130 0 0 1 280 150" fill="none" stroke="#E5E5E5" strokeWidth={18} strokeLinecap="round" />
      <path
        d="M 20 150 A 130 130 0 0 1 280 150"
        fill="none"
        stroke={COLORS.green}
        strokeWidth={18}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 - percentage * 100}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <g style={{ transition: "transform 0.6s ease", transformOrigin: "150px 150px" }} transform={`rotate(${angle} 150 150)`}>
        <line x1={150} y1={150} x2={150} y2={38} stroke="#8a8a8a" strokeWidth={3} strokeLinecap="round" />
        <circle cx={150} cy={150} r={8} fill="#8a8a8a" />
      </g>
    </svg>
  );
}

function OverallAverage({ employees }) {
  // Average each criterion across every employee (not just one person's own ratings).
  const criteriaAverages = useMemo(() => {
    return Object.fromEntries(
      CRITERIA_DEFS.map((c) => {
        const vals = employees.map((e) => e.ratings[c.id]);
        return [c.id, vals.reduce((a, b) => a + b, 0) / vals.length];
      })
    );
  }, [employees]);

  const avg = useMemo(() => avgOf(criteriaAverages), [criteriaAverages]);

  return (
    <div>
      <h1 className="font-bold" style={{ fontSize: 22, marginBottom: 4 }}>Overall Average</h1>
      <p style={{ fontSize: 13.5, color: COLORS.sub, margin: "0 0 20px" }}>
        Averaged across all {employees.length} employee{employees.length === 1 ? "" : "s"} currently on the team.
      </p>

      <Gauge percentage={avg / 5} />

      <div style={{ textAlign: "center", marginTop: -6 }}>
        <span className="font-bold" style={{ fontSize: 22 }}>{avg.toFixed(1)} </span>
        <span style={{ color: COLORS.gold, fontSize: 20 }}>★</span>
        <div style={{ fontSize: 13, color: COLORS.sub, marginTop: 2 }}>Overall Average</div>
      </div>

      <hr style={{ border: "none", borderTop: `1px solid ${COLORS.line}`, margin: "24px 0" }} />

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", columnGap: 40, rowGap: 22, maxWidth: 640 }}>
        {CRITERIA_DEFS.map((c) => (
          <div key={c.id} className="flex items-center" style={{ gap: 12 }}>
            <IconBadge Icon={c.Icon} color={c.color} size={38} />
            <div>
              <div>
                <span className="font-bold" style={{ fontSize: 15 }}>{criteriaAverages[c.id].toFixed(1)} </span>
                <span style={{ color: COLORS.gold, fontSize: 14 }}>★</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.sub }}>{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function EmployeeScoringApp() {
  const [view, setView] = useState("guide");
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [activeEmployeeId, setActiveEmployeeId] = useState(INITIAL_EMPLOYEES[0].id);
  const [panelOpen, setPanelOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const activeEmployee = employees.find((e) => e.id === activeEmployeeId) || employees[0];

  const setRating = (employeeId, criteriaId, value) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, ratings: { ...e.ratings, [criteriaId]: value } } : e))
    );
  };

  const setRemarksFor = (employeeId, text) => {
    setEmployees((prev) => prev.map((e) => (e.id === employeeId ? { ...e, remarks: text } : e)));
  };

  const openPanelFor = (employeeId) => {
    setActiveEmployeeId(employeeId);
    setPanelOpen(true);
  };

  const addEmployee = (data) => {
    const nextNum = employees.length + 1;
    const newEmployee = {
      id: `EID${String(nextNum).padStart(3, "0")}`,
      name: data.name,
      title: data.title,
      department: data.department,
      joinedDate: data.joinedDate,
      ratings: defaultRatings(),
      remarks: "",
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setActiveEmployeeId(newEmployee.id);
    setAddModalOpen(false);
  };

  const navItems = [
    { id: "guide", label: "Scoring Guide" },
    { id: "employee", label: "Employee Card" },
    { id: "overall", label: "Overall Average" },
  ];

  return (
    <div className="flex" style={{ minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", color: COLORS.ink, background: "#fff" }}>
      <div className="flex flex-col" style={{ width: 250, flexShrink: 0, background: COLORS.sideBg, borderRight: `1px solid ${COLORS.line}`, padding: "22px 14px" }}>
        <h1 className="font-bold" style={{ fontSize: 15, margin: "4px 8px 20px" }}>Employee Scoring</h1>
        {navItems.map((item) => {
          const active = view === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex items-center cursor-pointer"
              style={{
                gap: 10,
                padding: "11px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 4,
                background: active ? COLORS.blue : "transparent",
                color: active ? "#fff" : COLORS.sub,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#fff" : COLORS.line }} />
              {item.label}
            </div>
          );
        })}
        <div style={{ marginTop: "auto", fontSize: 11, color: "#9a9a9a", padding: "8px 12px", lineHeight: 1.5 }}>
          Rate any employee's card, and Overall Average updates instantly.
        </div>
      </div>

      <div className="flex-1" style={{ padding: "36px 48px" }}>
        {view === "guide" && <ScoringGuide />}

        {view === "employee" && (
          <EmployeeCardsGrid
            employees={employees}
            onSelectEmployee={openPanelFor}
            onAddClick={() => setAddModalOpen(true)}
          />
        )}

        {view === "overall" && <OverallAverage employees={employees} />}
      </div>

      <PerformanceCriteriaPanel
        employee={activeEmployee}
        ratings={activeEmployee.ratings}
        onRate={(criteriaId, value) => setRating(activeEmployee.id, criteriaId, value)}
        remarks={activeEmployee.remarks}
        setRemarks={(text) => setRemarksFor(activeEmployee.id, text)}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onSubmit={() => setPanelOpen(false)}
      />

      <AddEmployeeModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onCreate={addEmployee} />
    </div>
  );
}
