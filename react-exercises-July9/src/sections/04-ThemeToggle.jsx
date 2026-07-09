import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import Panel from "../components/Panel.jsx";

export default function ThemeToggleSection() {
  const [dark, setDark] = useState(false);

  return (
    <Panel
      eyebrow="04 / UI STATE"
      title="Theme Toggle"
      description="Flips a boolean in state and swaps classes on the preview surface below."
      note="State is scoped to this component, so toggling it never re-renders the rest of the app."
    >
      <div className={`rounded-xl border p-8 transition-colors ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Preview surface</p>
            <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Currently in {dark ? "dark" : "light"} mode</p>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className={`relative h-8 w-14 rounded-full transition-colors ${dark ? "bg-indigo-600" : "bg-slate-300"}`}
            aria-label="Toggle theme"
          >
            <span className={`absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow transition-all ${dark ? "left-7" : "left-1"}`}>
              {dark ? <Moon size={13} className="text-indigo-600" /> : <Sun size={13} className="text-amber-500" />}
            </span>
          </button>
        </div>
      </div>
    </Panel>
  );
}
