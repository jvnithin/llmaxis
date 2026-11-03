export const BLOG_KINDS = ["Roadmaps", "Articles"] as const;

export type BlogKind = (typeof BLOG_KINDS)[number];

export const BLOG_FILTERS = [
  "All Topics",
  "Agentic AI",
  "Generative AI",
  "Machine Learning",
  "Forward Deployed Engineering (FDA)",
  "AI Automation",
  "Data Engineering",
  "AI Research",
  "Career Transitions",
] as const;

export type BlogFilter = (typeof BLOG_FILTERS)[number];

export type BlogGuide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  topics: BlogFilter[];
  kind: "roadmap" | "article";
  category?: string;
  href?: string;
};
