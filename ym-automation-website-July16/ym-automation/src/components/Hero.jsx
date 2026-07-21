import React from "react";
import { Link } from "react-router-dom";
import { Bot } from "lucide-react";
import { useContent } from "../context/ContentContext.jsx";

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;

  return (
    <section className="relative overflow-hidden bg-neutral-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl">
            {hero.titleLine1}
            <br />
            {hero.titleLine2}
          </h1>
          <p className="mt-4 max-w-md text-sm text-neutral-600 sm:mt-6 sm:text-base">{hero.subtitle}</p>
          <Link
            to={hero.buttonLink || "/contact"}
            className="mt-6 inline-block rounded-md bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 sm:mt-8 sm:px-7 sm:py-3.5"
          >
            {hero.buttonText}
          </Link>
        </div>

        <div className="relative flex h-64 items-center justify-center md:h-80 lg:h-96">
          <img
            src="/home.png"
            alt="Industry 4.0 Solutions"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
