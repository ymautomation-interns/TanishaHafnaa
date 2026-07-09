import { AlertCircle } from "lucide-react";

export default function Input({ label, error, icon: Icon, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <span className="relative block">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          className={`w-full rounded-lg border text-sm px-3 py-2 ${Icon ? "pl-9" : ""} outline-none transition-colors
            ${error ? "border-red-400 focus:border-red-500 bg-red-50/40" : "border-slate-300 focus:border-indigo-500 bg-white"}`}
          {...props}
        />
      </span>
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </label>
  );
}
