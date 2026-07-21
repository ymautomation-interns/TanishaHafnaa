import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, List, ArrowUpRight } from "lucide-react";
import { JOB_OPENINGS, LOREM } from "../data/constants.js";

function Breadcrumb() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 text-sm text-neutral-500 sm:px-6">
      <Link to="/" className="hover:text-amber-500">
        Home
      </Link>{" "}
      / <span className="text-neutral-700">Career</span>
    </div>
  );
}

const JOIN_TEAM_TEXT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

function JoinOurTeam() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-900 sm:text-2xl">
            Join Our Team
          </h2>
          <p className="mt-4 text-justify text-sm leading-relaxed text-neutral-500">
            {JOIN_TEAM_TEXT}
          </p>
        </div>

        <div className="h-64 w-full overflow-hidden rounded-xl md:h-72">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=900&auto=format&fit=crop"
            alt="Join our team"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function JobCard({ id, title, location, type, skills }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 shadow-sm sm:p-6">
      <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">{title}</h3>

      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
        <MapPin size={16} className="text-neutral-500" />
        {location}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
        <Briefcase size={16} className="text-neutral-500" />
        {type}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
        <List size={16} className="text-neutral-500" />
        Skills : {skills}
      </div>

      <Link
        to={`/career/apply/${id}`}
        className="mt-6 flex w-fit items-center gap-2 rounded-md border border-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-amber-400 sm:px-5"
      >
        Apply Now
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}

function JobOpenings() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Job Openings</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {JOB_OPENINGS.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
    </section>
  );
}

export default function CareerPage() {
  return (
    <>
      <Breadcrumb />
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Career</h1>
      </section>
      <JoinOurTeam />
      <JobOpenings />
    </>
  );
}
