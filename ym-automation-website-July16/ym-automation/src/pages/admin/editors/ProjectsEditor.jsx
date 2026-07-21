import React, { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useContent } from "../../../context/ContentContext.jsx";
import { saveSection } from "../../../api.js";
import ImageField from "../ImageField.jsx";
import SaveBar from "../SaveBar.jsx";

export default function ProjectsEditor() {
  const { content, refresh } = useContent();
  const [details, setDetails] = useState(content.projects_details);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => setDetails(content.projects_details), [content.projects_details]);

  function updateCategory(i, value) {
    setDetails((prev) => ({
      ...prev,
      categories: prev.categories.map((c, idx) => (idx === i ? value : c)),
    }));
  }
  function addCategory() {
    setDetails((prev) => ({
      ...prev,
      categories: [...prev.categories, "New Category"],
    }));
  }
  function removeCategory(i) {
    const removed = details.categories[i];
    setDetails((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, idx) => idx !== i),
      items: prev.items.filter((item) => item.category !== removed),
    }));
  }

  function updateItem(i, patch) {
    setDetails((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));
  }
  function updateItemImage(i, imgIndex, url) {
    setDetails((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) => {
        if (idx !== i) return it;
        const images = it.images.map((img, ii) => (ii === imgIndex ? url : img));
        return { ...it, images };
      }),
    }));
  }
  function addItemImage(i) {
    setDetails((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) =>
        idx === i ? { ...it, images: [...it.images, ""] } : it
      ),
    }));
  }
  function removeItemImage(i, imgIndex) {
    setDetails((prev) => ({
      ...prev,
      items: prev.items.map((it, idx) =>
        idx === i
          ? { ...it, images: it.images.filter((_, ii) => ii !== imgIndex) }
          : it
      ),
    }));
  }
  function addItem() {
    setDetails((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          category: prev.categories[0] || "",
          title: "New project",
          startDate: "",
          endDate: "",
          about: "",
          images: [],
        },
      ],
    }));
  }
  function removeItem(i) {
    setDetails((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== i),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await saveSection("projects_details", details);
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
      <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {details.categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-1 rounded-md border border-neutral-300 px-2 py-1">
            <input
              value={cat}
              onChange={(e) => updateCategory(i, e.target.value)}
              className="w-32 border-none text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeCategory(i)}
              className="text-neutral-400 hover:text-red-500"
              aria-label="Remove category"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
        >
          <Plus size={14} /> Add category
        </button>
      </div>

      <h2 className="mt-10 text-lg font-bold text-neutral-900">Projects</h2>
      <div className="mt-4 space-y-6">
        {details.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    value={item.title}
                    onChange={(e) => updateItem(i, { title: e.target.value })}
                    placeholder="Project title"
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(i, { category: e.target.value })}
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  >
                    {details.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    value={item.startDate}
                    onChange={(e) => updateItem(i, { startDate: e.target.value })}
                    placeholder="Start date"
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    value={item.endDate}
                    onChange={(e) => updateItem(i, { endDate: e.target.value })}
                    placeholder="End date"
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <textarea
                  value={item.about}
                  onChange={(e) => updateItem(i, { about: e.target.value })}
                  placeholder="About"
                  rows={3}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />

                <div>
                  <p className="mb-2 text-xs font-semibold text-neutral-600">
                    Gallery images for this project
                  </p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {item.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="flex items-center gap-2">
                        <div className="flex-1">
                          <ImageField
                            value={img}
                            onChange={(url) => updateItemImage(i, imgIndex, url)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItemImage(i, imgIndex)}
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
                    onClick={() => addItemImage(i)}
                    className="mt-2 flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
                  >
                    <Plus size={14} /> Add image
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
        >
          <Plus size={16} /> Add project
        </button>
      </div>

      <SaveBar onSave={handleSave} saving={saving} status={status} />
    </div>
  );
}
