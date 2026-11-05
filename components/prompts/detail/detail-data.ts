import { POPULAR_PROMPTS, type PopularPrompt } from "../data";
import detailedLibrary from "./detailed-library.json";

export type PromptTag = {
  label: string;
  tone?: "mint" | "sky" | "lilac" | "sand";
};

export type PromptDetail = {
  id: string;
  slug?: string;
  category: string;
  title: string;
  description: string;
  level: string;
  time: string;
  badge: string;
  summary: string;
  tags: PromptTag[];
  helps: string[];
  audience: string;
  prepareTitle: string;
  prepareBody: string;
  promptText: string;
  promptFilename: string;
  exampleContext: string;
  strongerResults: string[];
  proTips: string[];
  privacyNote: string;
  bestFor: string;
  platforms: string;
  resourceLabel: string;
  resourceHref: string;
  audienceId?: string;
  audienceLabel?: string;
  subcategoryId?: string;
  libraryId?: string;
  number?: number;
};

type DetailedRecord = PromptDetail & {
  slug: string;
  audienceId: string;
  subcategoryId: string;
};

const DETAILED = detailedLibrary as Record<string, DetailedRecord>;

const POPULAR_DETAILS: Record<string, Omit<PromptDetail, keyof PopularPrompt | "id" | "category" | "title" | "description" | "level" | "time">> = {
  "ats-resume": {
    badge: "Solve it with prompts",
    summary:
      "Use this template to rewrite a resume for a specific role with stronger keywords, clearer impact bullets, and ATS-ready structure.",
    tags: [
      { label: "Beginner", tone: "mint" },
      { label: "Career Tips", tone: "sky" },
      { label: "ChatGPT, Claude, Gemini", tone: "lilac" },
      { label: "Prompts", tone: "sand" },
    ],
    helps: [
      "Clarify the target role, company context, and must-have skills before rewriting.",
      "Surface missing metrics, weak verbs, and ATS keyword gaps in your current resume.",
      "Produce role-aligned impact bullets that stay truthful to your real experience.",
      "Organize sections so recruiters and ATS parsers can scan the document quickly.",
    ],
    audience:
      "Job seekers, career switchers, and professionals who want a cleaner, keyword-aware resume for a specific job posting.",
    prepareTitle: "What to prepare before using it",
    prepareBody:
      "Have your current resume, the target job description, and 3–5 measurable achievements ready. The more concrete your context, the stronger the rewrite.",
    promptFilename: "ats_resume_rewrite.ai",
    promptText: `ROLE
Act as an elite Talent Acquisition Specialist with 15+ years evaluating candidates for [TARGET COMPANY] in the [INDUSTRY] sector.

TASK
Rewrite my resume for [TARGET JOB TITLE] so it is ATS-friendly, keyword-aligned, and impact-focused.

MY CONTEXT
Current resume:
[RESUME TEXT]

Target job description:
[JOB DESCRIPTION]

Must preserve:
[ACHIEVEMENTS OR CONSTRAINTS]

OUTPUT
1. ATS keyword coverage score with gaps
2. Rewritten professional summary
3. 8–12 impact bullets using metrics where available
4. Suggested section order
5. Final clean resume draft`,
    exampleContext:
      "Target role: Generative AI Engineer at a product company. Current resume emphasizes backend Java work. Need stronger LLM, RAG, and evaluation keywords without inventing experience.",
    strongerResults: [
      "Paste the full job description, not just the title.",
      "Include real metrics (latency, users, revenue, accuracy) wherever possible.",
      "Call out tools you actually used: LangChain, vector DBs, evaluation harnesses, cloud services.",
      "Ask the model to flag any invented claims so you can remove them.",
      "Iterate once more with recruiter feedback or a rejected-application note.",
    ],
    proTips: [
      "Keep one master resume and generate role-specific variants from it.",
      "Prefer evidence over adjectives—numbers beat vague claims.",
      "Re-run the prompt after every major project so the resume stays current.",
    ],
    privacyNote:
      "Review the output before sharing. Avoid pasting confidential employer documents, secrets, or personal identifiers you do not want stored in a model chat history.",
    bestFor: "Job seekers & career switchers",
    platforms: "ChatGPT, Claude, Gemini and other text-based models",
    resourceLabel: "Browse career guides",
    resourceHref: "/blogs",
  },
};

function popularToDetail(prompt: PopularPrompt): PromptDetail {
  const extra = POPULAR_DETAILS[prompt.id];
  if (extra) {
    return {
      id: prompt.id,
      slug: prompt.id,
      category: prompt.category,
      title: prompt.title,
      description: prompt.description,
      level: prompt.level,
      time: prompt.time,
      ...extra,
    };
  }

  return {
    id: prompt.id,
    slug: prompt.id,
    category: prompt.category,
    title: prompt.title,
    description: prompt.description,
    level: prompt.level,
    time: prompt.time,
    badge: "Solve it with prompts",
    summary: prompt.description,
    tags: [
      { label: prompt.level, tone: "mint" },
      { label: prompt.category, tone: "sky" },
      { label: "ChatGPT, Claude, Gemini", tone: "lilac" },
      { label: "Prompts", tone: "sand" },
    ],
    helps: [prompt.description],
    audience: `People working on ${prompt.category.toLowerCase()} tasks.`,
    prepareTitle: "What to prepare before using it",
    prepareBody: "Gather your goals, constraints, and any source material before you start.",
    promptFilename: `${prompt.id}.ai`,
    promptText: `ROLE
Act as an expert advisor for ${prompt.category}.

TASK
${prompt.title}

CONTEXT
[ADD YOUR BACKGROUND, GOALS, AND CONSTRAINTS]

OUTPUT
Provide a clear, practical result I can adapt immediately.`,
    exampleContext: prompt.description,
    strongerResults: [
      "Share concrete source material instead of a vague request.",
      "State your constraints, tools, and desired outcome.",
      "Ask for alternatives and trade-offs when decisions matter.",
      "Request a checklist you can validate before using the result.",
      "Have a qualified human review consequential recommendations.",
    ],
    proTips: [
      "Treat the output as a draft and adapt it to your context.",
      "Keep a reusable bank of strong examples.",
      "Re-run the prompt after you gather better source material.",
    ],
    privacyNote:
      "Review important facts before sharing. Avoid pasting secrets or confidential documents into the chat.",
    bestFor: prompt.category,
    platforms: "ChatGPT, Claude, Gemini and other text-based models",
    resourceLabel: "Explore more prompts",
    resourceHref: "/prompts/explore",
  };
}

const LEGACY_POPULAR: Record<string, PromptDetail> = Object.fromEntries(
  POPULAR_PROMPTS.map((prompt) => [prompt.id, popularToDetail(prompt)]),
);

export function getPromptDetail(slug: string): PromptDetail | null {
  if (DETAILED[slug]) return DETAILED[slug];
  if (LEGACY_POPULAR[slug]) return LEGACY_POPULAR[slug];
  return null;
}

export function promptDetailSlugs() {
  const slugs = new Set<string>([...Object.keys(DETAILED), ...Object.keys(LEGACY_POPULAR)]);
  return Array.from(slugs);
}

export function getRelatedPrompts(slug: string, limit = 3): PopularPrompt[] {
  const current = getPromptDetail(slug);
  if (!current) return POPULAR_PROMPTS.slice(0, limit);

  if (current.audienceId && current.subcategoryId) {
    const related = Object.values(DETAILED)
      .filter(
        (prompt) =>
          prompt.slug !== slug &&
          prompt.audienceId === current.audienceId &&
          (prompt.subcategoryId === current.subcategoryId ||
            prompt.audienceId === current.audienceId),
      )
      .sort((a, b) => {
        if (a.subcategoryId === current.subcategoryId && b.subcategoryId !== current.subcategoryId) {
          return -1;
        }
        if (b.subcategoryId === current.subcategoryId && a.subcategoryId !== current.subcategoryId) {
          return 1;
        }
        return (a.number ?? 0) - (b.number ?? 0);
      })
      .slice(0, limit)
      .map((prompt) => ({
        id: prompt.slug,
        category: prompt.category,
        title: prompt.title,
        description: prompt.description,
        level: prompt.level,
        time: prompt.time,
      }));

    if (related.length > 0) return related;
  }

  const sameCategory = POPULAR_PROMPTS.filter(
    (prompt) => prompt.id !== slug && prompt.category === current.category,
  );
  const others = POPULAR_PROMPTS.filter(
    (prompt) => prompt.id !== slug && prompt.category !== current.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
