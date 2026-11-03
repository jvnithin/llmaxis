"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BlogsCta from "./BlogsCta";
import BlogsFilters from "./BlogsFilters";
import BlogsGrid from "./BlogsGrid";
import BlogsHero from "./BlogsHero";
import BlogsKindTabs from "./BlogsKindTabs";
import BlogsLoadMore from "./BlogsLoadMore";
import { BLOG_FILTERS, type BlogGuide, type BlogKind } from "./data";

const INITIAL_VISIBLE = 6;
const ALL_ARTICLES = "All Articles";

function kindFromTab(tab: string | null): BlogKind {
  return tab?.toLowerCase() === "articles" ? "Articles" : "Roadmaps";
}

export default function BlogsExplorer({
  guides: allGuides,
  articleCategories,
}: {
  guides: BlogGuide[];
  articleCategories: string[];
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const initialKind = kindFromTab(tab);
  const [kind, setKind] = useState<BlogKind>(initialKind);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>(
    initialKind === "Articles" ? ALL_ARTICLES : "All Topics",
  );
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    setKind(kindFromTab(tab));
  }, [tab]);

  const counts = useMemo(
    () => ({
      Roadmaps: allGuides.filter((guide) => guide.kind === "roadmap").length,
      Articles: allGuides.filter((guide) => guide.kind === "article").length,
    }),
    [allGuides],
  );

  const topicFilters = useMemo(() => {
    if (kind === "Roadmaps") return BLOG_FILTERS;
    return [ALL_ARTICLES, ...articleCategories];
  }, [articleCategories, kind]);

  useEffect(() => {
    setFilter(kind === "Roadmaps" ? "All Topics" : ALL_ARTICLES);
    setVisibleCount(INITIAL_VISIBLE);
  }, [kind]);

  const guides = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const expectedKind = kind === "Roadmaps" ? "roadmap" : "article";

    return allGuides.filter((guide) => {
      if (guide.kind !== expectedKind) return false;

      if (kind === "Roadmaps") {
        const matchesTopic = filter === "All Topics" || guide.topics.includes(filter as (typeof BLOG_FILTERS)[number]);
        if (!matchesTopic) return false;
      } else {
        const matchesCategory = filter === ALL_ARTICLES || guide.category === filter;
        if (!matchesCategory) return false;
      }

      if (!needle) return true;
      const haystack = [guide.title, guide.subtitle, guide.category ?? "", ...guide.topics]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [allGuides, filter, kind, query]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [filter, query, kind]);

  const visibleGuides = guides.slice(0, visibleCount);
  const hasMore = guides.length > visibleCount;

  return (
    <main className="blogs-page">
      <div className="blogs-glow" aria-hidden="true" />
      <div className="blogs-glow blogs-glow-side" aria-hidden="true" />
      <div className="blogs-shell">
        <BlogsHero
          query={query}
          onQueryChange={setQuery}
          onExplore={() => {
            document.getElementById("guides")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
        <BlogsKindTabs active={kind} onChange={setKind} counts={counts} />
        <BlogsFilters
          filters={topicFilters}
          active={filter}
          onChange={setFilter}
          label={kind === "Roadmaps" ? "Roadmap topics" : "Article categories"}
        />
        <div className="blogs-results">
          <BlogsGrid guides={visibleGuides} emptyLabel={kind === "Roadmaps" ? "roadmaps" : "articles"} />
          {hasMore ? (
            <BlogsLoadMore onClick={() => setVisibleCount(guides.length)} />
          ) : null}
        </div>
        <BlogsCta />
      </div>
    </main>
  );
}
