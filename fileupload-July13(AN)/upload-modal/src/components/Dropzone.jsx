import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES, validateFile } from "../utils/validators";

/**
 * Large drag-and-drop surface. Delegates the actual upload kickoff to
 * `onFileAccepted`; this component's only job is selecting a valid file.
 */
export default function Dropzone({ onFileAccepted, onError, maxBytes = MAX_FILE_SIZE_BYTES }) {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections?.length) {
        const rejection = fileRejections[0];
        const reason =
          rejection.errors?.[0]?.code === "file-too-large"
            ? `"${rejection.file.name}" is too large. Maximum file size is ${(
                maxBytes /
                (1024 * 1024)
              ).toFixed(0)} MB.`
            : `"${rejection.file.name}" isn't a supported format. Use CSV, XLSX, PDF, DOCX, JPG, or PNG.`;
        onError?.(reason);
        return;
      }

      const file = acceptedFiles[0];
      const validationError = validateFile(file, { maxBytes });
      if (validationError) {
        onError?.(validationError);
        return;
      }

      onFileAccepted(file);
    },
    [maxBytes, onError, onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: maxBytes,
    multiple: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={[
        "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
        isDragReject
          ? "border-red-300 bg-red-50/60"
          : isDragActive
          ? "border-indigo-400 bg-indigo-50/70"
          : "border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/40",
      ].join(" ")}
      animate={isDragActive ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <input {...getInputProps()} aria-label="File upload input" />

      <motion.div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"
        animate={isDragActive ? { y: -4 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <UploadCloud size={22} strokeWidth={2} />
      </motion.div>

      <div>
        <p className="text-sm font-medium text-slate-700">
          {isDragActive ? "Drop your file here" : "Drag & drop your file here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Supports CSV, XLSX, PDF, DOCX, JPG, PNG · Up to {(maxBytes / (1024 * 1024)).toFixed(0)} MB
        </p>
      </div>
    </motion.div>
  );
}
