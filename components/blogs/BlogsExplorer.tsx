"use client";

import { useMemo, useState } from "react";
import BlogsCta from "./BlogsCta";
import BlogsFilters from "./BlogsFilters";
import BlogsGrid from "./BlogsGrid";
import BlogsHero from "./BlogsHero";
import BlogsLoadMore from "./BlogsLoadMore";
import { BLOG_GUIDES, type BlogFilter } from "./data";

export default function BlogsExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BlogFilter>("All Topics");

  const guides = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return BLOG_GUIDES.filter((guide) => {
      const matchesTopic = filter === "All Topics" || guide.topics.includes(filter);
      if (!matchesTopic) return false;
      if (!needle) return true;
      const haystack = [guide.title, guide.subtitle, ...guide.topics]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [filter, query]);

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
        <BlogsFilters active={filter} onChange={setFilter} />
        <div className="blogs-results">
          <BlogsGrid guides={guides} />
          {guides.length > 0 ? <BlogsLoadMore /> : null}
        </div>
        <BlogsCta />
      </div>
    </main>
  );
}
