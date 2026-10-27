"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon, { IconName } from "@/components/home/Icon";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrochureModal from "@/components/learning/BroucherModal";
import EventRegisterModal from "@/components/events/EventRegisterModal";
import "@/components/learning/programs.css";

const audiences = [
  {
    number: "01",
    title: "Students & fresh graduates",
    copy: "Build practical AI skills beyond academic learning and develop projects that make your capabilities visible.",
  },
  {
    number: "02",
    title: "Working professionals",
    copy: "Expand your skills with LLMs, RAG, AI agents, and modern AI application development workflows.",
  },
  {
    number: "03",
    title: "Career switchers & founders",
    copy: "Explore a new technical direction or learn how AI applications can address real business needs.",
  },
];

const programBenefits = [
  {
    icon: "code" as IconName,
    title: "Learn by building",
    copy: "Apply what you learn through weekly labs, hands-on exercises, mini-projects, and a capstone.",
  },
  {
    icon: "education" as IconName,
    title: "Industry-aligned curriculum",
    copy: "Progress from LLM fundamentals to RAG, autonomous agents, multi-agent systems, and deployment.",
  },
  {
    icon: "training" as IconName,
    title: "Modern AI stack",
    copy: "Get hands-on exposure to LangChain, LangGraph, CrewAI, FastAPI, vector databases, and cloud technologies.",
  },
  {
    icon: "mentors" as IconName,
    title: "Expert mentorship",
    copy: "Learn with guidance from an experienced trainer and explore practical industry use cases.",
  },
  {
    icon: "briefcase" as IconName,
    title: "Portfolio-ready projects",
    copy: "Build practical applications and an end-to-end capstone to showcase your skills and project work.",
  },
  {
    icon: "value" as IconName,
    title: "Production-ready skills",
    copy: "Explore deployment, security, evaluation, monitoring, and the foundations of scalable AI applications.",
  },
];

const testimonials = [
  {
    quote:
      "The projects made complex AI concepts much easier to understand and apply. My practical skills and confidence working with modern GenAI tools and workflows grew.",
    name: "Sarah Miller",
    role: "Data Science Learner",
    initials: "SM",
  },
  {
    quote:
      "I really enjoyed the balance between concepts, hands-on labs, and real-world AI applications. It helped me turn what I learned into projects I could actually showcase.",
    name: "David Chen",
    role: "AI Engineer in Training",
    initials: "DC",
  },
];

const companyNames = [
  "Microsoft",
  "Oracle",
  "Amazon",
  "Adobe",
  "Google",
  "Deloitte",
  "Accenture",
];

export default function ProgramsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((element) => observer.observe(element));

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        appRef.current?.style.setProperty("--pointer-x", `${event.clientX}px`);
        appRef.current?.style.setProperty("--pointer-y", `${event.clientY}px`);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="programs-page" id="top" ref={appRef}>
      <div className="cursor-glow" aria-hidden="true" />
      <BrochureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <EventRegisterModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        badge="12-Week AI Program"
        title="Enroll in Program"
        subtitle="Enter your details to proceed to secure Razorpay checkout."
        eventName="12-Week GenAI & Agentic AI Program"
      />

      {/* Floating Navbar (UI from newllm2, sections: Our Programs, Hire Talent, Contact Us, Get Started) */}
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="program-hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="program-aura aura-one" aria-hidden="true" />
          <div className="program-aura aura-two" aria-hidden="true" />

          <div className="section-container program-hero-content">
            <p className="program-pill reveal">
              <Icon name="spark" size={14} />
              12-week GenAI & agentic AI internship
            </p>

            <h1 className="reveal">
              Get job-ready for the AI-powered <span>future.</span>
            </h1>

            <p className="reveal">
              Learn to design, build, and deploy real-world Generative AI and
              Agentic AI applications through hands-on projects, expert
              mentorship, and a practical 12-week learning journey.
            </p>

            <div className="program-hero-actions reveal">
              
              <button
                type="button"
                className="button button-primary"
                onClick={() => setModalOpen(true)}
              >
                Explore the curriculum <Icon name="arrow" size={18} />
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setEnrollModalOpen(true)}
              >
                Enroll Now
              </button>
            </div>

            <div className="program-metrics reveal">
              <div>
                <strong>12</strong>
                <span>guided weeks</span>
              </div>
              <div>
                <strong>06</strong>
                <span>portfolio builds</span>
              </div>
              <div>
                <strong>01</strong>
                <span>capstone project</span>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCE SECTION */}
        <section className="program-audience section-pad">
          <div className="section-container">
            <div className="program-section-heading reveal">
              <div>
                <p className="eyebrow">Who can join</p>
                <h2>Your next step in AI starts here.</h2>
              </div>
              <p>
                Whether you’re starting your career, expanding your technical
                skills, or exploring AI for your business, build practical
                knowledge that turns concepts into working applications.
              </p>
            </div>

            <div className="audience-grid">
              {audiences.map((audience) => (
                <article className="audience-card reveal" key={audience.number}>
                  <span>{audience.number}</span>
                  <h3>{audience.title}</h3>
                  <p>{audience.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CURRICULUM SECTION */}
        <section className="program-curriculum section-pad" id="curriculum">
          <div className="curriculum-glow" aria-hidden="true" />
          <div className="section-container">
            <div className="curriculum-heading reveal">
              <p className="eyebrow">Why LLM AXIS</p>
              <h2>More than learning. Build practical AI expertise.</h2>
              <p>
                Go beyond AI concepts with a structured, hands-on program
                designed to help you build, evaluate, and deploy modern AI
                applications.
              </p>
            </div>

            <div className="benefit-cloud">
              {programBenefits.map((benefit, index) => (
                <article
                  className={`program-benefit benefit-position-${index + 1} reveal`}
                  key={benefit.title}
                >
                  <span>
                    <Icon name={benefit.icon} />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </article>
              ))}

              <div className="curriculum-core" aria-hidden="true">
                <span>BUILD</span>
                <span>SHIP</span>
                <span>GROW</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRAINER SECTION */}
        <section className="trainer-section section-pad" id="trainer">
          <div className="section-container">
            <div className="trainer-heading reveal">
              <p className="eyebrow">Learn from experience</p>
              <h2>Build with confidence.</h2>
              <p>
                Learn from a practitioner who brings real-world experience in
                AI, data, cloud, and business technology into every session.
              </p>
            </div>

            <article className="trainer-card reveal">
              <div className="trainer-image">
                <Image
                  src="/assets/program-trainer.jpg"
                  alt="AI program trainer in a modern office"
                  width={600}
                  height={530}
                  className="w-full h-full object-cover"
                  priority
                />
                <span>Program lead</span>
              </div>

              <div className="trainer-copy">
                <p className="eyebrow">Your trainer</p>
                <h3>Learn with an industry practitioner.</h3>
                <p>
                  Sessions connect core concepts with the decisions, tools, and
                  delivery patterns used to build useful AI products in the real
                  world.
                </p>

                <ul>
                  <li>
                    <Icon name="check" size={17} /> Live guidance and project
                    feedback
                  </li>
                  <li>
                    <Icon name="check" size={17} /> Applied AI, cloud, and data
                    experience
                  </li>
                  <li>
                    <Icon name="check" size={17} /> Career and portfolio
                    perspective
                  </li>
                </ul>

                <a className="text-button" href="#enroll">
                  Talk to a mentor <Icon name="arrow" size={17} />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* STORIES SECTION */}
        <section className="program-stories section-pad">
          <div className="section-container">
            <div className="trainer-heading reveal">
              <p className="eyebrow">Learner stories</p>
              <h2>Hear from the learners.</h2>
              <p>
                Discover how learners experience practical, project-based
                learning with LLM AXIS.
              </p>
            </div>

            <div className="program-testimonials">
              {testimonials.map((story) => (
                <article
                  className="program-testimonial reveal"
                  key={story.name}
                >
                  <div
                    className="story-stars"
                    aria-label="Five out of five stars"
                  >
                    ★★★★★
                  </div>
                  <blockquote>“{story.quote}”</blockquote>
                  <div className="testimonial-person">
                    <span>{story.initials}</span>
                    <div>
                      <strong>{story.name}</strong>
                      <p>{story.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="program-cta" id="enroll">
          <div className="section-container">
            <div className="program-cta-panel reveal">
              <div className="cta-grid" aria-hidden="true" />
              <p className="eyebrow">Your next build starts here</p>
              <h2>Ready to build with AI?</h2>
              <p>
                Turn your curiosity into practical GenAI and Agentic AI skills
                through 12 weeks of guided, hands-on learning.
              </p>

              <div>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setEnrollModalOpen(true)}
                >
                  Explore enrollment <Icon name="arrow" size={18} />
                </button>
              </div>

              <p className="marquee-label">Experience shaped by the industry</p>
              <div className="company-marquee" aria-label="Industry companies">
                <div className="company-track">
                  {[...companyNames, ...companyNames].map((company, index) => (
                    <span key={`${company}-${index}`}>{company}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}