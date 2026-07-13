import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RotateCcw, X, XCircle } from "lucide-react";
import CircularProgress from "./CircularProgress";
import ProgressBar from "./ProgressBar";
import FileCard from "./FileCard";
import { formatDuration, formatSpeed } from "../utils/formatters";
import { STATUS } from "../hooks/useFileUpload";

/**
 * Replaces the Dropzone once a file/URL is submitted. Every number shown
 * here (percent, speed, elapsed, remaining) is passed in from
 * useFileUpload, which derives them from real onUploadProgress events —
 * this component never invents or animates a fake percentage itself.
 */
export default function UploadProgress({
  status,
  fileMeta,
  progress,
  speedBps,
  elapsedSeconds,
  remainingSeconds,
  errorMessage,
  onCancel,
  onRemove,
  onRetry,
}) {
  const isUploading = status === STATUS.UPLOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isError = status === STATUS.ERROR;

  const speedLabel = formatSpeed(speedBps);
  const remainingLabel =
    remainingSeconds != null ? `${formatDuration(remainingSeconds)} left` : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <FileCard name={fileMeta?.name || "File"} size={fileMeta?.size || 0} />

        <div className="flex shrink-0 items-center gap-2">
          {isUploading && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Cancel upload"
            >
              <X size={16} />
            </button>
          )}
          {(isSuccess || isError) && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <AnimatePresence mode="wait" initial={false}>
          {isSuccess ? (
            <motion.div
              key="success-icon"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
            >
              <CheckCircle2 size={28} strokeWidth={2} />
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error-icon"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
            >
              <XCircle size={28} strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div key="progress-ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CircularProgress percent={progress.percent} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          {isError ? (
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {isSuccess ? "Upload complete" : "Uploading…"}
                </span>
                <span className="tabular-nums">{Math.round(progress.percent)}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar percent={progress.percent} success={isSuccess} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                <span>{formatDuration(elapsedSeconds)} elapsed</span>
                {speedLabel && !isSuccess && <span>{speedLabel}</span>}
                {remainingLabel && !isSuccess && <span>{remainingLabel}</span>}
              </div>
            </>
          )}
        </div>
      </div>

      {isError && (
        <motion.button
          type="button"
          onClick={onRetry}
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RotateCcw size={13} />
          Retry upload
        </motion.button>
      )}
    </div>
  );
}
