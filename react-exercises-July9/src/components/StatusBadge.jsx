const styles = {
  Active: "bg-green-100 text-green-700",
  "On Leave": "bg-amber-100 text-amber-700",
  Inactive: "bg-slate-100 text-slate-500",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[status] || styles.Inactive}`}>
      {status}
    </span>
  );
}
