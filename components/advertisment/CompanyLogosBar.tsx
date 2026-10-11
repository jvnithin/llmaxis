"use client";

import Image from "next/image";

interface CompanyLogoItem {
  name: string;
  src: string;
  width: number;
  height: number;
}

const logosList: CompanyLogoItem[] = [
  { name: "Google", src: "/logos/google.png", width: 110, height: 36 },
  { name: "Microsoft", src: "/logos/microsoft.png", width: 120, height: 30 },
  { name: "Amazon", src: "/logos/amazon.jpg", width: 105, height: 32 },
  { name: "Accenture", src: "/logos/accenture.jpg", width: 110, height: 32 },
  { name: "Oracle", src: "/logos/oracle.png", width: 110, height: 30 },
  { name: "Infosys", src: "/logos/infosys.png", width: 100, height: 34 },
  { name: "TCS", src: "/logos/tcs.jpg", width: 90, height: 32 },
  { name: "Wipro", src: "/logos/wipro.png", width: 100, height: 34 },
];

export default function CompanyLogosBar() {
  return (
    <section className="w-full bg-transparent py-4 sm:py-6">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Sleek Container with Reduced Roundness (rounded-xl sm:rounded-2xl) and Enhanced Size */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 shadow-xs">
          {/* Label */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xs sm:text-[14px] font-extrabold text-[#0B132B] tracking-tight whitespace-nowrap">
              Our Learners Work At
            </span>
          </div>

          {/* Logos Row with Enhanced Sizes & Colors */}
          <div className="w-full overflow-x-auto no-scrollbar flex-1">
            <div className="flex items-center justify-between min-w-[840px] gap-6 sm:gap-8 px-2">
              {logosList.map((logo, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center opacity-95 hover:opacity-100 transition-all duration-200 hover:scale-105"
                  title={logo.name}
                >
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    width={logo.width}
                    height={logo.height}
                    style={{ width: "auto", height: "auto" }}
                    className="object-contain max-h-7 sm:max-h-8 lg:max-h-9 max-w-[120px] mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

