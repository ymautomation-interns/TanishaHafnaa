import React, { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useContent } from "../../../context/ContentContext.jsx";
import { saveSection } from "../../../api.js";
import ImageField from "../ImageField.jsx";
import SaveBar from "../SaveBar.jsx";

export default function HomeEditor() {
  const { content, refresh } = useContent();
  const [hero, setHero] = useState(content.hero);
  const [projectsHome, setProjectsHome] = useState(content.projects_home);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => setHero(content.hero), [content.hero]);
  useEffect(() => setProjectsHome(content.projects_home), [content.projects_home]);

  function updateItem(index, patch) {
    setProjectsHome((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));
  }

  function addItem() {
    setProjectsHome((prev) => ({
      ...prev,
      items: [...prev.items, { title: "New Project", image: "" }],
    }));
  }

  function removeItem(index) {
    setProjectsHome((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await saveSection("hero", hero);
      await saveSection("projects_home", projectsHome);
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
      <h2 className="text-lg font-bold text-neutral-900">Hero Section</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-600">
            Title line 1
          </label>
          <input
            value={hero.titleLine1}
            onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-600">
            Title line 2
          </label>
          <input
            value={hero.titleLine2}
            onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-neutral-600">
          Subtitle
        </label>
        <textarea
          value={hero.subtitle}
          onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-600">
            Button text
          </label>
          <input
            value={hero.buttonText}
            onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-600">
            Button link
          </label>
          <input
            value={hero.buttonLink}
            onChange={(e) => setHero({ ...hero, buttonLink: e.target.value })}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-neutral-900">
        "Our Projects" preview (Home page)
      </h2>
      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold text-neutral-600">
          Intro paragraph
        </label>
        <textarea
          value={projectsHome.intro}
          onChange={(e) =>
            setProjectsHome({ ...projectsHome, intro: e.target.value })
          }
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-4">
        {projectsHome.items.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-neutral-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <input
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  placeholder="Project title"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
                <ImageField
                  value={item.image}
                  onChange={(url) => updateItem(i, { image: url })}
                />
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
