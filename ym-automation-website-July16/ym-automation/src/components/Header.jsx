import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo.jsx";
import { NAV_ITEMS } from "../data/constants.js";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {[Facebook, Instagram, Linkedin].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 text-white transition hover:bg-amber-400 hover:text-black sm:h-9 sm:w-9"
            >
              <Icon size={14} sm:size={16} />
            </a>
          ))}
          <Link
            to="/contact"
            className="ml-1 rounded-md bg-amber-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-amber-300 sm:ml-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <nav className="border-t border-neutral-100 bg-neutral-50">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 sm:gap-10 sm:px-6 sm:overflow-x-visible">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={label}
                to={path}
                className={`flex shrink-0 items-center gap-2 border-b-2 py-4 text-[13px] font-medium transition sm:text-[15px] ${
                  active
                    ? "border-amber-400 text-black"
                    : "border-transparent text-neutral-500 hover:text-black"
                }`}
              >
                <Icon size={14} sm:size={16} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

