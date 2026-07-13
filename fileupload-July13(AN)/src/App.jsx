import { useState } from "react";
import UploadModal from "./components/UploadModal";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastImport, setLastImport] = useState(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-6">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        Upload Files
      </button>

      {lastImport && (
        <p className="max-w-sm text-center text-sm text-slate-500">
          Last import: <span className="font-medium text-slate-700">{lastImport.fileName || "file"}</span>
        </p>
      )}

      <UploadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onImport={(result) => setLastImport(result)}
      />
    </div>
  );
}
