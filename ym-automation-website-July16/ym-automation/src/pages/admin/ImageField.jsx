import React, { useRef, useState } from "react";
import { Upload, Link2 } from "lucide-react";
import { uploadImage } from "../../api.js";

export default function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-neutral-600">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 rounded-md border border-neutral-200 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-dashed border-neutral-300 text-neutral-300">
            <Link2 size={20} />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-amber-400 disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? "Uploading..." : "Upload image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
