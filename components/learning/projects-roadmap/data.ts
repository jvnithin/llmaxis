export type ProjectStageId = "beginner" | "intermediate" | "advanced" | "capstone";

export type RoadmapProject = {
  id: string;
  number: string;
  level: string;
  title: string;
  description: string;
  skills: string[];
  learns: string[];
};

export type RoadmapStage = {
  id: ProjectStageId;
  tabLabel: string;
  stageLabel: string;
  rangeLabel: string;
  activeThrough: number;
  projects: RoadmapProject[];
  isCapstone?: boolean;
};

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "beginner",
    tabLabel: "Beginner (1–4)",
    stageLabel: "Stage 1 of 4: Beginner Foundation",
    rangeLabel: "Projects 1–4 of 13",
    activeThrough: 4,
    projects: [
      {
        id: "p01",
        number: "01",
        level: "BEGINNER",
        title: "LLM Behavior Explorer",
        description:
          "Explore how LLMs respond to different prompts. Compare outputs, inspect tokenization, test prompt variations, and identify hallucinations and limitations.",
        skills: ["Tokens & Prediction", "Basic Prompting", "Responsible AI Use"],
        learns: [
          "AI/ML/LLM fundamentals",
          "Tokens & next-token prediction",
          "Model parameters",
          "Basic prompting",
          "Responsible use",
        ],
      },
      {
        id: "p02",
        number: "02",
        level: "BEGINNER",
        title: "Python AI Assistant (CLI)",
        description:
          "Build a command-line AI assistant that accepts user input, calls an AI API, handles JSON responses, and reads or writes files.",
        skills: ["Python Fundamentals", "API Calls", "File Processing"],
        learns: [
          "Python lists & dictionaries",
          "Conditions, loops & functions",
          "API calls",
          "Error handling basics",
          "File processing",
        ],
      },
      {
        id: "p03",
        number: "03",
        level: "BEGINNER",
        title: "GitHub-Published AI Utility",
        description:
          "Package the Python AI assistant as a clean, shareable repository. Create a README, organize source files, commit changes, push to GitHub, and practice a simple branch-and-merge workflow.",
        skills: ["Git Fundamentals", "Version Control", "Documentation"],
        learns: [
          "Git fundamentals",
          "Repository structure",
          "Version control",
          "Documentation",
          "Developer workflow",
        ],
      },
      {
        id: "p04",
        number: "04",
        level: "BEGINNER",
        title: "Multi-Role Prompting Assistant",
        description:
          "Build an assistant that can switch between roles such as teacher, reviewer, and critic, and return results in a defined JSON structure.",
        skills: ["Role Prompting", "Structured Outputs", "Few-Shot Patterns"],
        learns: [
          "System & role prompting",
          "Few-shot examples",
          "Prompt patterns",
          "Structured outputs",
          "Prompt debugging & iterative optimization",
        ],
      },
    ],
  },
  {
    id: "intermediate",
    tabLabel: "Intermediate (5–8)",
    stageLabel: "Stage 2 of 4: Intermediate Systems",
    rangeLabel: "Projects 5–8 of 13",
    activeThrough: 8,
    projects: [
      {
        id: "p05",
        number: "05",
        level: "INTERMEDIATE",
        title: "Chat with Your Documents (Basic RAG)",
        description:
          "Create a document question-answering app that chunks source documents, generates embeddings, retrieves relevant passages from a vector store, and uses them to answer questions.",
        skills: ["Embeddings", "Vector Databases", "Basic RAG Pipeline"],
        learns: [
          "Embeddings",
          "Vector databases",
          "Chunking basics",
          "Retrieval versus generation",
          "Basic RAG pipeline",
        ],
      },
      {
        id: "p06",
        number: "06",
        level: "INTERMEDIATE",
        title: "Domain Expert Knowledge Assistant",
        description:
          "Build a domain-specific assistant over a curated collection of documents. Improve answer relevance using chunking strategies, metadata filters, hybrid or alternative retrieval approaches, and retrieval evaluation.",
        skills: ["Advanced RAG", "Metadata Filtering", "Search Optimization"],
        learns: [
          "Advanced RAG",
          "Metadata filtering",
          "Search optimization",
          "Grounding answers in source material",
        ],
      },
      {
        id: "p07",
        number: "07",
        level: "INTERMEDIATE",
        title: "Memory-Enabled Personal Assistant",
        description:
          "Develop a chatbot that remembers relevant details across turns and restores session context where appropriate. Design conversation history, short-term and longer-term memory, and state updates while avoiding unnecessary retention.",
        skills: ["Memory Patterns", "State Management", "Session Tracking"],
        learns: [
          "Memory patterns",
          "State management",
          "Session tracking",
          "Conversational design",
        ],
      },
      {
        id: "p08",
        number: "08",
        level: "INTERMEDIATE",
        title: "AI Task Planner",
        description:
          "Build an assistant that converts a goal into subtasks, creates an ordered plan, selects suitable tools, and revises the plan when a step fails.",
        skills: ["Task Decomposition", "Planning Loops", "Tool-Use Decisions"],
        learns: [
          "Agent-versus-chatbot concepts",
          "Task decomposition",
          "Planning loops",
          "Tool-use decisions",
          "Basic agent execution",
        ],
      },
    ],
  },
  {
    id: "advanced",
    tabLabel: "Advanced (9–12)",
    stageLabel: "Stage 3 of 4: Advanced Agentic Workflows",
    rangeLabel: "Projects 9–12 of 13",
    activeThrough: 12,
    projects: [
      {
        id: "p09",
        number: "09",
        level: "ADVANCED",
        title: "MCP Multi-Tool Assistant",
        description:
          "Build an agent that uses multiple tools—such as a calculator, file reader, and search tool—through Model Context Protocol. Define tool interfaces, share context, and coordinate tool calls for a user request.",
        skills: ["MCP Fundamentals", "Tool Abstraction", "Multi-Tool Orchestration"],
        learns: [
          "MCP fundamentals",
          "Tool abstraction",
          "Context sharing",
          "Multi-tool orchestration",
        ],
      },
      {
        id: "p10",
        number: "10",
        level: "ADVANCED",
        title: "LangGraph Workflow Automation System",
        description:
          "Create a graph-based AI workflow with defined nodes, conditional edges, shared state, retries, and a final response. Use a practical workflow such as lead qualification, support triage, or report generation.",
        skills: ["LangGraph", "Graph Execution", "Agent Orchestration"],
        learns: [
          "Nodes & edges",
          "Graph execution",
          "Deterministic workflow design",
          "State transitions",
          "Agent orchestration",
        ],
      },
      {
        id: "p11",
        number: "11",
        level: "ADVANCED",
        title: "Interactive GenAI Web App",
        description:
          "Turn an earlier AI project into a usable web application with input forms, chat or results views, API integration, and clear status/error messages.",
        skills: ["Streamlit UI", "API Integration", "Deployment Basics"],
        learns: [
          "Streamlit UI development",
          "API integration",
          "Basic UX",
          "Configuration management",
          "Deployment fundamentals",
        ],
      },
      {
        id: "p12",
        number: "12",
        level: "ADVANCED",
        title: "Production-Ready AI Service",
        description:
          "Harden an AI application with a FastAPI backend, structured logging, input validation, exception handling, rate limiting, and basic cost/performance controls.",
        skills: ["FastAPI Services", "Observability", "Rate Limiting"],
        learns: [
          "Service design",
          "Observability",
          "Reliability",
          "Rate limiting",
          "Optimization & scaling fundamentals",
        ],
      },
    ],
  },
  {
    id: "capstone",
    tabLabel: "Capstone (13)",
    stageLabel: "Stage 4 of 4: Enterprise Capstone",
    rangeLabel: "Projects 13 of 13",
    activeThrough: 13,
    isCapstone: true,
    projects: [],
  },
];

export const CAPSTONE = {
  titleLine1: "Production-Ready Agentic AI",
  titleLine2: "Business Solution",
  description:
    "Design, build, and deploy an end-to-end business-focused AI solution that integrates an LLM, RAG where useful, memory/state, tools or MCP, a workflow/agent layer, and a user interface. Publish the code and documentation on GitHub and present a live demo.",
  technologies: [
    "LLM + RAG",
    "Memory & State",
    "MCP / Tools",
    "Workflow Agents",
    "UI + GitHub Demo",
  ],
  foundations: [
    "01 Behavior Explorer",
    "02 Python CLI",
    "04 Multi-Role Prompting",
    "05 Basic RAG",
    "08 Task Planner",
    "09 MCP Multi-Tool",
    "10 LangGraph Workflow",
    "12 Production Service",
  ],
  learns: [
    "System design",
    "Architecture decisions",
    "Integration",
    "Testing",
    "Deployment",
    "Documentation",
    "Presentation skills",
  ],
};

export const CAPSTONE_AS_PROJECT: RoadmapProject = {
  id: "p13",
  number: "13",
  level: "CAPSTONE",
  title: `${CAPSTONE.titleLine1} ${CAPSTONE.titleLine2}`,
  description: CAPSTONE.description,
  skills: CAPSTONE.technologies,
  learns: CAPSTONE.learns,
};
