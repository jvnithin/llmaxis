"use client";

import React, { useState } from "react";
import Icon from "./Icon";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const testimonials: TestimonialItem[] = [
  {
    quote:
      "The projects made complex AI concepts much easier to understand and apply. My practical skills and confidence working with modern GenAI tools and workflows grew.",
    name: "Suman",
    role: "Data Scientist",
    initials: "SM",
  },
  {
    quote:
      "I really enjoyed the balance between concepts, hands-on labs, and real-world AI applications. It helped me turn what I learned into projects I could actually showcase.",
    name: "Nandhini",
    role: "AI Engineer",
    initials: "DC",
  },
];

export default function StoriesSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const activeTestimonial = testimonials[current];

  return (
    <section className="stories section-pad" id="stories">
      <div className="section-container">
        <div className="stories-top reveal">
          <div>
            <p className="eyebrow">Learner stories</p>
            <h2>Hear from the learners.</h2>
          </div>
          <p>
            Feedback shared by learners about practical, project-based AI
            training with LLM AXIS.
          </p>
        </div>

        <div className="testimonial-shell reveal">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div className="testimonial-track" key={current}>
            <blockquote>{activeTestimonial.quote}</blockquote>
            <div className="testimonial-person">
              <span>{activeTestimonial.initials}</span>
              <p>
                <strong>{activeTestimonial.name}</strong>
                {activeTestimonial.role}
              </p>
            </div>
          </div>
          <div className="carousel-controls">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={prev}
            >
              <Icon name="arrow" size={19} />
            </button>
            <span>
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={next}
            >
              <Icon name="arrow" size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
