import Panel from "../components/Panel.jsx";
import EmployeeCard, { employees } from "../components/EmployeeCard.jsx";

export default function EmployeeCardSection() {
  return (
    <Panel
      eyebrow="01 / PROPS"
      title="Employee Card"
      description="A presentational component that renders whatever data is passed into its props."
      note="Wrap with React.memo — it has no internal state, so it only needs to re-render when its props change."
    >
      <div className="max-w-sm">
        <EmployeeCard {...employees[0]} />
      </div>
    </Panel>
  );
}
