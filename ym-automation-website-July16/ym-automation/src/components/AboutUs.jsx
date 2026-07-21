import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STATS, LOREM } from "../data/constants.js";

export default function AboutUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">About Us</h2>
      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm leading-relaxed text-neutral-500">{LOREM}</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-xl font-bold text-amber-400 sm:text-2xl">{s.value}</div>
                <div className="mt-1 text-xs text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-amber-500"
          >
            Learn more <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl sm:h-64">
          <img
            src="/about.jpg"
            alt="About Us"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
