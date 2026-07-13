import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, RefreshCw, AlertCircle } from "lucide-react";
import Dropzone from "./Dropzone";
import UploadProgress from "./UploadProgress";
import UrlUploader from "./UrlUploader";
import FooterActions from "./FooterActions";
import { useFileUpload, STATUS } from "../hooks/useFileUpload";
import { MAX_FILE_SIZE_BYTES } from "../utils/validators";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 12, scale: 0.98 },
};

/**
 * Top-level, self-contained upload experience. Owns the useFileUpload
 * hook and wires it into the presentational pieces below. Drop this
 * component anywhere and control visibility with `isOpen`.
 */
export default function UploadModal({ isOpen, onClose, onImport, maxBytes = MAX_FILE_SIZE_BYTES }) {
  const {
    status,
    fileMeta,
    progress,
    speedBps,
    elapsedSeconds,
    remainingSeconds,
    errorMessage,
    result,
    startFileUpload,
    startUrlUpload,
    cancelUpload,
    removeFile,
    retryUpload,
    isComplete,
  } = useFileUpload({ maxBytes });

  const [preUploadError, setPreUploadError] = useState(null);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const hasActiveFile = status !== STATUS.IDLE;
  const isBusy = status === STATUS.UPLOADING;

  const handleClose = () => {
    if (isBusy) cancelUpload();
    else removeFile();
    onClose();
  };

  const handleContinue = () => {
    onImport?.(result);
    removeFile();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
              <div>
                <h2 id="upload-modal-title" className="text-base font-semibold text-slate-900">
                  Upload Files
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add documents by dragging and dropping a file, or upload directly from a URL.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close upload modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5 px-6 pb-5">
              <AnimatePresence mode="wait" initial={false}>
                {!hasActiveFile ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Dropzone
                      maxBytes={maxBytes}
                      onFileAccepted={(file) => {
                        setPreUploadError(null);
                        startFileUpload(file);
                      }}
                      onError={setPreUploadError}
                    />
                    <AnimatePresence>
                      {preUploadError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="flex items-start gap-2 overflow-hidden rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
                        >
                          <AlertCircle size={14} className="mt-0.5 shrink-0" />
                          <span>{preUploadError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <UploadProgress
                      status={status}
                      fileMeta={fileMeta}
                      progress={progress}
                      speedBps={speedBps}
                      elapsedSeconds={elapsedSeconds}
                      remainingSeconds={remainingSeconds}
                      errorMessage={errorMessage}
                      onCancel={cancelUpload}
                      onRemove={removeFile}
                      onRetry={retryUpload}
                    />
                    {isComplete && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreUploadError(null);
                          removeFile();
                        }}
                        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <RefreshCw size={13} />
                        Replace file
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!hasActiveFile && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Or
                    </span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>

                  <UrlUploader onSubmit={startUrlUpload} disabled={isBusy} />
                </>
              )}
            </div>

            <FooterActions
              onCancel={handleClose}
              onPrimaryAction={handleContinue}
              primaryLabel="Continue"
              primaryDisabled={!isComplete}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
