import React from "react";
import { Check } from "lucide-react";

export default function SuccessModal({ title, message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-green-500">
            <Check size={22} className="text-green-500" />
          </div>
        </div>

        <h3 className="mt-5 text-lg font-bold text-neutral-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {message}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          Ok
        </button>
      </div>
    </div>
  );
}
