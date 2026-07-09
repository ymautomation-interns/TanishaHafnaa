import { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import Panel from "../components/Panel.jsx";
import Button from "../components/Button.jsx";

export default function CounterSection() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <Panel
      eyebrow="02 / STATE"
      title="Counter"
      description="Tracks a numeric value in state, with an adjustable step size."
      note="Uses the functional updater form (c => c + step), so rapid clicks never read a stale value."
    >
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className={`mb-6 font-mono text-6xl font-bold ${count > 0 ? "text-indigo-600" : count < 0 ? "text-red-500" : "text-slate-900"}`}>
          {count}
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="secondary" icon={Minus} onClick={() => setCount((c) => c - step)}>
            Decrement
          </Button>
          <Button variant="ghost" icon={RotateCcw} onClick={() => setCount(0)}>
            Reset
          </Button>
          <Button icon={Plus} onClick={() => setCount((c) => c + step)}>
            Increment
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>Step</span>
          <input
            type="number"
            value={step}
            min={1}
            onChange={(e) => setStep(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded-md border border-slate-300 px-2 py-1 text-center text-slate-800 outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </Panel>
  );
}
