"use client";

import { externalDestination } from "@/lib/externalLink";
import "./external-link.css";

type ExternalLinkModalProps = {
  href: string;
  onCancel: () => void;
  onContinue: () => void;
};

export default function ExternalLinkModal({ href, onCancel, onContinue }: ExternalLinkModalProps) {
  const destination = externalDestination(href);

  return (
    <div
      className="external-link-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        className="external-link-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-link-title"
      >
        <header className="external-link-header">
          <div>
            <p className="external-link-kicker">Leaving LLM Axis</p>
            <h3 id="external-link-title">Open external link?</h3>
          </div>
          <button type="button" className="external-link-close" onClick={onCancel} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="external-link-body">
          <p>This link takes you to another website. Continue only if you trust the destination.</p>
          <div className="external-link-destination">
            <span>Redirecting to</span>
            <strong>{destination.host}</strong>
            <code>{destination.display}</code>
          </div>
          <div className="external-link-actions">
            <button type="button" className="external-link-cancel" onClick={onCancel}>
              Stay here
            </button>
            <button type="button" className="external-link-continue" onClick={onContinue}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
