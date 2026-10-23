import React from "react";

export default function ExperienceSection() {
  return (
    <section className="experience">
      <div className="section-container reveal">
        <div className="experience-panel">
          <div className="experience-grid" aria-hidden="true" />
          <p className="eyebrow">Industry experience</p>
          <h2>Experience shaped by the industry.</h2>
          <p>
            Our approach is informed by experience across technology,
            consulting, data, AI, and cloud environments.
          </p>
          <div className="industry-list">
            <span>Technology</span>
            <i />
            <span>Consulting</span>
            <i />
            <span>Data + AI</span>
            <i />
            <span>Cloud</span>
          </div>
        </div>
      </div>
    </section>
  );
}
