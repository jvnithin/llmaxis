"use client";

import { ArrowRight } from "lucide-react";

interface ConsultationBannerProps {
  onOpenConsultation: () => void;
}

export default function ConsultationBanner({
  onOpenConsultation,
}: ConsultationBannerProps) {
  return (
    <section className="py-3 sm:py-4 bg-transparent">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#3A0CA3] text-white p-6 sm:p-8 md:p-12 shadow-xl sm:shadow-2xl border border-indigo-900/40">
          {/* Subtle glow background elements */}
          <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="space-y-2.5 max-w-2xl text-center lg:text-left">

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Let&apos;s Build a Brighter Future Together.
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300">
                Get expert guidance, program recommendations and a clear career roadmap.
              </p>
            </div>

            {/* Right Action & Stylized Text */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <button
                type="button"
                id="banner-book-consultation-btn"
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0B132B] px-7 sm:px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all text-center transform hover:-translate-y-0.5"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="w-4 h-4 text-purple-700" />
              </button>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
