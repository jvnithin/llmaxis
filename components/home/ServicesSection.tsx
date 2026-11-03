"use client";

import { useState } from "react";
import Link from "next/link";
import Icon, { IconName } from "./Icon";
import BusinessEnquiryModal from "./business-enquiry/BusinessEnquiryModal";
import CommunityJoinModal from "./community/CommunityJoinModal";
import JobAssistanceModal from "./job-assistance/JobAssistanceModal";
import PartnershipModal from "./partnership/PartnershipModal";

interface ServiceItem {
  icon: IconName;
  title: string;
  copy: string;
}

interface ServiceGroup {
  eyebrow: string;
  title: string;
  description: string;
  services: ServiceItem[];
}

const serviceGroups: ServiceGroup[] = [
  {
    eyebrow: "For individuals",
    title: "Build skills that move your career forward.",
    description:
      "Go from AI-curious to career-ready with practical training, a supportive community, and guidance for your next move.",
    services: [
      {
        icon: "training",
        title: "AI Training",
        copy: "Learn in-demand AI skills through guided labs, modern tools, and real-world projects.",
      },
      {
        icon: "community",
        title: "AI Community",
        copy: "Learn alongside ambitious peers, share ideas, and grow with a community built around progress.",
      },
      {
        icon: "briefcase",
        title: "AI Job Assistance",
        copy: "Turn your skills into momentum with portfolio guidance, interview preparation, and career support.",
      },
    ],
  },
  {
    eyebrow: "For businesses",
    title: "Put AI to work across your organization.",
    description:
      "Equip your workforce, identify practical opportunities, and move from AI ambition to measurable business value.",
    services: [
      {
        icon: "education",
        title: "AI Education & Corporate Training",
        copy: "Build practical AI fluency with tailored workforce upskilling for teams and leaders.",
      },
      {
        icon: "building",
        title: "AI Solutions",
        copy: "Design enterprise AI solutions around real workflows, customer needs, and business priorities.",
      },
      {
        icon: "consulting",
        title: "AI Consulting",
        copy: "Clarify your roadmap with grounded strategy, use-case discovery, and implementation guidance.",
      },
    ],
  },
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [jobAssistanceOpen, setJobAssistanceOpen] = useState(false);
  const [partnershipOpen, setPartnershipOpen] = useState(false);

  return (
    <section className="intro section-pad" id="programs">
      <div className="section-container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">What we do</p>
            <h2>From AI learning to real-world application.</h2>
          </div>
          <p>
            LLM AXIS helps individuals and organizations develop practical AI
            skills through hands-on learning, expert guidance, community, and
            corporate training.
          </p>
        </div>

        <div className="service-groups">
          {serviceGroups.map((group, groupIndex) => (
            <article
              className={`service-group reveal ${
                groupIndex === 1 ? "business-group" : ""
              }`}
              id={groupIndex === 1 ? "business" : undefined}
              key={group.title}
            >
              <div className="group-intro">
                <p className="eyebrow">{group.eyebrow}</p>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                {groupIndex === 0 ? (
                  <Link href="/learning" className="text-button">
                    Find your program <Icon name="arrow" size={17} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setPartnershipOpen(true)}
                  >
                    Explore a partnership <Icon name="arrow" size={17} />
                  </button>
                )}
              </div>
              <div className="service-cards">
                {group.services.map((service) => {
                  const card = (
                    <>
                      <span className="service-icon">
                        <Icon name={service.icon} />
                      </span>
                      <h4>{service.title}</h4>
                      <p>{service.copy}</p>
                      <span className="card-arrow">
                        <Icon name="arrow" size={18} />
                      </span>
                    </>
                  );

                  if (service.title === "AI Training") {
                    return (
                      <Link href="/learning" className="service-card is-action" key={service.title}>
                        {card}
                      </Link>
                    );
                  }

                  if (service.title === "AI Community") {
                    return (
                      <button
                        type="button"
                        className="service-card is-action"
                        key={service.title}
                        onClick={() => setCommunityOpen(true)}
                      >
                        {card}
                      </button>
                    );
                  }

                  if (service.title === "AI Job Assistance") {
                    return (
                      <button
                        type="button"
                        className="service-card is-action"
                        key={service.title}
                        onClick={() => setJobAssistanceOpen(true)}
                      >
                        {card}
                      </button>
                    );
                  }

                  if (groupIndex !== 1) {
                    return (
                      <div className="service-card" key={service.title}>
                        {card}
                      </div>
                    );
                  }

                  return (
                    <button
                      type="button"
                      className="service-card is-action"
                      key={service.title}
                      onClick={() => setActiveService(service.title)}
                    >
                      {card}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
      <BusinessEnquiryModal
        serviceTitle={activeService}
        onClose={() => setActiveService(null)}
      />
      <CommunityJoinModal open={communityOpen} onClose={() => setCommunityOpen(false)} />
      <JobAssistanceModal open={jobAssistanceOpen} onClose={() => setJobAssistanceOpen(false)} />
      {partnershipOpen ? (
        <PartnershipModal onClose={() => setPartnershipOpen(false)} />
      ) : null}
    </section>
  );
}
