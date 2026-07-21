import React from "react";

export default function SaveBar({ onSave, saving, status }) {
  return (
    <div className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-4">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
      {status === "saved" && (
        <span className="text-sm font-medium text-green-600">Saved ✓</span>
      )}
      {status === "error" && (
        <span className="text-sm font-medium text-red-500">
          Failed to save. Try again.
        </span>
      )}
    </div>
  );
}
