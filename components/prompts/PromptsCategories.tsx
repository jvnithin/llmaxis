import Link from "next/link";
import {
  AUDIENCE_EXPLORE_PARAM,
  PROMPT_AUDIENCES,
  type PromptAudience,
} from "./data";

function AudienceIcon({ icon }: { icon: PromptAudience["icon"] }) {
  if (icon === "code") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="M8.2 6.5 4.5 11l3.7 4.5M13.8 6.5 17.5 11l-3.7 4.5M12.2 5.5l-2.4 11"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "briefcase") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="3.5" y="7" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h2.4A1.8 1.8 0 0 1 14 5.8V7M3.5 11.5h15"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (icon === "graduation") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path
          d="m3.5 9.2 7.5-3.7 7.5 3.7-7.5 3.7L3.5 9.2Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M6.8 11v3.4c0 .7 2.4 2.2 4.2 2.2s4.2-1.5 4.2-2.2V11M18.5 9.5v5.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="11" cy="11" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function PromptsCategories() {
  return (
    <section className="prompts-section prompts-section-muted" id="prompt-categories">
      <div className="prompts-shell">
        <div className="prompts-library-panel">
          <header className="prompts-library-header">
            <p className="prompts-library-badge">EXPLORE THE LIBRARY</p>
            <h2>Free AI Prompt Library</h2>
            <p>Explore practical AI prompts designed for your professional and academic goals.</p>
          </header>

          <div className="prompts-library-divider" aria-hidden="true" />

          <div className="prompts-audience-grid" aria-label="Audience categories">
            {PROMPT_AUDIENCES.map((audience) => (
              <Link
                key={audience.id}
                href={`/prompts/explore?audience=${AUDIENCE_EXPLORE_PARAM[audience.id]}`}
                className="prompts-audience-card"
              >
                <div className="prompts-audience-card-top">
                  <div className="prompts-audience-main">
                    <span className="prompts-audience-icon" aria-hidden="true">
                      <AudienceIcon icon={audience.icon} />
                    </span>
                    <span className="prompts-audience-copy">
                      <strong>{audience.title}</strong>
                      <span>
                        {audience.subcategoryCount} subcategories • {audience.promptCount}{" "}
                        prompts
                      </span>
                    </span>
                  </div>
                  <span className="prompts-audience-tag">{audience.tag}</span>
                </div>

                <div className="prompts-audience-card-footer">
                  <span className="prompts-audience-cta">Explore Prompts →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
