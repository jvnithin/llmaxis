import type { Metadata } from "next";
import BlogsExplorer from "@/components/blogs/BlogsExplorer";
import "@/components/blogs/blogs.css";

export const metadata: Metadata = {
  title: "Guides, Roadmaps & Free Courses",
  description:
    "Curated AI prompts, courses, roadmaps, and tutorials from LLM Axis practitioners and software architects.",
  alternates: {
    canonical: "https://llmaxis.in/blogs",
  },
};

export default function BlogsPage() {
  return <BlogsExplorer />;
}
