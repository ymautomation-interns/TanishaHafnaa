import React from "react";
import { APPROACH, LOREM } from "../data/constants.js";

export default function OurApproach() {
  return (
    <section className="bg-amber-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
          Our Approach
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-neutral-500">
          {LOREM}
        </p>

        <div className="mt-8 flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between md:mt-12">
          {APPROACH.map(({ label, icon: Icon }, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-black sm:h-16 sm:w-16">
                  <Icon size={22} sm:size={26} />
                </div>
                <div className="text-center text-xs font-medium text-neutral-800 sm:text-sm">
                  {label}
                </div>
              </div>
              {i < APPROACH.length - 1 && (
                <div className="hidden h-0 flex-1 border-t-2 border-dotted border-amber-400 md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
