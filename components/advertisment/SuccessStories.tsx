"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TestimonialItem } from "./types";

const testimonials: TestimonialItem[] = [
  {
    id: "rahul",
    name: "Rahul K.",
    role: "Software Engineer, USA",
    quote:
      "“LLM Axis gave me the skills, confidence and portfolio to land my dream job in the US.”",
    imageSrc: "/images/advertisment/testimonials/rahul.png",
    linkedinUrl: "https://www.linkedin.com/company/llm-axis",
    initials: "RK",
  },
  {
    id: "sneha",
    name: "Sneha P.",
    role: "Data Analyst, Canada",
    quote:
      "“The hands-on projects and mentorship made all the difference. Highly recommended!”",
    imageSrc: "/images/advertisment/testimonials/sneha.png",
    linkedinUrl: "https://www.linkedin.com/company/llm-axis",
    initials: "SP",
  },
  {
    id: "vamsi",
    name: "Vamsi T.",
    role: "AI Engineer, Germany",
    quote:
      "“From Andhra to a global career – LLM Axis made it possible. A game-changer for my career.”",
    imageSrc: "/images/advertisment/testimonials/vamsi.png",
    linkedinUrl: "https://www.linkedin.com/company/llm-axis",
    initials: "VT",
  },
];

export default function SuccessStories() {
  return (
    <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 bg-transparent">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header with Title & View All Stories */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-1">
            {/* Gradient Dash + Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-slate-500 tracking-normal">
              <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600" />
              <span>Success Stories</span>
            </div>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0B132B] tracking-tight leading-tight">
              Real People. Real Growth.
            </h2>

            {/* Subtitle */}
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              Hear from our learners who are now building global careers.
            </p>
          </div>

          {/* View All Stories Link */}
          <Link
            href="/learning"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6D28D9] hover:text-[#5B21B6] transition group self-start md:self-auto"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Testimonials Cards (1 Row on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-300 flex items-center gap-4 sm:gap-5"
            >
              {/* Left Column: Portrait Avatar Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-xs bg-slate-50">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              </div>

              {/* Right Column: Quote + Author + LinkedIn */}
              <div className="flex-1 flex flex-col justify-between min-w-0 min-h-[90px] sm:min-h-[100px]">
                {/* Quote */}
                <p className="text-xs sm:text-[12.5px] lg:text-[13px] text-slate-700 leading-relaxed font-normal">
                  {item.quote}
                </p>

                {/* Bottom Author Row */}
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13.5px] font-bold text-[#0F172A] leading-tight truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-[11.5px] text-slate-500 leading-tight mt-0.5 truncate">
                      {item.role}
                    </p>
                  </div>

                  {/* LinkedIn Icon Badge */}
                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.name}'s LinkedIn profile`}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#0A66C2] hover:bg-[#084e96] text-white flex items-center justify-center shrink-0 transition shadow-2xs"
                  >
                    <svg
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

