import Panel from "../components/Panel.jsx";
import EmployeeCard, { employees } from "../components/EmployeeCard.jsx";

export default function EmployeeListSection() {
  return (
    <Panel
      eyebrow="06 / RENDERING"
      title="Employee List"
      description="Renders an array of employee objects with Array.map(), reusing the Employee Card."
      note="Keys are stable employee IDs, not array indexes, so React can diff reorders correctly."
    >
      <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
        {employees.map((emp) => (
          <EmployeeCard key={emp.id} {...emp} />
        ))}
      </div>
    </Panel>
  );
}
