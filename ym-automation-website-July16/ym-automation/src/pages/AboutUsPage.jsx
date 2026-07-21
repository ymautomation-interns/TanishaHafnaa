import React from "react";
import { Link } from "react-router-dom";
import { Lightbulb, Handshake, UserCheck } from "lucide-react";
import { SERVICES } from "../data/constants.js";

const INTRO =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const SHORT_LOREM =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text .";

const WHY_CHOOSE_LOREM =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

const WHY_CHOOSE_US = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We create smart, future-proof automation solutions using advanced technologies to keep your business ahead.",
  },
  {
    icon: Handshake,
    title: "Commitment",
    description:
      "Our dedicated team ensures every project is delivered with precision, quality, and on-time performance.",
  },
  {
    icon: UserCheck,
    title: "Customer satisfaction",
    description:
      "We focus on your needs, delivering personalized solutions and ongoing support to exceed your expectations.",
  },
];

function Breadcrumb() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 text-sm text-neutral-500">
      <Link to="/" className="hover:text-amber-500">
        Home
      </Link>{" "}
      / <span className="text-neutral-700">About Us</span>
    </div>
  );
}

function IntroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="text-3xl font-bold text-neutral-900">About Us</h1>
      <p className="mt-4 max-w-4xl text-sm leading-relaxed text-neutral-500">
        {INTRO}
      </p>
    </section>
  );
}

function WhoWeAre() {
  const firstHalf = SERVICES.slice(0, 4);
  const secondHalf = SERVICES.slice(4, 8);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="h-72 w-full overflow-hidden rounded-xl">
          <img
            src="/aboutus.jpg"
            alt="Our team"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Who We Are</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            We are a multidisciplinary team of engineers, developers, and
            innovators with deep expertise in:
          </p>

          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {firstHalf.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm text-neutral-700">
                <span className="text-amber-400">•</span>
                {s.label}
              </div>
            ))}
            {secondHalf.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm text-neutral-700">
                <span className="text-amber-400">•</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  return (
    <section className="bg-amber-50 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
        <div className="text-center md:border-r md:border-amber-200 md:pr-10">
          <h3 className="text-2xl font-bold text-neutral-900">Our Mission</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
            {SHORT_LOREM}
          </p>
        </div>
        <div className="text-center md:pl-10">
          <h3 className="text-2xl font-bold text-neutral-900">Our Vision</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">
            {SHORT_LOREM}
          </p>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-neutral-900">Why Choose Us</h2>
      <p className="mx-auto mt-3 max-w-3xl text-sm text-neutral-500">
        {WHY_CHOOSE_LOREM}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
        {WHY_CHOOSE_US.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 -m-1 rounded-full bg-amber-200 opacity-50 blur-md" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <Icon size={26} className="text-amber-500" />
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">
              {title}
            </h3>
            <p className="mt-2 max-w-xs text-sm text-neutral-500">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AboutUsPage() {
  return (
    <>
      <Breadcrumb />
      <IntroSection />
      <WhoWeAre />
      <MissionVision />
      <WhyChooseUs />
    </>
  );
}
