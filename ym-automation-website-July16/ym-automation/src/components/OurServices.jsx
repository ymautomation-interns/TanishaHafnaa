import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";
import { getIcon } from "../data/iconMap.js";

export default function OurServices() {
  const { content } = useContent();
  const services = content.services;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Our Services</h2>
        <Link
          to="/services"
          className="group flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-amber-500"
        >
          Learn more
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Grid: 1 column on mobile, 2 columns on tablet, 4 columns on desktop */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {services.map(({ label, icon }) => {
          const Icon = getIcon(icon);
          return (
            <div
              key={label}
              className="flex cursor-pointer flex-col items-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 text-center transition-all duration-300 hover:border-[#FFC107] hover:bg-[#FFF8E6] hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] sm:px-6 sm:py-10"
            >
              <div className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FFC107] bg-white text-neutral-800 transition-all duration-300 hover:bg-[#FFC107] hover:text-black sm:h-14 sm:w-14">
                  <Icon size={20} sm:size={24} />
                </div>
              </div>
              <div className="mt-3 text-xs font-medium text-neutral-500 transition-colors duration-300 hover:text-neutral-900 sm:mt-4 sm:text-sm">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
