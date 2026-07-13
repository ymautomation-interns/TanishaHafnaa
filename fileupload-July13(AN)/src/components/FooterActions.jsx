import { motion } from "framer-motion";

/**
 * Sticky footer for the modal. `primaryDisabled` should be wired to
 * `!isComplete` from useFileUpload so "Continue" is unusable until a
 * real 100% upload success has occurred.
 */
export default function FooterActions({
  onCancel,
  onPrimaryAction,
  primaryLabel = "Continue",
  primaryDisabled = true,
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
      >
        Cancel
      </button>
      <motion.button
        type="button"
        onClick={onPrimaryAction}
        disabled={primaryDisabled}
        whileTap={primaryDisabled ? {} : { scale: 0.97 }}
        className={[
          "rounded-lg px-5 py-2 text-sm font-semibold shadow-sm transition-colors",
          primaryDisabled
            ? "cursor-not-allowed bg-indigo-200 text-white"
            : "bg-indigo-600 text-white hover:bg-indigo-700",
        ].join(" ")}
      >
        {primaryLabel}
      </motion.button>
    </div>
  );
}
