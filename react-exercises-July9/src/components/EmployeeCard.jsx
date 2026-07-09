import StatusBadge from "./StatusBadge.jsx";

export const employees = [
  { id: 1, name: "Ananya Rao", role: "Frontend Engineer", department: "Platform", initials: "AR", status: "Active" },
  { id: 2, name: "Marcus Lee", role: "Product Designer", department: "Design", initials: "ML", status: "On Leave" },
  { id: 3, name: "Priya Sharma", role: "Backend Engineer", department: "Platform", initials: "PS", status: "Active" },
  { id: 4, name: "Diego Fernandez", role: "QA Analyst", department: "Quality", initials: "DF", status: "Inactive" },
  { id: 5, name: "Sara Kim", role: "Engineering Manager", department: "Platform", initials: "SK", status: "Active" },
];

function EmployeeCard({ name, role, department, initials, status = "Active" }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
        <p className="truncate text-xs text-slate-500">
          {role} · {department}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

export default EmployeeCard;
