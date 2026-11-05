import { EXPLORE_PROMPT_COUNT } from "./explore-data";

export default function ExploreHero() {
  return (
    <header className="explore-hero">
      <div className="explore-shell">
        <p className="explore-eyebrow">
          <span aria-hidden="true">✦</span>
          PROMPT COLLECTION
        </p>
        <h1>Explore all AI prompts</h1>
        <p className="explore-hero-copy">
          Search prompts built around four audiences:{" "}
          <strong>USA IT professionals</strong>, <strong>non-IT professionals</strong>,{" "}
          <strong>jobseekers</strong>, and <strong>master&apos;s students</strong>.
        </p>
        <div className="explore-hero-pills">
          <span className="explore-pill explore-pill-live">
            <span className="explore-pill-dot" aria-hidden="true" />
            {EXPLORE_PROMPT_COUNT} prompts
          </span>
          <span className="explore-pill">Free to use</span>
          <span className="explore-pill">ChatGPT · Claude · Gemini · DeepSeek</span>
        </div>
      </div>
    </header>
  );
}
