"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExploreHero from "./ExploreHero";
import ExplorePromptCard from "./ExplorePromptCard";
import ExploreSurpriseCta from "./ExploreSurpriseCta";
import {
  AUDIENCE_TABS,
  DEFAULT_AUDIENCE,
  LEVEL_OPTIONS,
  SORT_OPTIONS,
  countByAudience,
  filterExplorePrompts,
  getSubcategories,
  isAudienceId,
  resolveSubcategoryQuery,
  type PromptAudienceId,
} from "./explore-data";

type Level = (typeof LEVEL_OPTIONS)[number];
type Sort = (typeof SORT_OPTIONS)[number];

export default function ExploreLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const surpriseIndexRef = useRef(0);
  const didResolveQueryRef = useRef(false);

  const audienceParam = searchParams.get("audience");
  const subcategoryParam = searchParams.get("subcategory");
  const queryParam = searchParams.get("q") ?? "";

  const resolvedFromQuery = queryParam ? resolveSubcategoryQuery(queryParam) : null;

  const audience: PromptAudienceId = resolvedFromQuery
    ? resolvedFromQuery.audienceId
    : isAudienceId(audienceParam)
      ? audienceParam
      : DEFAULT_AUDIENCE;

  const subcategories = getSubcategories(audience);
  const subcategoryId = resolvedFromQuery
    ? resolvedFromQuery.subcategoryId
    : subcategoryParam && subcategories.some((item) => item.id === subcategoryParam)
      ? subcategoryParam
      : "all";

  // When q matches a subcategory, stop using it as free-text filter.
  const [query, setQuery] = useState(resolvedFromQuery ? "" : queryParam);
  const [level, setLevel] = useState<Level>("All levels");
  const [sort, setSort] = useState<Sort>("Recommended");

  useEffect(() => {
    if (!resolvedFromQuery || didResolveQueryRef.current) return;
    didResolveQueryRef.current = true;

    const params = new URLSearchParams();
    params.set("audience", resolvedFromQuery.audienceId);
    params.set("subcategory", resolvedFromQuery.subcategoryId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setQuery("");
  }, [resolvedFromQuery, pathname, router]);

  const prompts = filterExplorePrompts({
    audience,
    subcategoryId,
    query,
    level,
    sort,
  });

  function replaceParams(next: {
    audience?: PromptAudienceId;
    subcategory?: string;
    clearQuery?: boolean;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextAudience = next.audience ?? audience;
    params.set("audience", nextAudience);
    params.delete("q");

    if (next.subcategory === undefined) {
      if (next.audience) params.delete("subcategory");
    } else if (next.subcategory === "all") {
      params.delete("subcategory");
    } else {
      params.set("subcategory", next.subcategory);
    }

    if (next.clearQuery) setQuery("");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function applySearch(raw: string) {
    const trimmed = raw.trim();
    const resolved = trimmed ? resolveSubcategoryQuery(trimmed) : null;

    if (resolved) {
      setQuery("");
      replaceParams({
        audience: resolved.audienceId,
        subcategory: resolved.subcategoryId,
        clearQuery: true,
      });
      return;
    }

    setQuery(trimmed);
    const params = new URLSearchParams(searchParams.toString());
    params.set("audience", audience);
    if (subcategoryId === "all") params.delete("subcategory");
    else params.set("subcategory", subcategoryId);
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    applySearch(query);
  }

  function resetFilters() {
    setQuery("");
    setLevel("All levels");
    setSort("Recommended");
    replaceParams({ audience: DEFAULT_AUDIENCE, subcategory: "all", clearQuery: true });
  }

  function handleSurprise() {
    if (prompts.length === 0) return;
    surpriseIndexRef.current = (surpriseIndexRef.current + 1) % prompts.length;
    const pick = prompts[surpriseIndexRef.current];
    const el = document.getElementById(pick.id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("is-spotlight");
    window.setTimeout(() => el.classList.remove("is-spotlight"), 1800);
  }

  return (
    <main className="explore-page">
      <ExploreHero />

      <section className="explore-body">
        <div className="explore-shell">
          <div className="explore-filters">
            <form className="explore-filters-row" onSubmit={handleSearchSubmit}>
              <label className="explore-search">
                <span className="explore-search-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M20 20l-3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by role, task, skill or keyword..."
                  aria-label="Search prompts"
                />
              </label>

              <label className="explore-select">
                <span className="sr-only">Filter by level</span>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value as Level)}
                >
                  {LEVEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="explore-select">
                <span className="sr-only">Sort prompts</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </form>

            <div className="explore-audience-tabs" role="tablist" aria-label="Audience filters">
              {AUDIENCE_TABS.map((tab) => {
                const count = countByAudience(tab.id);
                const active = audience === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`explore-audience-tab${active ? " is-active" : ""}`}
                    onClick={() =>
                      replaceParams({ audience: tab.id, subcategory: "all", clearQuery: true })
                    }
                  >
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="explore-results-toolbar">
            <div className="explore-results-header">
              <p>
                Showing <strong>{prompts.length} prompts</strong>
              </p>
            </div>

            <label className="explore-select explore-subcategory-select">
              <span className="sr-only">Filter by subcategory</span>
              <select
                value={subcategoryId}
                onChange={(event) =>
                  replaceParams({ subcategory: event.target.value, clearQuery: true })
                }
              >
                <option value="all">All subcategories ({subcategories.length})</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.title} ({subcategory.promptCount})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {prompts.length > 0 ? (
            <div className="explore-grid">
              {prompts.map((prompt) => (
                <ExplorePromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="explore-empty">
              <h2>No prompts match your filters</h2>
              <p>Try a different keyword, subcategory, or level.</p>
              <button type="button" className="explore-empty-reset" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      <ExploreSurpriseCta onSurprise={handleSurprise} />
    </main>
  );
}
