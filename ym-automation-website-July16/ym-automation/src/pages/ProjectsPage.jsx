import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";

function Breadcrumb() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 text-sm text-neutral-500">
      <Link to="/" className="hover:text-amber-500">
        Home
      </Link>{" "}
      / <span className="text-neutral-700">Projects</span>
    </div>
  );
}

function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(active === cat ? null : cat)}
            className={`rounded-md border px-5 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-amber-400 bg-amber-400 text-black"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-amber-400 hover:text-black"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function ImageCarousel({ images, title }) {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={prev}
        aria-label="Previous image"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-amber-400 hover:text-amber-500"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex-1">
        <div className="h-64 w-full overflow-hidden rounded-xl md:h-72">
          <img
            src={images[active]}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === active ? "bg-amber-400" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={next}
        aria-label="Next image"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:border-amber-400 hover:text-amber-500"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function ProjectDetails({ title, startDate, endDate, about }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
      <p className="mt-2 text-sm text-neutral-500">
        Start date- {startDate}_ End date-{endDate}
      </p>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">About</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">{about}</p>
    </div>
  );
}

function ProjectRow({ project, imageFirst, isLast }) {
  const image = <ImageCarousel images={project.images} title={project.title} />;
  const details = <ProjectDetails {...project} />;

  return (
    <div className={`py-10 ${isLast ? "" : "border-b border-neutral-200"}`}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        {imageFirst ? (
          <>
            {image}
            {details}
          </>
        ) : (
          <>
            <div className="md:order-2">{image}</div>
            <div className="md:order-1">{details}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { content } = useContent();
  const { categories, items } = content.projects_details;
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = activeCategory 
    ? items.filter((p) => p.category === activeCategory)
    : items;

  return (
    <>
      <Breadcrumb />
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">Projects</h1>
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <p className="py-10 text-sm text-neutral-500">
              No projects found in this category yet.
            </p>
          ) : (
            filtered.map((project, i) => (
              <ProjectRow
                key={`${project.title}-${i}`}
                project={project}
                imageFirst={i % 2 === 0}
                isLast={i === filtered.length - 1}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}
