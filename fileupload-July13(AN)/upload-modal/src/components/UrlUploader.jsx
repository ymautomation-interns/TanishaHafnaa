import { useState } from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { validateUrl } from "../utils/validators";

/**
 * Simple controlled input + submit button. Validation happens locally
 * for instant feedback; the actual upload/network error surfaces later
 * through UploadProgress once the request is in flight.
 */
export default function UrlUploader({ onSubmit, disabled }) {
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateUrl(url);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <label htmlFor="file-url" className="text-sm font-medium text-slate-700">
        Upload from URL
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Link2
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="file-url"
            type="text"
            inputMode="url"
            placeholder="https://example.com/report.csv"
            value={url}
            disabled={disabled}
            onChange={(event) => {
              setUrl(event.target.value);
              if (localError) setLocalError(null);
            }}
            className={[
              "w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              localError ? "border-red-300" : "border-slate-200",
              disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : "bg-white",
            ].join(" ")}
          />
        </div>
        <motion.button
          type="submit"
          disabled={disabled}
          whileTap={{ scale: 0.97 }}
          className={[
            "shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
            disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-slate-900 text-white hover:bg-slate-800",
          ].join(" ")}
        >
          Upload
        </motion.button>
      </div>
      {localError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-red-600"
        >
          {localError}
        </motion.p>
      )}
    </form>
  );
}
