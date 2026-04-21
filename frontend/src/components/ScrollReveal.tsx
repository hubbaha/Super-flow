"use client";
import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sf-reveal");

    if (!window.IntersectionObserver) {
      els.forEach((el) => el.classList.add("sf-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sf-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}