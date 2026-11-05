"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Story = {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
};

type CardSlot = "top" | "middle" | "bottom" | "incoming" | "exit" | "parked";

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

const AUTO_ADVANCE_MS = 3200;
const RESUME_MS = 900;
const FOCUS_LOCK_MS = 950;
const DRAG_STEP_PX = 56;
const DRAG_ARM_PX = 8;

function slotForOffset(offset: number, total: number): CardSlot {
  if (offset === 0) return "middle";
  if (offset === 1) return "bottom";
  if (offset === total - 1) return "top";
  if (offset === total - 2) return "exit";
  if (offset === 2) return "incoming";
  return "parked";
}

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function cardIndexFromTarget(target: EventTarget | null) {
  const element = target instanceof Element ? target.closest<HTMLElement>("[data-story-index]") : null;
  if (!element) return null;
  const value = Number(element.dataset.storyIndex);
  return Number.isFinite(value) ? value : null;
}

function StoryCard({
  story,
  slot,
  index,
  onHoverCard,
}: {
  story: Story;
  slot: CardSlot;
  index: number;
  onHoverCard: (index: number, event: ReactPointerEvent<HTMLElement>) => void;
}) {
  const visible = slot === "middle" || slot === "top" || slot === "bottom";

  return (
    <article
      className={`stories-card is-${slot}`}
      data-story-index={index}
      aria-hidden={!visible}
      aria-current={slot === "middle" ? "true" : undefined}
      onPointerEnter={(event) => {
        if (visible) onHoverCard(index, event);
      }}
    >
      <div className="stories-card-header">
        <span className="stories-avatar" aria-hidden="true">
          {story.initials}
        </span>
        <div className="stories-card-identity">
          <strong>{story.name}</strong>
          <span>{story.role}</span>
        </div>
      </div>
      <p className="stories-quote">{story.quote}</p>
    </article>
  );
}

export default function LearnerStoriesSection() {
  const [active, setActive] = useState(0);
  const [timerEpoch, setTimerEpoch] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const total = STORIES.length;

  const activeRef = useRef(active);
  const resumeTimerRef = useRef<number | null>(null);
  const focusLockTimerRef = useRef<number | null>(null);
  const hoveringRef = useRef(false);
  const holdingRef = useRef(false);
  const focusLockRef = useRef(false);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({
    pointerId: -1,
    startY: 0,
    originActive: 0,
    lastSteps: 0,
    moved: false,
    cardIndex: null as number | null,
  });

  activeRef.current = active;

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const clearFocusLockTimer = useCallback(() => {
    if (focusLockTimerRef.current != null) {
      window.clearTimeout(focusLockTimerRef.current);
      focusLockTimerRef.current = null;
    }
  }, []);

  const pauseFlow = useCallback(() => {
    clearResumeTimer();
    setPaused(true);
  }, [clearResumeTimer]);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      if (
        hoveringRef.current ||
        holdingRef.current ||
        focusLockRef.current ||
        dragRef.current.pointerId !== -1
      ) {
        return;
      }
      setPaused(false);
      setTimerEpoch((epoch) => epoch + 1);
      resumeTimerRef.current = null;
    }, RESUME_MS);
  }, [clearResumeTimer]);

  const goTo = useCallback(
    (index: number) => {
      setActive(wrapIndex(index, total));
      setTimerEpoch((epoch) => epoch + 1);
    },
    [total],
  );

  const lockFocusBriefly = useCallback(() => {
    clearFocusLockTimer();
    focusLockRef.current = true;
    focusLockTimerRef.current = window.setTimeout(() => {
      focusLockRef.current = false;
      focusLockTimerRef.current = null;

      const node = carouselRef.current;
      if (!node) return;

      const underPointer = document.elementFromPoint(
        pointerPosRef.current.x,
        pointerPosRef.current.y,
      );
      if (underPointer instanceof Node && node.contains(underPointer) && cardIndexFromTarget(underPointer) != null) {
        hoveringRef.current = true;
        pauseFlow();
        return;
      }

      hoveringRef.current = false;
      if (!holdingRef.current && dragRef.current.pointerId === -1) {
        scheduleResume();
      }
    }, FOCUS_LOCK_MS);
  }, [clearFocusLockTimer, pauseFlow, scheduleResume]);

  const focusCard = useCallback(
    (index: number) => {
      pauseFlow();
      if (wrapIndex(index, total) !== activeRef.current) {
        goTo(index);
        lockFocusBriefly();
        return;
      }
      goTo(index);
    },
    [goTo, lockFocusBriefly, pauseFlow, total],
  );

  const advance = useCallback(() => {
    setActive((current) => wrapIndex(current + 1, total));
    setTimerEpoch((epoch) => epoch + 1);
  }, [total]);

  useEffect(() => {
    if (paused || dragging) return;
    if (prefersReducedMotion()) return;

    const id = window.setInterval(advance, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [advance, timerEpoch, paused, dragging]);

  useEffect(
    () => () => {
      clearResumeTimer();
      clearFocusLockTimer();
    },
    [clearFocusLockTimer, clearResumeTimer],
  );

  const endDrag = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (drag.pointerId === -1 || event.pointerId !== drag.pointerId) return;

      const cardIndex = drag.cardIndex;
      const wasDrag = drag.moved;

      try {
        carouselRef.current?.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }

      dragRef.current = {
        pointerId: -1,
        startY: 0,
        originActive: 0,
        lastSteps: 0,
        moved: false,
        cardIndex: null,
      };
      holdingRef.current = false;
      setDragging(false);

      if (!wasDrag && cardIndex != null && isFinePointer()) {
        focusCard(cardIndex);
      }

      if (hoveringRef.current && isFinePointer()) {
        pauseFlow();
        return;
      }

      if (!focusLockRef.current) {
        scheduleResume();
      }
    },
    [focusCard, pauseFlow, scheduleResume],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    pointerPosRef.current = { x: event.clientX, y: event.clientY };

    const resolvedIndex = cardIndexFromTarget(event.target);
    const fine = isFinePointer();

    pauseFlow();
    holdingRef.current = true;

    const originActive =
      resolvedIndex != null && !fine ? resolvedIndex : activeRef.current;

    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      originActive,
      lastSteps: 0,
      moved: false,
      cardIndex: resolvedIndex,
    };

    // Mobile / coarse pointer: pressing a card stops on that story.
    if (resolvedIndex != null && !fine) {
      goTo(resolvedIndex);
    }

    carouselRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerPosRef.current = { x: event.clientX, y: event.clientY };

    const drag = dragRef.current;
    if (drag.pointerId === -1 || event.pointerId !== drag.pointerId) return;

    const deltaY = drag.startY - event.clientY;
    if (!drag.moved && Math.abs(deltaY) >= DRAG_ARM_PX) {
      drag.moved = true;
      setDragging(true);
    }
    if (!drag.moved) return;

    // Drag up → next story; drag down → previous story.
    const steps = Math.trunc(deltaY / DRAG_STEP_PX);
    if (steps === drag.lastSteps) return;

    drag.lastSteps = steps;
    goTo(drag.originActive + steps);
  };

  const handleHoverCard = (index: number, event: ReactPointerEvent<HTMLElement>) => {
    if (!isFinePointer()) return;
    if (dragRef.current.pointerId !== -1) return;

    pointerPosRef.current = { x: event.clientX, y: event.clientY };
    hoveringRef.current = true;
    if (focusLockRef.current) {
      pauseFlow();
      return;
    }

    focusCard(index);
  };

  const handleCarouselPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isFinePointer()) return;
    if (dragRef.current.pointerId !== -1) return;
    if (focusLockRef.current) return;

    const next = event.relatedTarget;
    if (next instanceof Node && carouselRef.current?.contains(next)) {
      return;
    }

    hoveringRef.current = false;
    if (!holdingRef.current) {
      scheduleResume();
    }
  };

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
            onClick={() => {
              pauseFlow();
              advance();
              scheduleResume();
            }}
          >
            View More
          </button>
        </div>

        <div
          ref={carouselRef}
          className={[
            "stories-carousel",
            dragging ? "is-dragging" : "",
            paused ? "is-paused" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-live="polite"
          aria-roledescription="carousel"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={handleCarouselPointerLeave}
        >
          {STORIES.map((story, index) => {
            const offset = wrapIndex(index - active, total);
            return (
              <StoryCard
                key={story.id}
                story={story}
                index={index}
                slot={slotForOffset(offset, total)}
                onHoverCard={handleHoverCard}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
