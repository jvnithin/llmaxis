"use client";

import Image from "next/image";
import { OUTCOME_ACTIONS, outcomeExploreHref, type OutcomeAction } from "./data";

export default function PromptsOutcomes() {
  function openOutcome(action: OutcomeAction) {
    window.location.assign(outcomeExploreHref(action));
  }

  return (
    <section className="prompts-section prompts-section-muted" id="prompt-outcomes">
      <div className="prompts-shell">
        <div className="prompts-section-header prompts-section-header-center">
          <p className="prompts-kicker">BROWSE BY OUTCOME</p>
          <h2>What are you trying to do?</h2>
          <p>Jump straight into prompts built around the task you have in mind.</p>
        </div>

        <div className="prompts-outcome-grid">
          {OUTCOME_ACTIONS.map((action) => (
            <a
              key={action.id}
              href={outcomeExploreHref(action)}
              className="prompts-outcome-pill"
              onClick={(event) => {
                event.preventDefault();
                openOutcome(action);
              }}
            >
              <span className="prompts-outcome-label">
                <Image
                  src={action.icon}
                  alt=""
                  width={18}
                  height={18}
                  className="prompts-outcome-icon"
                />
                {action.label}
              </span>
              <Image
                src="/images/prompts/c6f72.svg"
                alt=""
                width={13}
                height={5}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
