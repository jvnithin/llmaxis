"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RoadmapProject } from "./data";

type ProjectDetailModalProps = {
  project: RoadmapProject;
  onClose: () => void;
};

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="pr-modal-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="pr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="pr-modal-header">
          <div className="pr-modal-header-main">
            <p className="pr-modal-kicker">Project details</p>
            <div className="pr-modal-meta">
              <span className="pr-modal-number">{project.number}</span>
              <span className="pr-modal-level">{project.level}</span>
            </div>
            <h3 id={titleId} className="pr-modal-title">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            className="pr-modal-close"
            aria-label="Close project details"
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 2l10 10M12 2 2 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="pr-modal-body">
          <p className="pr-modal-copy">{project.description}</p>

          <section className="pr-modal-section">
            <p className="pr-modal-section-label">Focus skills</p>
            <div className="pr-modal-tags">
              {project.skills.map((skill) => (
                <span className="pr-modal-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="pr-modal-section">
            <p className="pr-modal-section-label">What you will learn</p>
            <ul className="pr-modal-learns">
              {project.learns.map((item) => (
                <li key={item}>
                  <span className="pr-modal-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
