import React, { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useContent } from "../../../context/ContentContext.jsx";
import { saveSection } from "../../../api.js";
import ImageField from "../ImageField.jsx";
import SaveBar from "../SaveBar.jsx";

export default function CareerEditor() {
  const { content, refresh } = useContent();
  const [career, setCareer] = useState(content.career || {
    joinTeamText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    joinTeamImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=900&auto=format&fit=crop",
    jobOpenings: []
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (content.career) {
      setCareer(content.career);
    }
  }, [content.career]);

  function updateJoinTeamText(text) {
    setCareer(prev => ({ ...prev, joinTeamText: text }));
  }

  function updateJoinTeamImage(url) {
    setCareer(prev => ({ ...prev, joinTeamImage: url }));
  }

  function updateJobOpening(i, patch) {
    setCareer(prev => ({
      ...prev,
      jobOpenings: prev.jobOpenings.map((job, idx) => idx === i ? { ...job, ...patch } : job)
    }));
  }

  function addJobOpening() {
    setCareer(prev => ({
      ...prev,
      jobOpenings: [...prev.jobOpenings, {
        id: Date.now().toString(),
        title: "Job Title",
        location: "Coimbatore",
        experience: "2 - 3 years",
        type: "Full Time",
        salary: "₹200,000.00 - ₹300,000.00 per year",
        skills: "JavaScript, HTML, CSS, and JSX",
        description: "Lorem Ipsum dolor sit amet consectetur. Amet sed diam pharetra scelerisque arcu arcu cursus. At pharetra dictumst aliquam ut a posuere. Massa a porttitor lacus elementum sagittis nibh lectus tortor. Duis morbi mauris tincidunt faucibus sed fringilla. Molestie mattis arcu mauris eu. Convallis elit nunc consectetur enim maecenas tempus risus amet quis. Mi sed sagittis vitae sem mi. Eget imperdiet elit id eleifend aliquam libero gravida. Sed et imperdiet tortor nam tortor sapien amet tristique mauris. Sed quis risus tempor ac bibendum sit quis fringilla iaculis.",
        skillSet: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]
      }]
    }));
  }

  function removeJobOpening(i) {
    setCareer(prev => ({
      ...prev,
      jobOpenings: prev.jobOpenings.filter((_, idx) => idx !== i)
    }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      await saveSection("career", career);
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
        Join Our Team Section
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description Text
          </label>
          <textarea
            value={career.joinTeamText}
            onChange={(e) => updateJoinTeamText(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
        <ImageField
          value={career.joinTeamImage}
          onChange={updateJoinTeamImage}
          label="Team Image"
        />
      </div>

      <h2 className="mt-10 text-lg font-bold text-neutral-900">
        Job Openings
      </h2>
      <div className="mt-4 space-y-4">
        {career.jobOpenings.map((job, i) => (
          <div key={job.id || i} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <input
                  value={job.title}
                  onChange={(e) => updateJobOpening(i, { title: e.target.value })}
                  placeholder="Job Title"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={job.location}
                    onChange={(e) => updateJobOpening(i, { location: e.target.value })}
                    placeholder="Location"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    value={job.type}
                    onChange={(e) => updateJobOpening(i, { type: e.target.value })}
                    placeholder="Job Type (Full Time, Part Time, etc.)"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={job.experience}
                    onChange={(e) => updateJobOpening(i, { experience: e.target.value })}
                    placeholder="Experience Required"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    value={job.salary}
                    onChange={(e) => updateJobOpening(i, { salary: e.target.value })}
                    placeholder="Salary Range"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <input
                  value={job.skills}
                  onChange={(e) => updateJobOpening(i, { skills: e.target.value })}
                  placeholder="Skills (comma separated)"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
                <textarea
                  value={job.description}
                  onChange={(e) => updateJobOpening(i, { description: e.target.value })}
                  placeholder="Job Description"
                  rows={4}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeJobOpening(i)}
                className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove job opening"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addJobOpening}
          className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-amber-400 hover:text-amber-600"
        >
          <Plus size={16} /> Add Job Opening
        </button>
      </div>

      <SaveBar onSave={handleSave} saving={saving} status={status} />
    </div>
  );
}
