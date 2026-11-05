import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreLibrary } from "@/components/prompts/explore";
import { EXPLORE_PROMPT_COUNT } from "@/components/prompts/explore/explore-data";
import "@/components/prompts/explore/explore.css";

export const metadata: Metadata = {
  title: "Explore All AI Prompts | Prompt Collection",
  description: `Browse ${EXPLORE_PROMPT_COUNT} free AI prompts across 50 subcategories for USA IT professionals, non-IT professionals, jobseekers, and master's students.`,
  alternates: {
    canonical: "https://llmaxis.in/prompts/explore",
  },
};

export default function PromptsExplorePage() {
  return (
    <Suspense fallback={<main className="explore-page" aria-busy="true" />}>
      <ExploreLibrary />
    </Suspense>
  );
}
