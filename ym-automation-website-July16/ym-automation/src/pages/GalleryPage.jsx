import React from "react";
import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";

function Breadcrumb() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 text-sm text-neutral-500">
      <Link to="/" className="hover:text-amber-500">
        Home
      </Link>{" "}
      / <span className="text-neutral-700">Gallery</span>
    </div>
  );
}

export default function GalleryPage() {
  const { content } = useContent();
  const images = content.gallery;

  return (
    <>
      <Breadcrumb />
      <section className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="text-3xl font-bold text-neutral-900">Gallery</h1>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {images.map((src, i) => (
            <div
              key={i}
              className="group aspect-square w-full overflow-hidden rounded-md"
            >
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
