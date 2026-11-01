import React from "react";
import Link from "next/link";
import Icon from "./Icon";
import NeuralCanvas from "./NeuralCanvas";
import PartnerWithUsButton from "./partnership/PartnerWithUsButton";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orb orb-one" aria-hidden="true" />
      <div className="hero-orb orb-two" aria-hidden="true" />
      <div className="float-shape shape-one" aria-hidden="true" />
      <div className="float-shape shape-two" aria-hidden="true" />
      <NeuralCanvas />

      <div className="section-container hero-content">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span>
              <Icon name="spark" size={14} />
            </span>
            Learn AI. Build what’s next.
          </div>
          <h1>
            AI Training. <span>Real-World Skills.</span> Career Growth.
          </h1>
          <p>
            Build in-demand AI skills, learn from industry experts, and unlock
            opportunities in the AI-powered economy.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/learning">
              Explore AI programs <Icon name="arrow" size={19} />
            </Link>
            <PartnerWithUsButton />
          </div>
          <div className="hero-proof">
            <div className="proof-avatars" aria-hidden="true">
              <span>AI</span>
              <span>ML</span>
              <span>LLM</span>
            </div>
            <p>
              <strong>Built for progress</strong>Practical learning for people
              and teams
            </p>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="axis-core">
            <span className="core-ring ring-one" />
            <span className="core-ring ring-two" />
            <span className="core-ring ring-three" />
            <span className="core-glow" />
            <span className="core-label">
              LLM<small>AXIS</small>
            </span>
          </div>
          <div className="orbit-card orbit-card-one">
            <Icon name="code" size={18} />
            <span>Build with AI</span>
          </div>
          <div className="orbit-card orbit-card-two">
            <Icon name="briefcase" size={18} />
            <span>Career-ready</span>
          </div>
          <div className="orbit-card orbit-card-three">
            <Icon name="spark" size={18} />
            <span>Think forward</span>
          </div>
        </div>
      </div>

      <a className="scroll-cue" href="#programs">
        <span>Scroll to explore</span>
        <i />
      </a>
    </section>
  );
}
