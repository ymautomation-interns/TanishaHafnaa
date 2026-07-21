import React from "react";
import { LOREM } from "../data/constants.js";

const SLIDE_IMAGES = [
  "/slide1.png",
  "/slide2.png",
  "/slide3.png",
  "/slide4.png",
  "/slide5.png",
  "/slide6.png",
  "/slide7.png",
];

function CustomerLogo({ src }) {
  return (
    <div className="flex h-20 w-48 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 shadow-sm sm:h-28 sm:w-64 sm:px-6">
      <img 
        src={src} 
        alt="Customer logo"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function OurCustomers() {
  const loop = [...SLIDE_IMAGES, ...SLIDE_IMAGES];
  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-4 pb-12 sm:px-6 sm:pb-16">
      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Our Customers</h2>
      <p className="mt-3 max-w-3xl text-sm text-neutral-500">{LOREM}</p>

      <div className="relative mt-6 overflow-hidden sm:mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-16" />
        <div className="animate-marquee flex w-max gap-3 sm:gap-5">
          {loop.map((src, i) => (
            <CustomerLogo src={src} key={`${src}-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
