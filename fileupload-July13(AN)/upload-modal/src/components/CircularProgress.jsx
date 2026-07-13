import { motion } from "framer-motion";

/**
 * SVG ring whose stroke-dashoffset is driven directly by `percent`.
 * No internal timers — it simply reflects whatever value it's given,
 * so it stays perfectly in sync with the linear ProgressBar.
 */
export default function CircularProgress({
  percent = 0,
  size = 56,
  strokeWidth = 4,
  success = false,
  error = false,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  const ringColor = error ? "#DC2626" : success ? "#16A34A" : "#4F46E5";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold text-slate-700 tabular-nums">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}
