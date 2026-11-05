import Image from "next/image";
import { CAREER_HIGHLIGHTS } from "./data";

export default function CareersHero() {
  return (
    <header className="careers-hero">
      <div className="careers-badge">
        <span className="careers-badge-dot" aria-hidden="true" />
        <span>OPEN ROLES &amp; TALENT SQUADRONS • 2025 COHORT</span>
      </div>
      <h1>Careers at LLM Axis</h1>
      <p className="careers-hero-copy">
        Join our team pioneering practical generative AI education, agentic frameworks, and
        production-grade intelligent systems. We bridge frontier lab architectures to enterprise
        deployment.
      </p>
      <ul className="careers-highlights">
        {CAREER_HIGHLIGHTS.map((item) => (
          <li key={item.id}>
            <Image
              src={item.icon}
              alt=""
              width={Math.ceil(item.iconWidth)}
              height={Math.ceil(item.iconHeight)}
              className="careers-highlight-icon"
              unoptimized
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
