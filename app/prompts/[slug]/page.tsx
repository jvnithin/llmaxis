import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PromptDetailView from "@/components/prompts/detail/PromptDetailView";
import {
  getPromptDetail,
  promptDetailSlugs,
} from "@/components/prompts/detail/detail-data";
import "@/components/prompts/prompts.css";

export function generateStaticParams() {
  return promptDetailSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptDetail(slug);
  if (!prompt) return {};

  return {
    title: `${prompt.title} | AI Prompt`,
    description: prompt.summary,
    alternates: {
      canonical: `https://llmaxis.in/prompts/${slug}`,
    },
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = getPromptDetail(slug);
  if (!prompt) notFound();

  return <PromptDetailView prompt={prompt} />;
}
