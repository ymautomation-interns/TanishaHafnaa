import { FileSpreadsheet, FileText, FileImage, File as FileIcon } from "lucide-react";
import { formatBytes, truncateFileName } from "../utils/formatters";

const ICONS_BY_EXTENSION = {
  csv: { Icon: FileSpreadsheet, className: "text-emerald-600 bg-emerald-50" },
  xlsx: { Icon: FileSpreadsheet, className: "text-emerald-600 bg-emerald-50" },
  pdf: { Icon: FileText, className: "text-red-600 bg-red-50" },
  docx: { Icon: FileText, className: "text-blue-600 bg-blue-50" },
  jpg: { Icon: FileImage, className: "text-violet-600 bg-violet-50" },
  jpeg: { Icon: FileImage, className: "text-violet-600 bg-violet-50" },
  png: { Icon: FileImage, className: "text-violet-600 bg-violet-50" },
};

function getIconConfig(fileName = "") {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ICONS_BY_EXTENSION[ext] || { Icon: FileIcon, className: "text-slate-600 bg-slate-100" };
}

/**
 * Compact identity row for a file: icon, name, size. Purely
 * presentational — parents decide what goes alongside it (progress,
 * actions, status badges).
 */
export default function FileCard({ name, size, children }) {
  const { Icon, className } = getIconConfig(name);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${className}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800" title={name}>
          {truncateFileName(name, 40)}
        </p>
        {size > 0 && <p className="text-xs text-slate-500">{formatBytes(size)}</p>}
      </div>
      {children}
    </div>
  );
}
