import React from "react";
import Icon, { IconName } from "./Icon";

interface BenefitItem {
  icon: IconName;
  number: string;
  title: string;
  copy: string;
}

const benefits: BenefitItem[] = [
  {
    icon: "code",
    number: "01",
    title: "Practical learning",
    copy: "Build by doing with hands-on labs, real-world projects, and tools used across today’s AI ecosystem.",
  },
  {
    icon: "mentors",
    number: "02",
    title: "Expert mentors",
    copy: "Learn with experienced practitioners who connect AI concepts to modern industry workflows.",
  },
  {
    icon: "briefcase",
    number: "03",
    title: "Job readiness",
    copy: "Develop career-ready skills and a practical body of work you can speak about with confidence.",
  },
  {
    icon: "value",
    number: "04",
    title: "Affordable programs",
    copy: "Access focused, high-value learning designed to make advanced AI education more attainable.",
  },
];

export default function WhySection() {
  return (
    <section className="why section-pad" id="why">
      <div className="why-glow" aria-hidden="true" />
      <div className="section-container">
        <div className="why-layout">
          <div className="why-sticky reveal">
            <p className="eyebrow">Why LLM AXIS</p>
            <h2>More than learning. Build practical AI expertise.</h2>
            <p>
              Learn from professionals who bring real-world technology, AI,
              cloud, and business experience into every lesson.
            </p>
            <div className="tool-row" aria-label="Learning areas">
              <span>GEN AI</span>
              <span>AGENTS</span>
              <span>CLOUD</span>
              <span>LLMs</span>
            </div>
          </div>

          <div className="benefit-list">
            {benefits.map((benefit) => (
              <article className="benefit reveal" key={benefit.title}>
                <span className="benefit-number">{benefit.number}</span>
                <span className="benefit-icon">
                  <Icon name={benefit.icon} />
                </span>
                <div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
