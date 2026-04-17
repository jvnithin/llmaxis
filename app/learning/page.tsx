"use client";
import BrochureModal from "@/components/learning/BroucherModal";
import Link from "next/link";
import { useState } from "react";

const metadata = {
  title: "Gen AI & Agentic AI Program | LLM Axis",
  description:
    "Master GenAI, LLMs, RAG & Agentic AI with real-world projects, mentorship, and placement support in 12 weeks.",
};

export default function GenAIProgram() {
   const [modalOpen, setModalOpen] = useState(false);
  return (
    <main className="bg-[#F7F8FC]">
       <BrochureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      {/* HERO */}
      <section className="text-center py-20 md:py-28 px-4">
        <p className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-xs font-medium mb-5">
          Admissions Open · 2026 Cohort
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
          Gen AI & Agentic AI
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Program
          </span>
        </h1>

        <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm md:text-lg">
          Master GenAI, LLMs, RAG & Agentic AI with industry-focused training,
          real-world projects, and placement support.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/contact"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md"
          >
            Enroll Now
          </Link>

          {/* <a
            href="/Brochure.pdf"
            download
            className="border bg-white px-8 py-3 rounded-xl font-semibold"
          >
            Download Brochure
          </a> */}
           <button
            onClick={() => setModalOpen(true)}
            className="border bg-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Download Brochure
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-12 border-y">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {[
            { num: "3", label: "Months" },
            { num: "12", label: "Weeks" },
            { num: "9+", label: "Projects" },
            { num: "1000+", label: "Learners" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#F9FAFB] rounded-xl py-6 text-center border"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-purple-600">
                {item.num}
              </h3>
              <p className="text-sm text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU WILL LEARN */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What You Will Learn
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            "Master GenAI, LLMs, RAG & Agentic AI",
            "Build real-world AI applications",
            "Learn prompt engineering, APIs & deployment",
            "Production-ready capstone project",
            "Mock interviews & placement support",
            "Become job-ready in 12 weeks",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border text-black hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition"
            >
              <p className="text-sm md:text-base font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            12-Week Curriculum
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              "LLM Fundamentals & RAG",
              "APIs, Tools & Memory",
              "Advanced RAG & Multi-modal",
              "Automation & Workflows",
              "Security & API Systems",
              "Agentic AI Basics",
              "Agent Frameworks",
              "Multi-Agent Systems",
              "Long-running Agents",
              "Cloud Deployment",
              "Capstone Project",
              "Final Demo & Certification",
            ].map((week, i) => (
              <div
                key={i}
                className="p-5 border rounded-xl bg-white hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition"
              >
                <h3 className="font-medium text-sm md:text-base">
                  <span className="text-purple-600 font-semibold">
                    Week {i + 1}:
                  </span>{" "}
                  <span className="font-semibold">{week}</span>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="py-16 px-4 bg-[#F7F8FC]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            Who Is This For
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: "💼",
                title: "Professionals",
                desc: "Upgrade your skills and stay relevant in AI-driven industry.",
              },
              {
                icon: "🎓",
                title: "Students",
                desc: "Start your AI career with real-world projects.",
              },
              {
                icon: "🚀",
                title: "Founders",
                desc: "Build AI-powered products and scale faster.",
              },
              {
                icon: "🔄",
                title: "Career Switchers",
                desc: "Transition into tech with in-demand AI skills.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-5 flex gap-4 hover:shadow-md transition"
              >
                <div className="text-2xl">{item.icon}</div>
                <div className="text-left">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINER */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Meet Your Trainer
          </h2>

          <div className="bg-[#F9FAFB] border rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6 items-center">

            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              GA
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold">
                Ganesh Adabala
              </h3>

              <p className="text-purple-600 text-sm md:text-base mt-1">
                Ex-Microsoft & Amazon · AI Trainer
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-xs">
                  15+ Years Experience
                </span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded text-xs">
                  1000+ Professionals Trained
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-4 max-w-xl">
                Industry expert with experience in building and deploying
                real-world AI systems across global companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Start Your AI Career Today
        </h2>

        <p className="mb-6 text-white/80">
          Limited seats available. Enroll now and build real AI products.
        </p>

        <Link
          href="/contact"
          className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold"
        >
          Enroll Now
        </Link>
      </section>

    </main>
  );
}