"use client";

import { useEffect, useState } from "react";

export function ImageLightbox({
  src,
  alt,
  className = "h-80 w-full object-cover sm:h-80 lg:h-96",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className="group relative cursor-zoom-in overflow-hidden"
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className={`${className} transition-transform duration-700 group-hover:scale-105`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
          <span className="scale-75 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 opacity-0 shadow transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            Click to expand
          </span>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-slate-100"
              aria-label="Close"
            >
              <svg className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}