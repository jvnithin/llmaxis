"use client";

import Link from "next/link";
import { EXPLORE_PROMPT_COUNT, listAllPrompts } from "./explore/explore-data";

const ALL_PROMPTS = listAllPrompts();

export default function PromptsCta() {
  function surpriseMe() {
    if (ALL_PROMPTS.length === 0) return;
    const pick = ALL_PROMPTS[Math.floor(Math.random() * ALL_PROMPTS.length)];
    window.location.assign(`/prompts/${pick.slug}`);
  }

  return (
    <section className="prompts-section prompts-section-muted prompts-cta-section">
      <div className="prompts-shell">
        <div className="prompts-cta-banner">
          <div>
            <h2>Start with a better prompt.</h2>
            <p>Explore the full library. No account required. No paywall.</p>
          </div>
          <div className="prompts-cta-actions">
            <button type="button" className="prompts-cta-ghost" onClick={surpriseMe}>
              🎲 Surprise me
            </button>
            <Link className="prompts-cta-solid" href="/prompts/explore">
              Explore all {EXPLORE_PROMPT_COUNT} prompts →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
