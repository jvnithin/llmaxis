"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import CommunityJoinForm, { type CommunityLinks } from "./CommunityJoinForm";
import CommunityJoinSuccess from "./CommunityJoinSuccess";
import "../business-enquiry/business-enquiry.css";
import "./community.css";

type CommunityJoinModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CommunityJoinModal({ open, onClose }: CommunityJoinModalProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<CommunityLinks | null>(null);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setLinks(null);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="enquiry-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="enquiry-header">
          <div>
            <p className="enquiry-kicker">AI Community</p>
            <h3 id={titleId}>{links ? "You're on the list" : "Join the community"}</h3>
            <p>
              {links
                ? "Use either link below to meet the community."
                : "Tell us how to reach you, then we'll share the community links."}
            </p>
          </div>
          <button type="button" className="enquiry-close" onClick={onClose} aria-label="Close form">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        {links ? <CommunityJoinSuccess links={links} /> : <CommunityJoinForm onSuccess={setLinks} />}
      </div>
    </div>,
    document.body
  );
}
