// components/LazyImage.tsx
"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function LazyImage({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton shimmer */}
      {!loaded && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={className}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
      <style>{`
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}