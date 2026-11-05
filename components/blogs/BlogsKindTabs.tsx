"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BLOG_KINDS, type BlogKind } from "./data";

type BlogsKindTabsProps = {
  active: BlogKind;
  onChange: (kind: BlogKind) => void;
  counts: Record<BlogKind, number>;
};

type GliderStyle = {
  left: number;
  width: number;
  height: number;
  top: number;
};

export default function BlogsKindTabs({ active, onChange, counts }: BlogsKindTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<BlogKind, HTMLButtonElement | null>>({
    Roadmaps: null,
    Articles: null,
  });
  const prevActive = useRef(active);
  const [glider, setGlider] = useState<GliderStyle>({ left: 0, width: 0, height: 0, top: 0 });
  const [ready, setReady] = useState(false);
  const [flowing, setFlowing] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const measure = () => {
    const list = listRef.current;
    const btn = btnRefs.current[active];
    if (!list || !btn) return;

    const listBox = list.getBoundingClientRect();
    const btnBox = btn.getBoundingClientRect();
    setGlider({
      left: btnBox.left - listBox.left,
      top: btnBox.top - listBox.top,
      width: btnBox.width,
      height: btnBox.height,
    });
    setReady(true);
  };

  useLayoutEffect(() => {
    const prevIndex = BLOG_KINDS.indexOf(prevActive.current);
    const nextIndex = BLOG_KINDS.indexOf(active);
    if (prevActive.current !== active) {
      setDirection(nextIndex > prevIndex ? "forward" : "back");
      setFlowing(true);
      prevActive.current = active;
    }
    measure();
  }, [active]);

  useEffect(() => {
    if (!flowing) return;
    const timer = window.setTimeout(() => setFlowing(false), 560);
    return () => window.clearTimeout(timer);
  }, [flowing]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const onResize = () => measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    ro?.observe(list);
    window.addEventListener("resize", onResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <div className="blogs-kind-tabs-wrap">
      <div
        ref={listRef}
        className={[
          "blogs-kind-tabs",
          ready ? "is-ready" : "",
          flowing ? "is-flowing" : "",
          `is-${direction}`,
        ]
          .filter(Boolean)
          .join(" ")}
        role="tablist"
        aria-label="Resource type"
        data-active={active}
      >
        <span
          className="blogs-kind-glider"
          aria-hidden="true"
          style={{
            width: glider.width,
            height: glider.height,
            transform: `translate3d(${glider.left}px, ${glider.top}px, 0) scaleX(${flowing ? 1.045 : 1})`,
          }}
        >
          <span className="blogs-kind-glider-sheen" />
        </span>

        {BLOG_KINDS.map((kind) => {
          const selected = kind === active;
          return (
            <button
              key={kind}
              ref={(node) => {
                btnRefs.current[kind] = node;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "is-active" : ""}
              onClick={() => {
                if (kind !== active) onChange(kind);
              }}
            >
              <span className="blogs-kind-label">{kind}</span>
              <em className="blogs-kind-count">{counts[kind]}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
