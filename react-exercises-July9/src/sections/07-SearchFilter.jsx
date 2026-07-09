import { useState } from "react";
import { Search } from "lucide-react";
import Panel from "../components/Panel.jsx";
import Input from "../components/Input.jsx";
import EmployeeCard, { employees } from "../components/EmployeeCard.jsx";

export default function SearchFilterSection() {
  const [query, setQuery] = useState("");
  const filtered = employees.filter((emp) =>
    `${emp.name} ${emp.role} ${emp.department}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Panel
      eyebrow="07 / RENDERING"
      title="Search Filter"
      description="Filters the same employee list client-side as you type, against name, role, and department."
      note="Filtering runs on every keystroke — O(n) is fine at this size; wrap in useMemo if the list grows large."
    >
      <div className="max-w-2xl">
        <div className="mb-4 max-w-xs">
          <Input icon={Search} placeholder="Search by name, role, department..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((emp) => (
            <EmployeeCard key={emp.id} {...emp} />
          ))}
        </div>
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No employees match "{query}".</p>}
      </div>
    </Panel>
  );
}
