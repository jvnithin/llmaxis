import React from "react";
import Icon from "./Icon";
import InquiryForm from "./InquiryForm";

export default function ContactSection() {
  return (
    <section className="contact section-pad" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="section-container contact-layout">
        <div className="contact-copy reveal">
          <p className="eyebrow">Start your next chapter</p>
          <h2>Ready to move forward with AI?</h2>
          <p>
            Whether you’re building career-ready skills or preparing your
            workforce for what’s next, we’ll help you find a practical path
            forward.
          </p>
          <ul>
            <li>
              <Icon name="check" size={17} /> Personalized program guidance
            </li>
            <li>
              <Icon name="check" size={17} /> Flexible options for learners
              and teams
            </li>
            <li>
              <Icon name="check" size={17} /> Clear next steps, without the
              hard sell
            </li>
          </ul>
        </div>
        <div className="reveal">
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
