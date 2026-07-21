import React from "react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";

function Breadcrumb() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 text-sm text-neutral-500">
      <Link to="/" className="hover:text-amber-500">
        Home
      </Link>{" "}
      / <span className="text-neutral-700">Services</span>
    </div>
  );
}

function ServiceBlock({ title, subtitle, description, image, isLast }) {
  return (
    <div className={`py-10 ${isLast ? "" : "border-b border-neutral-200"}`}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
          <h3 className="mt-2 text-lg font-medium text-neutral-400">
            {subtitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            {description}
          </p>
        </div>

        <div className="h-64 w-full overflow-hidden rounded-xl">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { content } = useContent();
  const items = content.services_page;

  return (
    <>
      <Breadcrumb />
      <section className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="text-3xl font-bold text-neutral-900">Services</h1>

        <div className="mt-4">
          {items.map((s, i) => (
            <ServiceBlock
              key={`${s.title}-${i}`}
              title={s.title}
              subtitle={s.subtitle}
              description={s.description}
              image={s.image}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
