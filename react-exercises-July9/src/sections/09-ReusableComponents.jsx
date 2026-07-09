import { Trash2, User, Briefcase } from "lucide-react";
import Panel from "../components/Panel.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

export default function ReusableComponentsSection() {
  return (
    <Panel
      eyebrow="09 / COMPONENTS"
      title="Reusable Button & Input"
      description="The same Button and Input components power every panel in this project — variants and sizes shown here."
      note="Both are stateless and prop-driven, so React.memo would make them cheap to reuse inside larger lists."
    >
      <div className="max-w-xl space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Variants</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger" icon={Trash2}>
              Danger
            </Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Sizes</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Input</p>
          <div className="grid max-w-sm gap-3">
            <Input label="Name" icon={User} placeholder="Jane Doe" />
            <Input label="Role" icon={Briefcase} placeholder="Product Designer" />
          </div>
        </div>
      </div>
    </Panel>
  );
}
