export type CareerDepartment =
  | "all"
  | "engineering"
  | "sales"
  | "marketing"
  | "hr";

export type CareerRole = {
  id: string;
  title: string;
  department: Exclude<CareerDepartment, "all" | "hr">;
  location: string;
  type: string;
  openings: number;
  description: string;
  tags: string[];
};

export type CareerHighlight = {
  id: string;
  label: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
};

export type CareerDepartmentTab = {
  id: CareerDepartment;
  label: string;
  filled?: boolean;
};

export const CAREER_HIGHLIGHTS: CareerHighlight[] = [
  {
    id: "remote",
    label: "Remote-First Infrastructure",
    icon: "/images/careers/831b7.svg",
    iconWidth: 12.5,
    iconHeight: 12.5,
  },
  {
    id: "nodes",
    label: "Global Engineering Nodes",
    icon: "/images/careers/930b3.svg",
    iconWidth: 13.75,
    iconHeight: 10,
  },
  {
    id: "equity",
    label: "Competitive Equity & GPU Cluster Stipend",
    icon: "/images/careers/39147.svg",
    iconWidth: 11.25,
    iconHeight: 11.25,
  },
];

export const CAREER_ROLES: CareerRole[] = [
  {
    id: "ai-consultant",
    title: "AI Consultant",
    department: "engineering",
    location: "Hybrid//bengaluru",
    type: "Parttime/Full Time",
    openings: 2,
    description:
      "Client advisory on Generative & Agentic AI workflows, LLM infrastructure roadmaps, enterprise tool integration, and model selection.",
    tags: ["LangChain", "Advisory", "Inference Scaling"],
  },
  {
    id: "agentic-ai-engineer",
    title: "Agentic AI Engineer",
    department: "engineering",
    location: "Hybrid//bengaluru",
    type: "Parttime/Full Time",
    openings: 4,
    description:
      "Multi-agent orchestration architectures (LangGraph, AutoGen), state persistence, dynamic memory graphs, and deterministic evaluation loops.",
    tags: ["LangGraph", "AutoGen", "Graph Memory"],
  },
  {
    id: "ai-sme",
    title: "AI Subject Matter Expert",
    department: "engineering",
    location: "Hybrid//bengaluru",
    type: "Parttime/Full Time",
    openings: 2,
    description:
      "Benchmark datasets creation, technical curricula development, frontier model stress testing, and evaluation metrics design.",
    tags: ["Eval Suites", "Curriculum", "Benchmarking"],
  },
  {
    id: "fde-sme",
    title: "FDE Subject Matter Expert",
    department: "engineering",
    location: "Hybrid//bengaluru",
    type: "Parttime/Full Time",
    openings: 3,
    description:
      "Low-latency enterprise RAG systems, VPC self-hosted private models, LoRA/QLoRA fine-tuning pipelines, and on-premise deployments.",
    tags: ["Enterprise RAG", "QLoRA", "vLLM"],
  },
  {
    id: "bd-executive",
    title: "Business Development Executive",
    department: "sales",
    location: "Bengaluru",
    type: "Full-time",
    openings: 2,
    description:
      "Enterprise partnership agreements, corporate AI upskilling academies, multi-million dollar training contracts with Global 2000 tech divisions.",
    tags: ["Enterprise Sales", "Corporate AI", "Pipelines"],
  },
  {
    id: "content-creator",
    title: "Content Creator & Influencer Marketing Executive",
    department: "marketing",
    location: "Hybrid//bengaluru",
    type: "Parttime/Full Time",
    openings: 1,
    description:
      "Plan and create social content, short-form video, and influencer collaborations that grow the LLM Axis brand across Instagram, LinkedIn, and YouTube.",
    tags: ["Content Creation", "Influencer Marketing", "Social Media"],
  },
];

export const CAREER_DEPARTMENTS: CareerDepartmentTab[] = [
  { id: "all", label: "All Departments" },
  { id: "engineering", label: "Engineering & Training" },
  { id: "sales", label: "Sales & Business Development" },
  { id: "marketing", label: "Marketing & Communications" },
  { id: "hr", label: "Human Resources", filled: true },
];

/** Figma filter badges count open roles (not openings). */
export function roleCountForDepartment(department: CareerDepartment) {
  if (department === "hr") return 0;
  return CAREER_ROLES.filter(
    (role) => department === "all" || role.department === department,
  ).length;
}

export function filterCareerRoles(department: CareerDepartment) {
  if (department === "all") return CAREER_ROLES;
  if (department === "hr") return [];
  return CAREER_ROLES.filter((role) => role.department === department);
}

export function careerDetailHref(roleId: string) {
  return `/careers/${roleId}`;
}

export function careerApplyHref(roleTitle: string) {
  const params = new URLSearchParams({
    source: "careers",
    role: roleTitle,
  });
  return `/contact?${params.toString()}`;
}
