import { Activity, Zap } from "lucide-react";
import { usePerf } from "./usePerf.js";

export default function Panel({ eyebrow, title, description, note, children }) {
  const { renders, paintMs } = usePerf();

  return (
    <div>
      <p className="font-mono text-[11px] tracking-widest text-indigo-500 mb-1">{eyebrow}</p>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 mb-4 max-w-xl">{description}</p>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Activity size={13} className="text-indigo-500" />
          Renders: <span className="font-mono font-medium text-slate-700">{renders}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Zap size={13} className="text-indigo-500" />
          Time to paint: <span className="font-mono font-medium text-slate-700">{paintMs === null ? "…" : `${paintMs.toFixed(1)}ms`}</span>
        </span>
        {note && <span className="text-slate-400">· {note}</span>}
      </div>

      {children}
    </div>
  );
}
