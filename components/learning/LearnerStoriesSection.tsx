"use client";

import { useEffect, useState } from "react";

type Story = {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
};

const STORIES: Story[] = [
  {
    id: "hemanth",
    name: "Hemanth",
    role: "Data Scientist",
    initials: "H",
    quote:
      "The projects made complex AI concepts much easier to understand and apply. My practical skills and confidence building with modern GenAI and multi-agent workflows grew exponentially.",
  },
  {
    id: "nandhini",
    name: "Nandhini D.",
    role: "AI Engineer",
    initials: "ND",
    quote:
      "I really enjoyed the balance between foundational concepts, hands-on labs, and real-world architectures. It helped me turn what I learned into production projects I could actually showcase to recruiters.",
  },
  {
    id: "hari",
    name: "Hari Krishna",
    role: "Senior Software Engineer",
    initials: "HK",
    quote:
      "Ganesh's practitioner guidance is unmatched. Moving from LangChain basics to complex LangGraph multi-agent supervisors gave our enterprise engineering squad exactly the edge we needed.",
  },
  {
    id: "charitha",
    name: "Charitha M",
    role: "ML Engineer",
    initials: "C",
    quote:
      "Weekly labs forced me to ship, not just watch. By week eight I had a RAG pipeline and an agent workflow I could demo confidently in interviews.",
  },
  {
    id: "nithin",
    name: "Nithin J V",
    role: "Product Engineer",
    initials: "N",
    quote:
      "The curriculum stayed practical end to end. I finally understood how to move from prompts to reliable agentic systems that hold up in real product work.",
  },
];

function storyAt(offset: number, active: number) {
  const total = STORIES.length;
  return STORIES[(active + offset + total) % total];
}

function StoryCard({
  story,
  slot,
}: {
  story: Story;
  slot: "top" | "middle" | "bottom";
}) {
  return (
    <article
      className={`stories-card is-${slot}`}
      aria-current={slot === "middle" ? "true" : undefined}
    >
      <div className="stories-card-top">
        <span className="stories-avatar" aria-hidden="true">
          {story.initials}
        </span>
        <time className="stories-time">{story.time}</time>
      </div>
      <div className="stories-card-identity">
        <strong>{story.name}</strong>
        <span>{story.role}</span>
      </div>
      <p className="stories-quote">“{story.quote}”</p>
    </article>
  );
}

export default function LearnerStoriesSection() {
  const [active, setActive] = useState(1);
  const total = STORIES.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, 4200);
    return () => window.clearInterval(id);
  }, [total]);

  const top = storyAt(-1, active);
  const middle = storyAt(0, active);
  const bottom = storyAt(1, active);

  return (
    <section className="program-stories section-pad" aria-labelledby="learner-stories-title">
      <div className="section-container stories-layout reveal">
        <div className="stories-copy">
          <h2 id="learner-stories-title">What Our Learners Say</h2>
          <p>
            Discover how engineers, founders, and data scientists transformed their practical
            skills with LLM Axis through hands-on agentic workflows and production projects.
          </p>
          <button
            type="button"
            className="stories-view-more"
            onClick={() => setActive((current) => (current + 1) % total)}
          >
            View More
          </button>
        </div>

        <div className="stories-carousel" aria-live="polite">
          <StoryCard key={`top-${top.id}`} story={top} slot="top" />
          <StoryCard key={`middle-${middle.id}`} story={middle} slot="middle" />
          <StoryCard key={`bottom-${bottom.id}`} story={bottom} slot="bottom" />
        </div>
      </div>
    </section>
  );
}
