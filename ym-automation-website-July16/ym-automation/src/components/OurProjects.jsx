import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";

export default function OurProjects() {
  const { content } = useContent();
  const { intro, items } = content.projects_home;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Our Projects</h2>
      <p className="mt-3 max-w-3xl text-sm text-neutral-500">{intro}</p>

      {/* Grid: 1 column on mobile, 2 columns on tablet, 3 columns on desktop */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {items.map((p, i) => {
          let imageSrc = p.image;
          if (i === 1) imageSrc = "/projimage2.jpg";
          if (i === 2) imageSrc = "/projimage3.jpg";
          
          return (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border border-neutral-200 shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="h-40 w-full overflow-hidden sm:h-48">
                <img
                  src={imageSrc}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              <div className="px-4 py-3 text-sm font-medium text-neutral-800 sm:py-4">
                {p.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/projects"
          className="group flex items-center gap-2 rounded-md bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-amber-300 sm:px-6 sm:py-3"
        >
          View All Projects
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
