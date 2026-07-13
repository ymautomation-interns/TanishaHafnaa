import { motion } from "framer-motion";

/**
 * Horizontal bar whose width animates to `percent`. Kept as a pure,
 * presentational component so it can be reused anywhere progress needs
 * to be shown (this file's card, a table row, etc.).
 */
export default function ProgressBar({ percent = 0, success = false, error = false }) {
  const barColor = error ? "bg-red-500" : success ? "bg-emerald-500" : "bg-indigo-600";

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`h-full rounded-full ${barColor}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percent, 100)}%` }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
      />
    </div>
  );
}
