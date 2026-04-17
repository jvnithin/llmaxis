"use client";

import Image from "next/image";

const companies = [
  { name: "Oracle",      logo: "/logos/oracle.png" },
  { name: "Amazon",      logo: "/logos/amazon.jpg" },
  { name: "Accenture",   logo: "/logos/accenture.jpg" },
  { name: "TCS",         logo: "/logos/tcs.jpg" },
  { name: "Microsoft",   logo: "/logos/microsoft.png" },
  { name: "Google",      logo: "/logos/google.png" },
  { name: "Infosys",     logo: "/logos/infosys.png" },
  { name: "Wipro",       logo: "/logos/wipro.png" },
];

const allCompanies = [...companies, ...companies];

export default function CompanyLogos() {
  return (
    <section
      className="w-full py-10"
      style={{ backgroundColor: "#FDF8F2" }}
      aria-label="Learners from top companies"
    >
      <p className="text-center text-sm font-medium text-gray-500 mb-6 tracking-wide">
        Learners from top companies:
      </p>

      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{ background: "linear-gradient(to right, #FDF8F2 0%, transparent 100%)" }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{ background: "linear-gradient(to left, #FDF8F2 0%, transparent 100%)" }}
        />

        {/* Scrolling track */}
        <div className="flex gap-5 marquee-track w-max">
          {allCompanies.map((company, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100"
              style={{ minWidth: "180px", height: "80px" }}
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={120}
                height={40}
                className="object-contain h-8 w-auto"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-track {
          animation: marquee 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}