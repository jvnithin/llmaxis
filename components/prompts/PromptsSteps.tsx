import { PROMPT_STEPS } from "./data";

export default function PromptsSteps() {
  return (
    <section className="prompts-section" id="how-it-works">
      <div className="prompts-shell">
        <div className="prompts-section-header">
          <p className="prompts-kicker">SIMPLE BY DESIGN</p>
          <h2>Three steps. Then make it yours.</h2>
        </div>

        <div className="prompts-steps-grid">
          {PROMPT_STEPS.map((step) => (
            <article key={step.number} className="prompts-step-card">
              <div className="prompts-step-meta">
                <span className="prompts-step-number">{step.number}</span>
                <span className="prompts-step-label">{step.label}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
