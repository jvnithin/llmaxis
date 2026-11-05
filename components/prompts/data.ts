export type PromptAudienceId =
  | "it-professionals"
  | "non-it-professionals"
  | "students"
  | "job-seekers";

export type PromptAudience = {
  id: PromptAudienceId;
  title: string;
  tag: string;
  subcategoryCount: number;
  promptCount: number;
  icon: "code" | "briefcase" | "graduation" | "target";
};

export type PopularPrompt = {
  id: string;
  category: string;
  title: string;
  description: string;
  level: string;
  time: string;
};

export type OutcomeAction = {
  id: string;
  label: string;
  icon: string;
  /** Explore library audience tab id */
  audienceId: "it" | "non-it" | "masters-students" | "usa-jobseekers";
  /** Explore library subcategory id */
  subcategoryId: string;
};

export type PromptStep = {
  number: string;
  label: string;
  title: string;
  description: string;
};

export const PROMPT_AUDIENCES: PromptAudience[] = [
  {
    id: "it-professionals",
    title: "IT Professionals",
    tag: "Technical",
    subcategoryCount: 12,
    promptCount: 60,
    icon: "code",
  },
  {
    id: "non-it-professionals",
    title: "Non-IT Professionals",
    tag: "Operations",
    subcategoryCount: 12,
    promptCount: 60,
    icon: "briefcase",
  },
  {
    id: "students",
    title: "Students & Academia",
    tag: "Academic",
    subcategoryCount: 12,
    promptCount: 60,
    icon: "graduation",
  },
  {
    id: "job-seekers",
    title: "Job Seekers",
    tag: "Career",
    subcategoryCount: 14,
    promptCount: 70,
    icon: "target",
  },
];

export function getPromptAudience(id: PromptAudienceId) {
  return PROMPT_AUDIENCES.find((audience) => audience.id === id) ?? PROMPT_AUDIENCES[0];
}

/** Maps landing-page audience cards → /prompts/explore audience tabs */
export const AUDIENCE_EXPLORE_PARAM: Record<PromptAudienceId, string> = {
  "it-professionals": "it",
  "non-it-professionals": "non-it",
  students: "masters-students",
  "job-seekers": "usa-jobseekers",
};

export const POPULAR_PROMPTS: PopularPrompt[] = [
  {
    id: "ats-resume",
    category: "Career & Jobs",
    title: "Build an ATS-Friendly Resume",
    description:
      "Rewrite your resume for a target role with stronger keywords, clearer impact and ATS-ready structure.",
    level: "Beginner",
    time: "10 min",
  },
  {
    id: "behavioral-interview",
    category: "Interview Preparation",
    title: "Prepare for a Behavioral Interview",
    description:
      "Generate STAR stories, follow-up answers and a rehearsal plan for your next interview.",
    level: "Beginner",
    time: "10 min",
  },
  {
    id: "learning-roadmap",
    category: "Learning & Education",
    title: "Create a Personalized Learning Roadmap",
    description:
      "Map a practical study path based on your goals, current skills and available time.",
    level: "Beginner",
    time: "10 min",
  },
  {
    id: "rag-plan",
    category: "Generative AI & Development",
    title: "Create a RAG Application Plan",
    description:
      "Design a retrieval-augmented generation system with data sources, chunking and evaluation steps.",
    level: "Intermediate",
    time: "15 min",
  },
  {
    id: "startup-idea",
    category: "Business & Entrepreneurship",
    title: "Validate a Startup Idea",
    description:
      "Pressure-test an idea with customer pain, differentiation, risks and a first experiment plan.",
    level: "Beginner",
    time: "12 min",
  },
  {
    id: "content-calendar",
    category: "Marketing & Content",
    title: "Create a Monthly Content Calendar",
    description:
      "Build a channel-ready calendar with themes, formats and posting angles for the month.",
    level: "Beginner",
    time: "10 min",
  },
];

export const OUTCOME_ACTIONS: OutcomeAction[] = [
  {
    id: "job",
    label: "Find a job",
    icon: "/images/prompts/outcome-job.svg",
    audienceId: "usa-jobseekers",
    subcategoryId: "job-search-strategy",
  },
  {
    id: "interviews",
    label: "Prepare for interviews",
    icon: "/images/prompts/outcome-interview.svg",
    audienceId: "usa-jobseekers",
    subcategoryId: "behavioral-interview-preparation",
  },
  {
    id: "linkedin",
    label: "Improve my LinkedIn",
    icon: "/images/prompts/outcome-linkedin.svg",
    audienceId: "usa-jobseekers",
    subcategoryId: "linkedin-profile-optimization",
  },
  {
    id: "university",
    label: "Succeed at university",
    icon: "/images/prompts/outcome-university.svg",
    audienceId: "masters-students",
    subcategoryId: "academic-learning-understanding",
  },
  {
    id: "build-ai",
    label: "Build with AI",
    icon: "/images/prompts/outcome-ai.svg",
    audienceId: "it",
    subcategoryId: "ai-ml-engineers",
  },
  {
    id: "data",
    label: "Understand my data",
    icon: "/images/prompts/outcome-data.svg",
    audienceId: "it",
    subcategoryId: "data-analysts-bi-developers",
  },
  {
    id: "content",
    label: "Create better content",
    icon: "/images/prompts/outcome-content.svg",
    audienceId: "non-it",
    subcategoryId: "marketing-professionals",
  },
  {
    id: "organize",
    label: "Get more organized",
    icon: "/images/prompts/outcome-organize.svg",
    audienceId: "masters-students",
    subcategoryId: "productivity-time-management",
  },
];

export function outcomeExploreHref(action: OutcomeAction) {
  const params = new URLSearchParams({
    audience: action.audienceId,
    subcategory: action.subcategoryId,
  });
  return `/prompts/explore?${params.toString()}`;
}

export const PROMPT_STEPS: PromptStep[] = [
  {
    number: "01",
    label: "/ DISCOVER",
    title: "Find your prompt",
    description:
      "Search by task or browse categories to find a prompt that matches what you want to achieve with specific LLM parameters.",
  },
  {
    number: "02",
    label: "/ PERSONALIZE",
    title: "Add your context",
    description:
      "Replace the bracketed variables with your personal background, specific goals, operational constraints and project facts.",
  },
  {
    number: "03",
    label: "/ COPY & USE",
    title: "Put AI to work",
    description:
      "Copy the prompt into your preferred AI assistant. Review the synthesized output and refine it with guided follow-up queries.",
  },
];

export const SAMPLE_PROMPT = `// Executive ATS Optimization Persona
You are an elite Talent Acquisition Specialist with 15+
years experience evaluating candidates for {target_company}
in the {industry_domain} sector.
Review my current resume against this target role
description: {target_job_title}.
Constraints & Rules:
• Highlight hard metric omissions using STAR syntax
• Score ATS keyword convergence (Target: > 92%)
• Output 3 tailored impact bullet variations`;
