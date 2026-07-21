import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { JOB_OPENINGS } from "../data/constants.js";
import SuccessModal from "../components/SuccessModal.jsx";

function BackLink() {
  return (
    <Link
      to="/career"
      className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-amber-500"
    >
      <ArrowLeft size={16} />
      Back
    </Link>
  );
}

function JobInfo({ job }) {
  const rows = [
    { label: "Location", value: job.location },
    { label: "Experience", value: job.experience },
    { label: "Job Type", value: job.type },
    { label: "Salary", value: job.salary },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900">{job.title}</h1>

      <div className="mt-4 space-y-1 text-sm text-neutral-600">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex gap-2">
            <span className="w-24 shrink-0">{label}</span>
            <span>:</span>
            <span className="font-semibold text-neutral-900">{value}</span>
          </div>
        ))}
      </div>

      <h3 className="mt-6 font-semibold text-neutral-900">Job Description</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        {job.description}
      </p>

      <h3 className="mt-6 font-semibold text-neutral-900">Skill Set</h3>
      <ul className="mt-2 space-y-1 text-sm text-neutral-600">
        {job.skillSet.map((skill, i) => (
          <li key={i} className="flex gap-2">
            <span>•</span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { submitApplication } from "../api.js";

function ApplyForm({ onSubmitted, jobId }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [coverLetter, setCoverLetter] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverLetter || !resume) {
      alert("Please upload both Cover Letter and Resume");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);

      await submitApplication(formData);
      onSubmitted();
    } catch (err) {
      alert(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const fileInputClass =
    "w-full text-sm text-neutral-500 file:mr-4 file:rounded-md file:border-0 file:bg-neutral-200 file:px-4 file:py-2 file:text-sm file:font-medium file:text-neutral-700 hover:file:bg-neutral-300";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-neutral-200 p-6 shadow-sm"
    >
      <h2 className="font-bold text-neutral-900">Apply for this position</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-neutral-800">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 outline-none transition focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-800">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 outline-none transition focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-800">
            Phone No<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 outline-none transition focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-800">
            Upload your Cover Letter (PDF Only)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setCoverLetter(e.target.files[0])}
            className={`mt-1.5 ${fileInputClass}`}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-800">
            Upload your Resume (PDF Only)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setResume(e.target.files[0])}
            className={`mt-1.5 ${fileInputClass}`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default function JobApplicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const job =
    JOB_OPENINGS.find((j) => j.id === id) || JOB_OPENINGS[0];

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-6">
        <BackLink />

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          <JobInfo job={job} />
          <ApplyForm onSubmitted={() => setSubmitted(true)} jobId={job.id} />
        </div>
      </section>

      {submitted && (
        <SuccessModal
          title="Application Submitted Successfully!"
          message="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          onClose={() => {
            setSubmitted(false);
            navigate("/career");
          }}
        />
      )}
    </>
  );
}
