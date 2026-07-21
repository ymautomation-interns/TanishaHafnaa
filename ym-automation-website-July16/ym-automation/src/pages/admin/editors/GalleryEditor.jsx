import React, { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useContent } from "../../../context/ContentContext.jsx";
import { saveSection } from "../../../api.js";
import ImageField from "../ImageField.jsx";
import SaveBar from "../SaveBar.jsx";

export default function GalleryEditor() {
  const { content, refresh } = useContent();
  const [images, setImages] = useState(content.gallery);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => setImages(content.gallery), [content.gallery]);

  function updateImage(i, url) {
    setImages((prev) => prev.map((img, idx) => (idx === i ? url : img)));
  }
  function addImage() {
    setImages((prev) => [...prev, ""]);
  }
  function removeImage(i) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await saveSection("gallery", images);
      await refresh();
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-neutral-900">Gallery Images</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {images.map((img, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-3">
            <div className="flex-1">
              <ImageField value={img} onChange={(url) => updateImage(i, url)} />
            </div>
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Remove image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addImage}
        className="mt-4 flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
      >
        <Plus size={16} /> Add image
      </button>

      <SaveBar onSave={handleSave} saving={saving} status={status} />
    </div>
  );
}
