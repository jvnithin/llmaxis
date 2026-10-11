"use client";

import { useState } from "react";
import HeroSection from "@/components/advertisment/HeroSection";
import CompanyLogosBar from "@/components/advertisment/CompanyLogosBar";
import WhyChooseSection from "@/components/advertisment/WhyChooseSection";
import ProgramsSection from "@/components/advertisment/ProgramsSection";
import ConsultationBanner from "@/components/advertisment/ConsultationBanner";
import SuccessStories from "@/components/advertisment/SuccessStories";
import AdvertisementFooter from "@/components/advertisment/AdvertisementFooter";
import ConsultationModal from "@/components/advertisment/ConsultationModal";

export default function AdvertisementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Gen AI Foundation");

  const handleOpenConsultation = (programName?: string) => {
    if (programName) {
      setSelectedProgram(programName);
    }
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7FF] via-[#F8FAFC] to-[#F3F4F8] text-slate-900 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Ambient Glowing Mesh Gradients matching Canva */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-Right Purple/Indigo Glow (Behind Hero Globe & Student) */}
        <div className="absolute -top-32 right-[-10%] w-[850px] h-[850px] rounded-full bg-gradient-to-br from-purple-400/20 via-indigo-300/15 to-sky-200/10 blur-[110px]" />

        {/* Top-Left Lilac/Pink Blush */}
        <div className="absolute -top-24 -left-20 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-pink-300/15 via-purple-200/15 to-transparent blur-[100px]" />

        {/* Mid-Page Ambient Glow (Behind Why Choose / Programs) */}
        <div className="absolute top-[38%] -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-purple-200/10 via-sky-100/15 to-transparent blur-[120px]" />

        {/* Lower Ambient Glow (Behind Success Stories) */}
        <div className="absolute bottom-[12%] -right-24 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-indigo-200/15 via-purple-100/10 to-transparent blur-[110px]" />
      </div>

      {/* Page Sections Stack */}
      <div className="relative z-10">
        {/* 1. Hero Section with Headline, Subtitle, CTAs, Stats & Student/Globe Visual */}
        <HeroSection onOpenConsultation={() => handleOpenConsultation()} />

        {/* 2. Learners Work At Company Logos Bar */}
        <CompanyLogosBar />

        {/* 3. Why Choose LLM Axis Features Grid */}
        <WhyChooseSection />

        {/* 4. Future-Ready AI Programs Grid */}
        <ProgramsSection onSelectProgram={(p) => handleOpenConsultation(p)} />

        {/* 5. Consultation Banner Card */}
        <ConsultationBanner onOpenConsultation={() => handleOpenConsultation()} />

        {/* 6. Success Stories & Real Growth Testimonials */}
        <SuccessStories />

        {/* 7. Page Specific Footer & Newsletter Subscription */}
        <AdvertisementFooter />
      </div>

      {/* Interactive Consultation Modal */}
      <ConsultationModal
        isOpen={modalOpen}
        initialProgram={selectedProgram}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

