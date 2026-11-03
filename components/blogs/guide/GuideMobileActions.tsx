"use client";

import { useEffect, useState } from "react";

export default function GuideMobileActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToCounselling() {
    const target = document.getElementById("guide-counselling");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      const firstField = target.querySelector<HTMLElement>("input, select, textarea, button");
      firstField?.focus({ preventScroll: true });
    }, 450);
  }

  return (
    <div className="guide-mobile-actions" aria-label="Page shortcuts">
      <button type="button" className="guide-mobile-counselling" onClick={scrollToCounselling}>
        Free counselling
      </button>
      {showTop ? (
        <button
          type="button"
          className="guide-mobile-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none">
            <path
              d="M6 14.5 12 8.5l6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
