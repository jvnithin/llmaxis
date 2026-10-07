"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Brain,
  BookOpen,
  Wrench,
  Search,
  Cpu,
  Zap,
  Bot,
  Flame,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import EventRegisterModal from "@/components/events/EventRegisterModal";

const capabilities = [
  {
    icon: Brain,
    title: "Understand a goal",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: BookOpen,
    title: "Access relevant knowledge",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Wrench,
    title: "Use tools",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Search,
    title: "Analyze information",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Cpu,
    title: "Make decisions",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Zap,
    title: "Take actions",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Bot,
    title: "Work as an AI Agent",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const topics = [
  "AI, ML, GenAI & LLMs",
  "What's actually happening inside AI",
  "Tokens, prompts & hallucinations",
  "Real-world GenAI applications",
  "AI opportunities & emerging roles",
  "RAG & knowledge-based AI",
  "AI Agents & Agentic AI",
  "MCP & connecting AI to tools",
  "LIVE AI demonstrations",
  "The roadmap from AI user → AI builder",
];

export default function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="bg-[#F8FAFC] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Registration Modal */}
      <EventRegisterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top Header with Register Button on Top Right */}
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-slate-200/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Live Masterclass
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Event Details
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition active:scale-[0.98] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Register</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ══════════════════════════════════════════════
              LEFT SIDE: EVENT POSTER IMAGE ONLY
             ══════════════════════════════════════════════ */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm bg-white">
              <Image
                src="/event-poster.jpg"
                alt="Beyond ChatGPT: How AI Is Learning to Think, Act & Work - Event Poster"
                width={700}
                height={933}
                priority
                className="w-full h-auto object-cover rounded-2xl md:rounded-3xl hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT SIDE: EVENT CONTENT
             ══════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* 1. ALERT HOOK */}
            <section className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl shrink-0 mt-0.5">🚨</span>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  YOU USE AI. BUT DO YOU REALLY UNDERSTAND WHAT&apos;S COMING NEXT?
                </h2>
              </div>

              <div className="space-y-2.5 text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                <p className="font-semibold text-slate-900">
                  You&apos;ve probably used ChatGPT.
                </p>
                <p>
                  You&apos;ve probably generated content, asked questions, created presentations or analyzed information with AI.
                </p>
                <p className="text-purple-700 font-bold text-sm sm:text-base pt-1">
                  But... What happens when AI can do more than answer?
                </p>
              </div>
            </section>

            {/* 2. CAPABILITIES */}
            <section className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                What happens when it can:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {capabilities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${item.bg} ${item.color} shrink-0`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center font-semibold text-xs sm:text-sm shadow-xs tracking-wide">
                That&apos;s where Generative AI meets Agentic AI.
              </div>
            </section>

            {/* 3. EVENT SPOTLIGHT (LIGHT BACKGROUND) */}
            <section className="bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-purple-50/70 rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-purple-200/80 shadow-xs space-y-3">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Join us for a LIVE, highly practical experience:
              </p>

              <div className="flex items-start gap-2.5">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0 mt-0.5" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  Beyond ChatGPT:{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                    How AI Is Learning to Think, Act &amp; Work
                  </span>
                </h3>
              </div>
            </section>

            {/* 4. SYLLABUS / EXPLORATION TOPICS */}
            <section className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                In this session, we&apos;ll explore:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {topics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-100 transition text-slate-700 text-xs sm:text-sm font-medium"
                  >
                    <ArrowRight className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 text-purple-700 font-semibold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>And you&apos;ll discover how you can build these capabilities yourself.</span>
              </div>
            </section>

            {/* 5. TARGET AUDIENCE */}
            <section className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  No advanced AI background required.
                </h4>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Whether you&apos;re a student, developer, data professional, QA professional, business leader, entrepreneur or simply curious about AI—this session is designed for you.
              </p>
            </section>

            {/* 6. CALL TO ACTION QUOTE BANNER */}
            <section
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl md:rounded-3xl p-6 sm:p-7 text-center space-y-2 shadow-sm cursor-pointer hover:opacity-95 transition"
            >
              <p className="text-xs sm:text-sm text-purple-100 font-medium">
                Don&apos;t just learn what AI can do.
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
                Discover what YOU can build with it.
              </h3>
              <p className="text-xs text-purple-200 pt-1 underline underline-offset-4">
                Click here to Register for Free →
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
