import { CAPSTONE } from "./data";

type CapstoneCardProps = {
  onOpen?: () => void;
};

export default function CapstoneCard({ onOpen }: CapstoneCardProps) {
  const content = (
    <>
      <div className="pr-capstone-header">
        <div className="pr-capstone-badges">
          <span className="pr-capstone-main">
            <span className="pr-capstone-star" aria-hidden="true">
              ★
            </span>{" "}
            Main project • <strong>13 of 13</strong>
          </span>
          <span className="pr-capstone-tag">Full Production Capstone</span>
        </div>
        <div className="pr-capstone-live">
          <span className="pr-capstone-dot" aria-hidden="true" />
          Live Deployment Target
        </div>
      </div>

      <div className="pr-capstone-content">
        <h3>
          {CAPSTONE.titleLine1}
          <br />
          {CAPSTONE.titleLine2}
        </h3>
        <p>{CAPSTONE.description}</p>
      </div>

      <div className="pr-capstone-tech">
        <p className="pr-card-skills-label">Integrated technologies:</p>
        <div className="pr-capstone-tags">
          {CAPSTONE.technologies.map((tech) => (
            <span className="pr-capstone-tech-tag" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pr-capstone-github">
        <span>
          <span className="pr-capstone-check" aria-hidden="true">
            ✓
          </span>{" "}
          GitHub Ready &amp; Live Demo
        </span>
      </div>

      <div className="pr-capstone-divider" aria-hidden="true" />

      <div className="pr-capstone-foundations">
        <p>Cumulative architecture synthesized from Weeks 01 to 12:</p>
        <div className="pr-capstone-foundation-list">
          {CAPSTONE.foundations.map((item, index) => (
            <span key={item}>
              {item}
              {index < CAPSTONE.foundations.length - 1 ? "  •" : ""}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (!onOpen) {
    return <article className="pr-capstone">{content}</article>;
  }

  return (
    <button
      type="button"
      className="pr-capstone pr-capstone-action"
      onClick={onOpen}
      aria-label="View details for Production-Ready Agentic AI Business Solution"
    >
      {content}
    </button>
  );
}
