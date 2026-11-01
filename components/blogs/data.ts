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
  href?: string;
};

export const BLOG_GUIDES: BlogGuide[] = [
  {
    id: "machine-learning-engineer-roadmap-2026",
    title: "Machine Learning Engineer Roadmap 2026",
    subtitle: "Skills, salaries, projects, and career opportunities in the USA.",
    image: "/thumbnails/Machine Learning Engineer Roadmap 2026.png",
    topics: ["Machine Learning"],
    href: "/blogs/machine-learning-engineer-roadmap-usa",
  },
  {
    id: "generative-ai-roadmap-2026",
    title: "Generative AI Roadmap 2026",
    subtitle: "Skills, salaries, projects, and career opportunities in the USA.",
    image: "/thumbnails/Generative Ai.png",
    topics: ["Generative AI"],
  },
  {
    id: "agentic-ai-roadmap-2026",
    title: "Agentic AI Roadmap 2026",
    subtitle: "Skills, salaries, projects, and career opportunities in the USA.",
    image: "/thumbnails/Agentic AI Roadmap 2026.png",
    topics: ["Agentic AI"],
  },
  {
    id: "llm-engineer-roadmap-2026",
    title: "LLM Engineer Roadmap 2026",
    subtitle: "Skills, salaries, projects, and career opportunities in the USA.",
    image: "/thumbnails/LLM Engineer Roadmap 2026.png",
    topics: ["Generative AI"],
  },
  {
    id: "forward-deployed-engineer-roadmap-2026",
    title: "Forward Deployed Engineer Roadmap 2026",
    subtitle: "Skills, salaries, projects, and career opportunities in the USA.",
    image: "/thumbnails/Forward Deployed Engineer Roadmap 2026.png",
    topics: ["Forward Deployed Engineering (FDA)"],
  },
  {
    id: "ai-automation-engineer-roadmap-2026",
    title: "AI Automation Engineer Roadmap 2026",
    subtitle: "Skills, salary, projects, and career opportunities in the USA.",
    image: "/thumbnails/AI Automation Engineer Roadmap 2026.png",
    topics: ["AI Automation"],
  },
  {
    id: "ai-data-engineer-roadmap-2026",
    title: "AI Data Engineer Roadmap 2026",
    subtitle: "Skills, salary, projects, and career opportunities in the USA.",
    image: "/thumbnails/AI Data Engineer Roadmap 2026.png",
    topics: ["Data Engineering"],
  },
  {
    id: "ai-research-scientist-roadmap-2026",
    title: "AI Research Scientist Roadmap 2026",
    subtitle: "Skills, salaries, projects, and career opportunities in the USA.",
    image: "/thumbnails/AI Research Scientist Roadmap 2026.png",
    topics: ["AI Research"],
  },
  {
    id: "software-engineer-to-ai-engineer",
    title: "From Software Engineer to AI Engineer in the USA",
    subtitle: "A 2026 career roadmap from software engineering into AI roles.",
    image: "/thumbnails/From Software Engineer to AI Engineer.png",
    topics: ["Career Transitions"],
  },
  {
    id: "ai-career-roadmap-graduates",
    title: "AI Career Roadmap for Students and Recent Graduates in the USA",
    subtitle: "A 2026 path into AI roles for students and new graduates.",
    image: "/thumbnails/AI Career Roadmap for Graduates.png",
    topics: ["Career Transitions"],
  },
  {
    id: "business-analyst-to-ai-career",
    title: "From Business Analyst to AI Career in the USA",
    subtitle: "A 2026 roadmap from business analysis into an AI career.",
    image: "/thumbnails/Business Analyst to AI Career Roadmap.png",
    topics: ["Career Transitions"],
  },
  {
    id: "qa-tester-to-ai-career",
    title: "From QA Tester to AI Career in the USA",
    subtitle: "A 2026 roadmap for testers moving into AI roles.",
    image: "/thumbnails/From QA Tester to AI Career.png",
    topics: ["Career Transitions"],
  },
  {
    id: "data-analyst-to-ai-engineer",
    title: "From Data Analyst to AI Engineer in the USA",
    subtitle: "A 2026 career roadmap from data analysis into AI engineering.",
    image: "/thumbnails/Data Analyst to AI Engineer in the USA.png",
    topics: ["Career Transitions", "Data Engineering"],
  },
  {
    id: "data-engineer-to-ai-engineer",
    title: "From Data Engineer to AI Engineer",
    subtitle: "A career transition roadmap for 2026.",
    image: "/thumbnails/AI Data/AI Data Engineering Career Roadmap.png",
    topics: ["Career Transitions", "Data Engineering"],
  },
  {
    id: "devops-to-mlops",
    title: "From DevOps Engineer to MLOps / AI Infrastructure Engineer",
    subtitle: "How to move from DevOps into MLOps and AI infrastructure.",
    image: "/thumbnails/AI Automation/AI Automation Career Progression Infographic.png",
    topics: ["Career Transitions", "AI Automation"],
  },
  {
    id: "dba-to-ai-data-engineer",
    title: "From Database Administrator to AI Data Engineer",
    subtitle: "A path from database administration into AI data engineering.",
    image: "/thumbnails/AI Data/AI Data Engineering Toolset Infographic.png",
    topics: ["Career Transitions", "Data Engineering"],
  },
  {
    id: "pm-to-ai-pm",
    title: "From Product Manager to AI Product Manager",
    subtitle: "What changes when product management moves into AI.",
    image: "/thumbnails/AI Career/AI Career Pathway in the USA.png",
    topics: ["Career Transitions"],
  },
];
