import type { Metadata } from "next";
import { Suspense } from "react";
import BlogsExplorer from "@/components/blogs/BlogsExplorer";
import "@/components/blogs/blogs.css";
import { getArticleCategories, getBlogGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides, Roadmaps & Free Courses",
  description:
    "Curated AI prompts, courses, roadmaps, and tutorials from LLM Axis practitioners and software architects.",
  alternates: {
    canonical: "https://llmaxis.in/blogs",
  },
};

export default function BlogsPage() {
  return (
    <Suspense fallback={null}>
      <BlogsExplorer guides={getBlogGuides()} articleCategories={getArticleCategories()} />
    </Suspense>
  );
}
