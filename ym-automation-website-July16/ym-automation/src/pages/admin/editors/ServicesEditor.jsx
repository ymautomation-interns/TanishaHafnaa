import React, { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useContent } from "../../../context/ContentContext.jsx";
import { saveSection } from "../../../api.js";
import { ICON_NAMES, getIcon } from "../../../data/iconMap.js";
import ImageField from "../ImageField.jsx";
import SaveBar from "../SaveBar.jsx";

export default function ServicesEditor() {
  const { content, refresh } = useContent();
  const [services, setServices] = useState(content.services);
  const [servicesPage, setServicesPage] = useState(content.services_page);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => setServices(content.services), [content.services]);
  useEffect(() => setServicesPage(content.services_page), [content.services_page]);

  function updateService(i, patch) {
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addService() {
    setServices((prev) => [...prev, { label: "New service", icon: "Settings" }]);
  }
  function removeService(i) {
    setServices((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updatePageItem(i, patch) {
    setServicesPage((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addPageItem() {
    setServicesPage((prev) => [
      ...prev,
      { title: "New Service", subtitle: "Subtitles", description: "", image: "" },
    ]);
  }
  function removePageItem(i) {
    setServicesPage((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await saveSection("services", services);
      await saveSection("services_page", servicesPage);
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
      <h2 className="text-lg font-bold text-neutral-900">
        "Our Services" tiles (Home page)
      </h2>
      <div className="mt-4 space-y-3">
        {services.map((s, i) => {
          const Icon = getIcon(s.icon);
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50">
                <Icon size={18} />
              </div>
              <input
                value={s.label}
                onChange={(e) => updateService(i, { label: e.target.value })}
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
              />
              <select
                value={s.icon}
                onChange={(e) => updateService(i, { icon: e.target.value })}
                className="rounded-md border border-neutral-300 px-2 py-2 text-sm focus:border-amber-400 focus:outline-none"
              >
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeService(i)}
                className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove service"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
        >
          <Plus size={16} /> Add service tile
        </button>
      </div>

      <h2 className="mt-10 text-lg font-bold text-neutral-900">
        Services Page (full content)
      </h2>
      <div className="mt-4 space-y-4">
        {servicesPage.map((s, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <input
                  value={s.title}
                  onChange={(e) => updatePageItem(i, { title: e.target.value })}
                  placeholder="Title"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
                <input
                  value={s.subtitle}
                  onChange={(e) => updatePageItem(i, { subtitle: e.target.value })}
                  placeholder="Subtitle"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
                <textarea
                  value={s.description}
                  onChange={(e) => updatePageItem(i, { description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
                <ImageField
                  value={s.image}
                  onChange={(url) => updatePageItem(i, { image: url })}
                />
              </div>
              <button
                type="button"
                onClick={() => removePageItem(i)}
                className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove service"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addPageItem}
          className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
        >
          <Plus size={16} /> Add service block
        </button>
      </div>

      <SaveBar onSave={handleSave} saving={saving} status={status} />
    </div>
  );
}
