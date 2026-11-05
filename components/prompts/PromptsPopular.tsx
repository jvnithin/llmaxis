"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  EXPLORE_PROMPT_COUNT,
  listAllPrompts,
  type ExplorePrompt,
} from "./explore/explore-data";

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h8a.5.5 0 0 1 .5.5v10.2l-4.25-2.4L4 13.2V3a.5.5 0 0 1 .5-.5Z"
        stroke="#94A3B8"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M11 4.5 6.5 9 11 13.5" : "M7 4.5 11.5 9 7 13.5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ALL_PROMPTS = listAllPrompts();
const SET_GAP_PX = 20;
const AUTO_SPEED_PX_PER_SEC = 32;
const RESUME_DELAY_MS = 700;
const DRAG_CLICK_THRESHOLD_PX = 6;

type MotionApi = {
  shiftBy: (deltaPx: number) => void;
  pauseAuto: (ms?: number) => void;
  measureLoopWidth: () => void;
};

export default function PromptsPopular() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const resumeAtRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const rafRef = useRef(0);
  const apiRef = useRef<MotionApi | null>(null);
  const axisLockRef = useRef<"pending" | "horizontal" | "none">("none");
  const originXRef = useRef(0);
  const originYRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const set = setRef.current;
    if (!viewport || !track || !set) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const applyTransform = () => {
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    };

    const normalizeOffset = () => {
      const loopWidth = loopWidthRef.current;
      if (loopWidth <= 0) return;
      offsetRef.current =
        ((offsetRef.current % loopWidth) + loopWidth) % loopWidth;
      offsetRef.current -= loopWidth;
    };

    const measureLoopWidth = () => {
      loopWidthRef.current = set.offsetWidth + SET_GAP_PX;
    };

    const shiftBy = (deltaPx: number) => {
      offsetRef.current += deltaPx;
      normalizeOffset();
      applyTransform();
    };

    const pauseAuto = (ms = RESUME_DELAY_MS) => {
      resumeAtRef.current = performance.now() + ms;
    };

    apiRef.current = { shiftBy, pauseAuto, measureLoopWidth };

    measureLoopWidth();
    if (loopWidthRef.current > 0) {
      offsetRef.current = -loopWidthRef.current * 0.2;
      normalizeOffset();
    }
    applyTransform();

    let lastFrame = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.048, (now - lastFrame) / 1000);
      lastFrame = now;

      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > 3) {
          shiftBy(velocityRef.current * dt);
          velocityRef.current *= Math.pow(0.9, dt * 60);
          if (Math.abs(velocityRef.current) < 3) velocityRef.current = 0;
        } else if (!reducedMotionRef.current && now >= resumeAtRef.current) {
          shiftBy(-AUTO_SPEED_PX_PER_SEC * dt);
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const onResize = () => {
      measureLoopWidth();
      normalizeOffset();
      applyTransform();
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(set);

    const onWheel = (event: WheelEvent) => {
      // Only steal horizontal gestures — let vertical wheel scroll the page.
      const horizontalIntent =
        event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontalIntent) return;

      event.preventDefault();
      velocityRef.current = 0;
      shiftBy(-(event.shiftKey ? event.deltaY || event.deltaX : event.deltaX));
      pauseAuto();
    };

    const onSurprise = () => {
      const cards = Array.from(
        set.querySelectorAll<HTMLElement>(".prompts-popular-card"),
      );
      if (cards.length === 0) return;

      const pick = cards[Math.floor(Math.random() * cards.length)];
      const viewportRect = viewport.getBoundingClientRect();
      const cardRect = pick.getBoundingClientRect();
      const delta =
        viewportRect.left +
        viewportRect.width / 2 -
        (cardRect.left + cardRect.width / 2);

      shiftBy(delta);
      pauseAuto(1800);
      pick.classList.add("is-spotlight");
      window.setTimeout(() => pick.classList.remove("is-spotlight"), 1600);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("prompts-popular-surprise", onSurprise);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("prompts-popular-surprise", onSurprise);
      window.removeEventListener("resize", onResize);
      apiRef.current = null;
    };
  }, []);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button")) return;

    pointerIdRef.current = event.pointerId;
    axisLockRef.current = "pending";
    originXRef.current = event.clientX;
    originYRef.current = event.clientY;
    lastXRef.current = event.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    lastMoveTimeRef.current = performance.now();
    draggingRef.current = false;
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    if (axisLockRef.current === "pending") {
      const totalX = event.clientX - originXRef.current;
      const totalY = event.clientY - originYRef.current;
      const absX = Math.abs(totalX);
      const absY = Math.abs(totalY);

      if (absX < 6 && absY < 6) return;

      if (absY > absX) {
        // Vertical intent — release control so the page can scroll.
        axisLockRef.current = "none";
        pointerIdRef.current = null;
        draggingRef.current = false;
        setIsDragging(false);
        return;
      }

      axisLockRef.current = "horizontal";
      draggingRef.current = true;
      setIsDragging(true);
      apiRef.current?.pauseAuto(60_000);
      lastXRef.current = event.clientX;
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        // Ignore unsupported pointer capture.
      }
    }

    if (axisLockRef.current !== "horizontal" || !draggingRef.current) return;

    event.preventDefault();

    const now = performance.now();
    const dx = event.clientX - lastXRef.current;
    const dt = Math.max(0.008, (now - lastMoveTimeRef.current) / 1000);

    apiRef.current?.shiftBy(dx);
    dragDistanceRef.current += Math.abs(dx);
    velocityRef.current = dx / dt;
    lastXRef.current = event.clientX;
    lastMoveTimeRef.current = now;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;

    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    pointerIdRef.current = null;
    axisLockRef.current = "none";
    setIsDragging(false);
    if (wasDragging) apiRef.current?.pauseAuto();

    const viewport = viewportRef.current;
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }

  function nudge(direction: -1 | 1) {
    const card = setRef.current?.querySelector<HTMLElement>(".prompts-popular-card");
    const distance = (card?.offsetWidth ?? 300) + SET_GAP_PX;
    velocityRef.current = 0;
    apiRef.current?.shiftBy(direction * distance * -1);
    apiRef.current?.pauseAuto(1200);
  }

  function onClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (dragDistanceRef.current > DRAG_CLICK_THRESHOLD_PX) {
      event.preventDefault();
      event.stopPropagation();
      dragDistanceRef.current = 0;
    }
  }

  return (
    <section className="prompts-section" id="popular-prompts">
      <div className="prompts-shell">
        <div className="prompts-section-header prompts-section-header-split">
          <div>
            <p className="prompts-kicker prompts-kicker-warm">A GOOD PLACE TO START</p>
            <h2>Popular starting points</h2>
            <p className="prompts-popular-count">{EXPLORE_PROMPT_COUNT} ready-to-use prompts</p>
          </div>

          <div className="prompts-popular-nav" aria-label="Scroll prompts">
            <button
              type="button"
              className="prompts-popular-nav-btn"
              aria-label="Scroll prompts left"
              onClick={() => nudge(-1)}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              className="prompts-popular-nav-btn"
              aria-label="Scroll prompts right"
              onClick={() => nudge(1)}
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`prompts-popular-scroller${isDragging ? " is-dragging" : ""}`}
        ref={viewportRef}
        tabIndex={0}
        aria-label="All prompt cards"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div className="prompts-popular-track" ref={trackRef}>
          <div className="prompts-popular-set" ref={setRef}>
            {ALL_PROMPTS.map((prompt) => (
              <PopularCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
          <div className="prompts-popular-set" aria-hidden="true">
            {ALL_PROMPTS.map((prompt) => (
              <PopularCard key={`loop-${prompt.id}`} prompt={prompt} inertCopy />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PopularCard({
  prompt,
  inertCopy,
}: {
  prompt: ExplorePrompt;
  inertCopy?: boolean;
}) {
  return (
    <article className="prompts-popular-card">
      <div className="prompts-popular-top">
        <span className="prompts-popular-tag">{prompt.subcategoryTitle}</span>
        <BookmarkIcon />
      </div>
      <h3>{prompt.title}</h3>
      <p>{prompt.description}</p>
      <div className="prompts-popular-footer">
        <span>
          {prompt.level} · {prompt.time}
        </span>
        {inertCopy ? (
          <span className="prompts-popular-footer-link">View prompt →</span>
        ) : (
          <Link href={`/prompts/${prompt.slug}`} draggable={false}>
            View prompt →
          </Link>
        )}
      </div>
    </article>
  );
}
