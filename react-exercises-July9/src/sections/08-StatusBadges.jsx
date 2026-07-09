import { useState } from "react";
import Panel from "../components/Panel.jsx";
import Button from "../components/Button.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const options = ["Active", "On Leave", "Inactive"];

export default function StatusBadgesSection() {
  const [status, setStatus] = useState("Active");

  return (
    <Panel
      eyebrow="08 / CONDITIONS"
      title="Status Badges"
      description="Same badge component, three different visual states chosen by a lookup object."
      note="A style lookup object avoids an if/else chain — one property access instead of branching per render."
    >
      <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-slate-600">Employee status</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex gap-2">
          {options.map((opt) => (
            <Button key={opt} size="sm" variant={status === opt ? "primary" : "secondary"} onClick={() => setStatus(opt)}>
              {opt}
            </Button>
          ))}
        </div>
      </div>
    </Panel>
  );
}
