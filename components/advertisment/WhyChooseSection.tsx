"use client";

import Image from "next/image";

interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconSrc: string;
}

const features: FeatureCardData[] = [
  {
    id: "hands-on",
    title: "Hands-On Learning",
    description: "Build real AI applications, not just video ads.",
    cardBg: "bg-[#FFF5F7]",
    cardBorder: "border-[#FCE7F3]",
    iconBg: "bg-[#FDE8ED]",
    iconSrc: "/whyChoose/b2.png",
  },
  {
    id: "experts",
    title: "Learn from Experts",
    description: "Industry practitioners and mentors from top companies.",
    cardBg: "bg-[#F0F7FF]",
    cardBorder: "border-[#E0F2FE]",
    iconBg: "bg-[#E0F2FE]",
    iconSrc: "/whyChoose/people.png",
  },
  {
    id: "projects",
    title: "Real-World Projects",
    description: "Work on industry-relevant projects and build your portfolio.",
    cardBg: "bg-[#F0FDF4]",
    cardBorder: "border-[#DCFCE7]",
    iconBg: "bg-[#DCFCE7]",
    iconSrc: "/whyChoose/rocket.png",
  },
  {
    id: "career",
    title: "Career Acceleration",
    description: "Resume preparation, mock interviews, and global job support.",
    cardBg: "bg-[#FFFDF0]",
    cardBorder: "border-[#FEF9C3]",
    iconBg: "bg-[#FEF3C7]",
    iconSrc: "/whyChoose/bar.png",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="w-full bg-transparent py-8 sm:py-10">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Heading */}
        <div className="mb-5 sm:mb-6 text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-[30px] font-extrabold text-[#0B132B] tracking-tight">
            Why Choose LLM Axis?
          </h2>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`rounded-2xl border ${feature.cardBorder} ${feature.cardBg} p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 transition-all duration-200 hover:shadow-xs`}
            >
              {/* Icon Box with Image from /whyChoose */}
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${feature.iconBg} flex items-center justify-center shrink-0 p-2`}
              >
                <Image
                  src={feature.iconSrc}
                  alt={feature.title}
                  width={24}
                  height={24}
                  style={{ width: "auto", height: "auto" }}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-[15px] font-bold text-[#0F172A] leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[12px] sm:text-[12.5px] text-[#64748B] mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


