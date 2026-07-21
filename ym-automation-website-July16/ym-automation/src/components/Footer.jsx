import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  ChevronsUp,
  ArrowRight,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "Careers", path: "/career" },
  { label: "Contact Us", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-neutral-300">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(600px circle at 15% 30%, rgba(217,119,6,0.25), transparent 60%), radial-gradient(500px circle at 85% 70%, rgba(251,191,36,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img 
            src="/ymfooter.png" 
            alt="YM Automation Pvt Ltd Logo"
            className="h-12 w-auto sm:h-16"
          />
          <div className="mt-2 text-base font-bold text-white sm:mt-3 sm:text-lg">
            YM Automation Pvt Ltd
          </div>
          <div className="font-serif text-xs italic text-neutral-500">
            The Mechatronics You Need
          </div>
        </div>

        <div>
          <div className="mb-3 font-semibold text-white sm:mb-4">Quick link</div>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className="flex items-center gap-2 transition hover:text-amber-400"
                >
                  <ArrowRight size={12} className="text-amber-400" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 font-semibold text-white sm:mb-4">Contact Info</div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <span className="text-xs sm:text-sm">
                No. 2/395-3, SF No 240/2, Idigarai Road, NGGO Colony Post,
                Sengalipalayam, Coimbatore – 641022.
              </span>
            </li>
            <li className="flex gap-2">
              <Mail size={16} className="text-amber-400" />
              ym@ymautomation.com
            </li>
            <li className="flex gap-2">
              <Phone size={16} className="text-amber-400" />
              +91 94890 23450
            </li>
            <li className="text-xs text-neutral-500">
              GST No : 33AABCY2739A1Z0
            </li>
            <li className="text-xs text-neutral-500">
              CIN No : U72900TZ2020PTC034445
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 font-semibold text-white sm:mb-4">Follow us</div>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-black hover:bg-amber-300 sm:h-9 sm:w-9"
              >
                <Icon size={14} sm:size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-neutral-800 py-3 text-center text-xs text-neutral-500 sm:py-4">
        Copyright © 2026 YM Automation Pvt Ltd. All rights reserved.
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="absolute bottom-16 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-amber-400 hover:text-black sm:bottom-20 sm:right-6 sm:h-10 sm:w-10"
      >
        <ChevronsUp size={16} sm:size={18} />
      </button>
    </footer>
  );
}
