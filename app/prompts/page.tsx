import type { Metadata } from "next";
import {
  PromptsCategories,
  PromptsCta,
  PromptsHero,
  PromptsOutcomes,
  PromptsPopular,
  PromptsSteps,
} from "@/components/prompts";
import "@/components/prompts/prompts.css";

export const metadata: Metadata = {
  title: "Free AI Prompt Library | Chat Prompts",
  description:
    "Practical, ready-to-use AI prompts for career, studies, work and ideas. Browse 120+ free prompts for ChatGPT, Claude, Gemini and more.",
  alternates: {
    canonical: "https://llmaxis.in/prompts",
  },
};

export default function PromptsPage() {
  return (
    <main className="prompts-page">
      <PromptsHero />
      <PromptsCategories />
      <PromptsPopular />
      <PromptsOutcomes />
      <PromptsSteps />
      <PromptsCta />
    </main>
  );
}
