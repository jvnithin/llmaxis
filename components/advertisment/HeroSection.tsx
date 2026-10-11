"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface HeroSectionProps {
  onOpenConsultation: () => void;
}

interface StatBlock {
  value: string;
  line1: string;
  line2?: string;
}

const stats: StatBlock[] = [
  { value: "500+", line1: "Company Hire", line2: "Our Learners" },
  { value: "6,000+", line1: "Learners Trained", line2: "Worldwide" },
  { value: "3 Months", line1: "To Industry Ready" },
  { value: "20+", line1: "Countries Our", line2: "Learners Are" },
];

export default function HeroSection({ onOpenConsultation }: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-transparent pt-6 pb-8 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14">
      {/* Soft Ambient Background Lighting matching Canva */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] lg:w-[1300px] h-[340px] bg-gradient-to-r from-purple-100/50 via-sky-100/40 to-rose-100/30 blur-3xl rounded-full" />

      {/* Main Container */}
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-6 xl:col-span-6 text-left space-y-4 sm:space-y-5 lg:space-y-5">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
              Learn Today.
              <br />
              Build Tomorrow.
              <br />
              <span className="text-[#EF4444] inline-block">Go Global.</span>
            </h1>

            {/* Description Subheading */}
            <p className="text-sm sm:text-base md:text-[17px] text-slate-600 max-w-lg leading-relaxed">
              Hands-on Gen AI & Agent AI training designed for ambitious
              learners from India and around the world. Build real skills, work
              on real projects, and launch a global career.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1">
              <Link
                href="#programs"
                id="hero-explore-programs-btn"
                className="inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white px-7 py-3 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all text-center transform hover:-translate-y-0.5"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                id="hero-book-consultation-btn"
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-300 px-6 py-3 rounded-full text-sm font-semibold shadow-2xs hover:shadow-xs transition-all text-center transform hover:-translate-y-0.5"
              >
                <Calendar className="w-4 h-4 text-[#0F172A]" />
                <span>Book a Free Consultation</span>
              </button>
            </div>

            {/* Metrics & Stats Row with Subtle Vertical Dividers */}
            <div className="pt-6 sm:pt-8 flex flex-wrap sm:flex-nowrap items-stretch justify-between gap-y-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`flex-1 min-w-[110px] sm:min-w-0 ${
                    idx !== 0
                      ? "sm:border-l sm:border-slate-200 sm:pl-3.5 lg:pl-4 xl:pl-5 sm:ml-1"
                      : "sm:pr-2"
                  }`}
                >
                  {/* Stat Value */}
                  <div className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-[#0B132B] tracking-tight whitespace-nowrap leading-none mb-1.5">
                    {stat.value}
                  </div>
                  {/* Stat Description */}
                  <div className="text-xs sm:text-[13px] text-slate-600 font-normal leading-tight">
                    <div>{stat.line1}</div>
                    {stat.line2 && <div>{stat.line2}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Visual Column - High-Resolution Enhanced Image */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[760px] xl:max-w-[840px] flex items-center justify-center">
              {!imageError ? (
                <div className="relative w-full flex items-center justify-center">
                  <Image
                    src="/images/Rectangle.png"
                    alt="Learn Gen AI & Launch Global Career with LLM Axis"
                    width={1776}
                    height={1388}
                    quality={100}
                    unoptimized
                    priority
                    style={{ width: "100%", height: "auto" }}
                    className="w-full max-h-[520px] sm:max-h-[580px] lg:max-h-[640px] object-contain select-none mix-blend-multiply"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                /* Fallback if image missing */
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#0F172A] p-6 text-white flex flex-col justify-between">
                  <div className="font-serif italic text-amber-300 text-sm">
                    ✨ Same Roots, Bigger Dreams
                  </div>
                  <div className="text-center py-6">
                    <div className="text-2xl font-bold">LLM Axis Global AI Hub</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
