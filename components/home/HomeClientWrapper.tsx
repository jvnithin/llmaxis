"use client";

import React, { useEffect, useRef } from "react";

interface HomeClientWrapperProps {
  children: React.ReactNode;
}

export default function HomeClientWrapper({ children }: HomeClientWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((element) => observer.observe(element));

    // Scroll parallax tracker
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--scroll-y",
          `${window.scrollY}px`
        );
      });
    };

    // Mouse pointer glow tracker
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && containerRef.current) {
        containerRef.current.style.setProperty(
          "--pointer-x",
          `${event.clientX}px`
        );
        containerRef.current.style.setProperty(
          "--pointer-y",
          `${event.clientY}px`
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="site" id="top" ref={containerRef}>
      <div className="cursor-glow" aria-hidden="true" />
      {children}
    </div>
  );
}
