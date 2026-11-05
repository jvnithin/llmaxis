"use client";

import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  searchSubcategories,
  type SubcategoryOption,
} from "./explore/explore-data";

type PromptsHeroProps = {
  onSearch?: (query: string) => void;
};

function buildExploreHref(item: Pick<SubcategoryOption, "audienceId" | "subcategoryId">) {
  const params = new URLSearchParams();
  params.set("audience", item.audienceId);
  params.set("subcategory", item.subcategoryId);
  return `/prompts/explore?${params.toString()}`;
}

export default function PromptsHero({ onSearch }: PromptsHeroProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const matches = useMemo(() => searchSubcategories(query), [query]);
  const safeActiveIndex =
    matches.length === 0 ? 0 : Math.min(activeIndex, matches.length - 1);
  const activeOption = matches[safeActiveIndex] ?? null;

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function goToSubcategory(option: SubcategoryOption | null) {
    if (!option) return;
    onSearch?.(option.title);
    window.location.assign(buildExploreHref(option));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();

    // Empty field: open the full subcategory list instead of guessing.
    if (!trimmed) {
      setOpen(true);
      inputRef.current?.focus();
      return;
    }

    if (activeOption) {
      goToSubcategory(activeOption);
      return;
    }

    if (matches[0]) {
      goToSubcategory(matches[0]);
      return;
    }

    setOpen(true);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        matches.length === 0 ? 0 : Math.min(current + 1, matches.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Enter" && open && activeOption) {
      event.preventDefault();
      goToSubcategory(activeOption);
    }
  }

  function handleOptionClick(
    event: MouseEvent<HTMLButtonElement>,
    option: SubcategoryOption,
  ) {
    event.preventDefault();
    goToSubcategory(option);
  }

  async function handleQuickCopy() {
    try {
      await navigator.clipboard.writeText(
        "You are an elite Talent Acquisition Specialist with 15+ years experience evaluating candidates for {target_company} in the {industry_domain} sector.\n\nReview my current resume against this target role description: {target_job_title}.\n\nConstraints & Rules:\n- Highlight hard metric omissions using STAR syntax\n- Score ATS keyword convergence (Target: > 92%)\n- Output 3 tailored impact bullet variations",
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="prompts-hero">
      <div className="prompts-shell prompts-hero-grid">
        <div className="prompts-hero-copy">
          <p className="prompts-eyebrow-pill">
            <span className="prompts-eyebrow-dot" aria-hidden="true" />
            ✦ THE LLM AXIS FREE PROMPT LIBRARY
          </p>

          <h1 className="prompts-hero-title">
            Make AI work
            <span> for what matters.</span>
          </h1>

          <p className="prompts-hero-subtitle">
            Practical, ready-to-use AI prompts for your career, studies, work and
            ideas. Find the right starting point, personalize it and get moving.
          </p>

          <form className="prompts-search" onSubmit={handleSubmit}>
            <div
              className={`prompts-search-box${open ? " is-open" : ""}`}
              ref={rootRef}
            >
              <span className="prompts-search-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle
                    cx="9"
                    cy="9"
                    r="6.25"
                    stroke="#7444BD"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M13.75 13.75 17 17"
                    stroke="#7444BD"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <div className="prompts-search-field">
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search subcategories..."
                  aria-label="Search subcategories"
                  aria-expanded={open}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    open && activeOption
                      ? `${listboxId}-option-${safeActiveIndex}`
                      : undefined
                  }
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="prompts-search-btn">
                Find a prompt
                <span aria-hidden="true">→</span>
              </button>

              {open ? (
                <div
                  id={listboxId}
                  className="prompts-subcategory-menu"
                  role="listbox"
                  aria-label="Subcategories"
                >
                  {matches.length === 0 ? (
                    <p className="prompts-subcategory-empty">
                      No subcategories match “{query.trim()}”.
                    </p>
                  ) : (
                    <ul className="prompts-subcategory-list">
                      {matches.map((option, index) => {
                        const isActive = index === safeActiveIndex;
                        return (
                          <li key={`${option.audienceId}-${option.subcategoryId}`}>
                            <button
                              type="button"
                              id={`${listboxId}-option-${index}`}
                              role="option"
                              aria-selected={isActive}
                              className={`prompts-subcategory-option${
                                isActive ? " is-active" : ""
                              }`}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={(event) => handleOptionClick(event, option)}
                            >
                              <span className="prompts-subcategory-option-title">
                                {option.title}
                              </span>
                              <span className="prompts-subcategory-option-meta">
                                {option.audienceLabel} · {option.promptCount} prompts
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          </form>
        </div>

        <aside className="prompts-preview-card" aria-label="Sample prompt preview">
          <div className="prompts-preview-bar">
            <div className="prompts-preview-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="prompts-preview-filename">master_prompt_template.ai</p>
            <span className="prompts-preview-model">CLAUDE 3.7 & GPT-4O</span>
          </div>

          <div className="prompts-preview-body">
            <p className="prompts-code-comment">{"// Executive ATS Optimization Persona"}</p>
            <p>
              You are an elite Talent Acquisition Specialist with 15+ years experience
              evaluating candidates for <code>{`{target_company}`}</code> in the{" "}
              <code>{`{industry_domain}`}</code> sector.
            </p>
            <p>
              Review my current resume against this target role description:{" "}
              <code>{`{target_job_title}`}</code>.
            </p>
            <p className="prompts-code-label">Constraints & Rules:</p>
            <ul>
              <li>Highlight hard metric omissions using STAR syntax</li>
              <li>Score ATS keyword convergence (Target: &gt; 92%)</li>
              <li>Output 3 tailored impact bullet variations</li>
            </ul>
          </div>

          <div className="prompts-preview-footer">
            <p className="prompts-preview-status">
              <span aria-hidden="true" />
              Status: Ready to deploy
            </p>
            <button type="button" className="prompts-copy-btn" onClick={handleQuickCopy}>
              <Image src="/images/prompts/d834a.svg" alt="" width={14} height={14} />
              {copied ? "Copied" : "Quick Copy"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
