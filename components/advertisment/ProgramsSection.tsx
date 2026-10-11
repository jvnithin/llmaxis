"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ProjectItem {
  id: string;
  level: string;
  levelBadge: string;
  title: string;
  description: string;
  skills: string[];
  imageSrc: string;
  imageAlt: string;
  cardBg: string;
  borderColor: string;
}

interface ProgramsSectionProps {
  onSelectProgram: (programName: string) => void;
}

const projects: ProjectItem[] = [
  {
    id: "ai-study-buddy",
    level: "Beginner Project 1",
    levelBadge: "bg-purple-100 text-purple-700 border-purple-200",
    title: "AI Study Buddy",
    description:
      "Build a conversational AI assistant using Ollama with a custom system prompt, conversation flow, and response customization. Learn Ollama, Modelfiles, prompting, and local LLM execution.",
    skills: ["Ollama & Modelfiles", "Prompt Engineering", "Local LLM Execution"],
    imageSrc: "/images/projects/project1-study-buddy.jpg",
    imageAlt: "AI Study Buddy Project Preview",
    cardBg: "bg-[#FAF5FF]/70 hover:bg-[#FAF5FF]",
    borderColor: "border-purple-200/80 hover:border-purple-300",
  },
  {
    id: "ai-meeting-notes",
    level: "Beginner Project 2",
    levelBadge: "bg-blue-100 text-blue-700 border-blue-200",
    title: "AI Meeting Notes & Email Generator",
    description:
      "Upload meeting notes or raw text and generate summaries, action items, and professional follow-up emails. Learn prompt engineering, structured outputs, and document processing.",
    skills: ["Structured Outputs", "Document Summarization", "Email Automation"],
    imageSrc: "/images/projects/project2-meeting-notes.jpg",
    imageAlt: "AI Meeting Notes & Email Generator Project Preview",
    cardBg: "bg-[#EFF6FF]/70 hover:bg-[#EFF6FF]",
    borderColor: "border-blue-200/80 hover:border-blue-300",
  },
  {
    id: "enterprise-rag",
    level: "Intermediate Project 1",
    levelBadge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    title: "Enterprise Document Assistant (RAG)",
    description:
      "Build a chatbot that answers questions from uploaded PDF, DOCX, and TXT files using embeddings, vector databases, and Retrieval-Augmented Generation (RAG). Learn LangChain/LlamaIndex, ChromaDB, chunking, and retrieval strategies.",
    skills: ["LangChain & LlamaIndex", "ChromaDB Vector DB", "Retrieval Strategies & Chunking"],
    imageSrc: "/images/projects/project3-enterprise-rag.jpg",
    imageAlt: "Enterprise Document Assistant RAG Project Preview",
    cardBg: "bg-[#ECFDF5]/70 hover:bg-[#ECFDF5]",
    borderColor: "border-emerald-200/80 hover:border-emerald-300",
  },
  {
    id: "ai-research-agent",
    level: "Intermediate Project 2",
    levelBadge: "bg-amber-100 text-amber-700 border-amber-200",
    title: "AI Research & Content Agent",
    description:
      "Develop an agent that researches a topic, summarizes findings, creates blog drafts or reports, and cites sources. Learn agent workflows, tool calling, web integration, memory, and structured outputs.",
    skills: ["Agent Workflows", "Tool Calling & Web Integration", "Memory & Citations"],
    imageSrc: "/images/projects/project4-research-agent.jpg",
    imageAlt: "AI Research & Content Agent Project Preview",
    cardBg: "bg-[#FFFBEB]/70 hover:bg-[#FFFBEB]",
    borderColor: "border-amber-200/80 hover:border-amber-300",
  },
  {
    id: "multi-agent-automation",
    level: "Advanced Project 1",
    levelBadge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    title: "Multi-Agent Business Automation System",
    description:
      "Create a team of AI agents (Planner, Researcher, Writer, Reviewer) using LangGraph or CrewAI to collaboratively solve complex tasks such as proposal generation or market analysis.",
    skills: ["LangGraph & CrewAI", "Multi-Agent Orchestration", "State Management & Memory"],
    imageSrc: "/images/projects/project5-multi-agent.jpg",
    imageAlt: "Multi-Agent Business Automation System Preview",
    cardBg: "bg-[#EEF2FF]/70 hover:bg-[#EEF2FF]",
    borderColor: "border-indigo-200/80 hover:border-indigo-300",
  },
  {
    id: "genai-business-assistant",
    level: "Advanced Project 2 (Capstone)",
    levelBadge: "bg-rose-100 text-rose-700 border-rose-200",
    title: "Production-Ready GenAI Business Assistant",
    description:
      "Build and deploy a full-stack AI application with a Streamlit frontend, FastAPI backend, Ollama/OpenAI integration, RAG, authentication, conversation history, and deployment on Docker/Render/Streamlit Cloud.",
    skills: ["FastAPI + Streamlit Full-Stack", "RAG & Authentication", "Docker & Cloud Deployment"],
    imageSrc: "/images/projects/project6-capstone-assistant.jpg",
    imageAlt: "Production-Ready GenAI Business Assistant Capstone Preview",
    cardBg: "bg-[#FFF1F2]/70 hover:bg-[#FFF1F2]",
    borderColor: "border-rose-200/80 hover:border-rose-300",
  },
];

export default function ProgramsSection({ onSelectProgram }: ProgramsSectionProps) {
  return (
    <section id="programs" className="pt-10 pb-4 sm:pt-14 sm:pb-6 bg-transparent">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-left space-y-1.5 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-600 tracking-wide uppercase">
            <span className="w-5 h-0.5 bg-purple-600 rounded-full" />
            <span>Our Programs</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold text-[#0F172A] tracking-tight">
            Hands On Projects
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm md:text-base">
            Structured curriculum. Practical learning. Global career support.
          </p>
        </div>

        {/* 2x3 Responsive Projects Grid (2 rows of 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProgram(project.title)}
              className={`group relative rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer ${project.cardBg} ${project.borderColor}`}
            >
              <div>
                {/* Level Badge & Image Preview */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold border tracking-wide ${project.levelBadge}`}
                  >
                    {project.level}
                  </span>
                </div>

                {/* Project Image Banner */}
                <div className="relative w-full h-44 sm:h-48 mb-4 overflow-hidden rounded-xl bg-white shadow-xs border border-slate-100">
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Project Title & Description */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-950 transition leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 mt-2 leading-relaxed min-h-[56px]">
                  {project.description}
                </p>

                {/* Skills Covered Tags */}
                <div className="mt-4 space-y-2 border-t border-slate-200/60 pt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Skills Covered
                  </span>
                  {project.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="line-clamp-1">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-6 pt-3 border-t border-slate-200/40 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 group-hover:text-purple-800 transition">
                  Enroll & Build This Project
                </span>
                <span className="p-2 rounded-full bg-white shadow-2xs border border-slate-200 text-slate-700 group-hover:bg-[#0F172A] group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

