"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Icon, { IconName } from "@/components/home/Icon";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrochureModal from "@/components/learning/BroucherModal";
import { ProjectsRoadmapSection } from "@/components/learning/projects-roadmap";
import EventRegisterModal from "@/components/events/EventRegisterModal";
import LearnerStoriesSection from "@/components/learning/LearnerStoriesSection";
import "@/components/learning/programs.css";

const audiences = [
  {
    number: "01",
    title: "Students & fresh graduates",
    copy: "Build practical AI skills beyond academic learning and develop projects that make your capabilities visible.",
    icon: "/images/audience/students.png",
  },
  {
    number: "02",
    title: "Working professionals",
    copy: "Expand your skills with LLMs, RAG, AI agents, and modern AI application development workflows.",
    icon: "/images/audience/professionals.png",
  },
  {
    number: "03",
    title: "Career switchers & founders",
    copy: "Explore a new technical direction or learn how AI applications can address real business needs.",
    icon: "/images/audience/founders.png",
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

const companyLogos = [
  { name: "Microsoft", src: "/logos/marquee/microsoft.png", width: 140, height: 30 },
  { name: "Oracle", src: "/logos/marquee/oracle.png", width: 120, height: 28 },
  { name: "Amazon", src: "/logos/marquee/amazon.png", width: 110, height: 34 },
  { name: "Adobe", src: "/logos/marquee/adobe.svg", width: 120, height: 32 },
  { name: "Google", src: "/logos/marquee/google.png", width: 110, height: 36 },
  { name: "Deloitte", src: "/logos/marquee/deloitte.svg", width: 130, height: 32 },
  { name: "Accenture", src: "/logos/marquee/accenture.png", width: 120, height: 32 },
] as const;

const BROCHURE_AUTO_DELAY_MS = 15_000;

function getScrollProgress() {
  const doc = document.documentElement;
  const body = document.body;
  const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
  const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
  const maxScroll = Math.max(scrollHeight - window.innerHeight, 1);
  return scrollTop / maxScroll;
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="app" aria-busy="true" />}>
      <ProgramsPageContent />
    </Suspense>
  );
}

function ProgramsPageContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const midpointRef = useRef<HTMLDivElement>(null);
  const modalOpenRef = useRef(false);
  const enrollModalOpenRef = useRef(false);
  const autoOpenedRef = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  modalOpenRef.current = modalOpen;
  enrollModalOpenRef.current = enrollModalOpen;

  // Navbar "Get Started" → /learning?brochure=1 opens the curriculum download modal.
  useEffect(() => {
    const brochure = searchParams.get("brochure");
    if (brochure !== "1" && brochure?.toLowerCase() !== "true") return;

    setEnrollModalOpen(false);
    setModalOpen(true);
    autoOpenedRef.current = true;

    // Keep the programs page URL clean after opening.
    router.replace(pathname || "/learning", { scroll: false });
  }, [searchParams, router, pathname]);

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

  // Auto-open brochure when EITHER condition is met first:
  // 1) user stays on this page for 15+ seconds
  // 2) user scrolls to ~50% / midpoint of the page
  useEffect(() => {
    if (typeof window === "undefined") return;

    autoOpenedRef.current = false;

    let cancelled = false;
    let dwellTimerId = 0;
    let retryTimerId = 0;
    let midObserver: IntersectionObserver | null = null;

    const cleanup = () => {
      window.clearTimeout(dwellTimerId);
      window.clearTimeout(retryTimerId);
      window.removeEventListener("scroll", onScrollHalf, true);
      midObserver?.disconnect();
      midObserver = null;
    };

    const openFromAutoTrigger = () => {
      if (cancelled || autoOpenedRef.current) return;

      // Already open manually — treat as handled for this visit
      if (modalOpenRef.current) {
        autoOpenedRef.current = true;
        cleanup();
        return;
      }

      // Wait until enroll modal is closed, then retry
      if (enrollModalOpenRef.current) {
        retryTimerId = window.setTimeout(() => {
          if (!cancelled) openFromAutoTrigger();
        }, 700);
        return;
      }

      autoOpenedRef.current = true;
      cleanup();
      setModalOpen(true);
    };

    // Condition 1: dwell time >= 15s
    dwellTimerId = window.setTimeout(() => {
      openFromAutoTrigger();
    }, BROCHURE_AUTO_DELAY_MS);

    // Condition 2: scrolled halfway
    const onScrollHalf = () => {
      if (cancelled || autoOpenedRef.current) return;
      if (getScrollProgress() >= 0.5) {
        openFromAutoTrigger();
      }
    };

    window.addEventListener("scroll", onScrollHalf, { passive: true, capture: true });
    onScrollHalf();

    // Condition 2 (backup): midpoint marker enters the viewport
    const midpointNode = midpointRef.current;
    if (midpointNode) {
      midObserver = new IntersectionObserver(
        (entries) => {
          if (cancelled || autoOpenedRef.current) return;
          if (entries.some((entry) => entry.isIntersecting)) {
            openFromAutoTrigger();
          }
        },
        { root: null, threshold: 0 },
      );
      midObserver.observe(midpointNode);
    }

    return () => {
      cancelled = true;
      cleanup();
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
                <strong>12</strong>
                <span>portfolio builds</span>
              </div>
              <div>
                <strong>01</strong>
                <span>capstone project</span>
              </div>
            </div>
          </div>
        </section>

        <ProjectsRoadmapSection />

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
                  <div className="audience-card-top">
                    <span>{audience.number}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="audience-card-icon"
                      src={audience.icon}
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="audience-card-body">
                    <h3>{audience.title}</h3>
                    <p>{audience.copy}</p>
                  </div>
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
        {/* Auto-brochure trigger: fires when this midpoint enters the viewport */}
        <div
          ref={midpointRef}
          className="programs-brochure-midpoint"
          aria-hidden="true"
        />

        <section className="trainer-section section-pad" id="trainer">
          <div className="section-container">
            <div className="trainer-heading reveal">
              <p className="eyebrow">Trainer&apos;s Profile</p>
              <h2>Learn with an industry practitioner.</h2>
              <p>
                Learn from an experienced leader who brings deep expertise in
                Generative AI, Agentic AI, Cloud, and Enterprise Architecture into every session.
              </p>
            </div>

            <article className="trainer-card reveal">
              {/* TOP HEADER: Title & Tagline */}
              <div className="trainer-card-topbar">
                <h3 className="trainer-card-title">Trainer&apos;s Profile</h3>
                <div className="trainer-tagline-badge">
                  <Icon name="spark" size={16} />
                  <span>AI Practitioner, Trainer, Entrepreneur, Leadership Coach &amp; Trusted Advisor</span>
                </div>
              </div>

              {/* MAIN CONTENT GRID */}
              <div className="trainer-main-grid">
                {/* TOP LEFT: Career Experience & Metrics */}
                <div className="trainer-experience-block">
                  <div className="trainer-roles-list">
                    <div className="trainer-role-item">
                      <div className="trainer-role-logo-wrap">
                        <Image
                          src="/logos/clients/amazon_logo.png"
                          alt="Amazon"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div className="trainer-role-details">
                        <h4 className="trainer-role-title">Senior Software Engineer</h4>
                        <p className="trainer-role-company">Amazon</p>
                        <span className="trainer-role-dates">June 2022 – Feb 2024</span>
                      </div>
                    </div>

                    <div className="trainer-role-item">
                      <div className="trainer-role-logo-wrap">
                        <Image
                          src="/logos/clients/microsoft_icon.svg"
                          alt="Microsoft"
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                      </div>
                      <div className="trainer-role-details">
                        <h4 className="trainer-role-title">Tech Lead</h4>
                        <p className="trainer-role-company">Microsoft</p>
                        <span className="trainer-role-dates">Aug 2017 – Feb 2019</span>
                      </div>
                    </div>
                  </div>

                  <div className="trainer-stat-pill">
                    <Icon name="spark" size={17} />
                    <span>Trained <strong>3,000+</strong> professionals &amp; students across the Globe</span>
                  </div>
                </div>

                {/* TOP RIGHT: Trainer Portrait & Identity */}
                <div className="trainer-portrait-block">
                  <div className="trainer-avatar-container">
                    <div className="trainer-aura-ring trainer-aura-ring-1" aria-hidden="true" />
                    <div className="trainer-aura-ring trainer-aura-ring-2" aria-hidden="true" />
                    <div className="trainer-avatar-img-wrap">
                      <Image
                        src="/Ganesh.jpg"
                        alt="Ganesh Adabala - Founder & Lead Trainer"
                        width={180}
                        height={180}
                        className="trainer-avatar-img"
                        priority
                      />
                    </div>
                  </div>
                  <div className="trainer-identity">
                    <h3 className="trainer-name">Ganesh Adabala</h3>
                    <p className="trainer-title-sub">
                      Subject Matter Expert at{" "}
                      <a
                        href={process.env.NEXT_PUBLIC_LLM_AXIS_LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LLM AXIS
                      </a>
                    </p>
                    <span className="trainer-exp-badge">16+ Yrs of Global Experience</span>
                  </div>
                </div>

                {/* BOTTOM LEFT: Detailed Bio */}
                <div className="trainer-bio-block">
                  <p>
                    <strong>Ganesh Adabala</strong> is a seasoned <strong>Data &amp; AI Trainer</strong> with{" "}
                    <strong>15+ years</strong> of global technology experience across companies such as{" "}
                    <strong>Microsoft, Amazon, Eurofins, and Neudesic</strong>. He specializes in helping organizations and
                    professionals adopt{" "}
                    <strong>Generative AI, Agentic AI, Data Analytics, and Cloud technologies</strong> to build
                    business-ready solutions that create <strong>measurable impact</strong>.
                  </p>
                  <p>
                    Ganesh blends <strong>practitioner expertise + hands-on teaching</strong> to make complex AI concepts
                    practical, accessible, and immediately applicable. His delivery style emphasizes{" "}
                    <strong>real business use cases</strong>, <strong>workflow integration</strong>,{" "}
                    <strong>tool-based execution</strong>, and <strong>ROI-driven adoption</strong>.
                  </p>

                  {/* <div className="trainer-action-area">
                    <button
                      type="button"
                      className="text-button trainer-mentor-btn"
                      onClick={() => setEnrollModalOpen(true)}
                    >
                      Talk to a mentor <Icon name="arrow" size={16} />
                    </button>
                  </div> */}
                </div>

                {/* BOTTOM RIGHT: Trained Across Logos */}
                <div className="trainer-clients-block">
                  <h4 className="trainer-clients-heading">Trained across:</h4>
                  <div className="trainer-clients-box" role="list" aria-label="Organizations trained across">
                    {[
                      {
                        name: "Centric",
                        src: "/logos/clients/centric.svg",
                        width: 118,
                        height: 28,
                      },
                      {
                        name: "Accenture",
                        src: "/logos/clients/accenture_clean.png",
                        width: 122,
                        height: 32,
                      },
                      {
                        name: "Deloitte",
                        src: "/logos/clients/deloitte.svg",
                        width: 118,
                        height: 28,
                      },
                      {
                        name: "AICTE & AICTE IDEA Lab",
                        src: "/logos/clients/aicte_clean.png",
                        width: 118,
                        height: 44,
                        className: "is-tall",
                      },
                      {
                        name: "IIT Madras",
                        src: "/logos/clients/iit_madras.png",
                        width: 48,
                        height: 48,
                        className: "is-tall is-seal",
                      },
                    ].map((client) => (
                      <div
                        key={client.name}
                        className={`trainer-client-logo${client.className ? ` ${client.className}` : ""}`}
                        role="listitem"
                      >
                        <Image
                          src={client.src}
                          alt={client.name}
                          width={client.width}
                          height={client.height}
                          className="trainer-client-img"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <LearnerStoriesSection />

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
                  Enroll Now <Icon name="arrow" size={18} />
                </button>
              </div>

              <p className="marquee-label">Experience shaped by the industry</p>
              <div className="company-marquee" aria-label="Industry companies">
                <div className="company-track">
                  {[...companyLogos, ...companyLogos].map((company, index) => (
                    <span className="company-logo" key={`${company.name}-${index}`}>
                      <Image
                        src={company.src}
                        alt={company.name}
                        width={company.width}
                        height={company.height}
                        className="company-logo-image"
                      />
                    </span>
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