"use client";

const companies = [
  {
    name: "Oracle",
    logo: (
      <svg viewBox="0 0 120 40" className="h-8 w-auto" aria-label="Oracle">
        <rect x="2" y="8" width="46" height="24" rx="12" fill="none" stroke="#C74634" strokeWidth="5" />
        <text x="58" y="27" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="#C74634">ORACLE</text>
      </svg>
    ),
  },
  {
    name: "Amazon",
    logo: (
      <svg viewBox="0 0 110 40" className="h-8 w-auto" aria-label="Amazon">
        <text x="0" y="26" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="22" fill="#232F3E">amazon</text>
        <path d="M4 33 Q28 42 60 33" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <polygon points="60,30 66,33 60,37" fill="#FF9900"/>
      </svg>
    ),
  },
  {
    name: "Accenture",
    logo: (
      <svg viewBox="0 0 140 40" className="h-8 w-auto" aria-label="Accenture">
        <polygon points="8,8 18,20 8,32" fill="#A100FF"/>
        <text x="24" y="27" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="19" fill="#000">accenture</text>
      </svg>
    ),
  },
  {
    name: "TCS",
    logo: (
      <svg viewBox="0 0 160 40" className="h-8 w-auto" aria-label="TCS">
        <text x="0" y="30" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="28" fill="#5C068C">tcs</text>
        <text x="52" y="20" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#5C068C">TATA</text>
        <text x="52" y="30" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#5C068C">CONSULTANCY</text>
        <text x="52" y="40" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#5C068C">SERVICES</text>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    logo: (
      <svg viewBox="0 0 130 40" className="h-8 w-auto" aria-label="Microsoft">
        <rect x="0" y="4" width="14" height="14" fill="#F25022"/>
        <rect x="16" y="4" width="14" height="14" fill="#7FBA00"/>
        <rect x="0" y="20" width="14" height="14" fill="#00A4EF"/>
        <rect x="16" y="20" width="14" height="14" fill="#FFB900"/>
        <text x="36" y="26" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="16" fill="#737373">Microsoft</text>
      </svg>
    ),
  },
  {
    name: "Google",
    logo: (
      <svg viewBox="0 0 100 40" className="h-8 w-auto" aria-label="Google">
        <text x="0" y="28" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24" fill="#4285F4">G</text>
        <text x="16" y="28" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24" fill="#EA4335">o</text>
        <text x="30" y="28" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24" fill="#FBBC05">o</text>
        <text x="44" y="28" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24" fill="#4285F4">g</text>
        <text x="58" y="28" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24" fill="#34A853">l</text>
        <text x="66" y="28" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="24" fill="#EA4335">e</text>
      </svg>
    ),
  },
  {
    name: "Infosys",
    logo: (
      <svg viewBox="0 0 110 40" className="h-8 w-auto" aria-label="Infosys">
        <text x="0" y="27" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20" fill="#007CC3">Infosys</text>
        <rect x="0" y="30" width="80" height="3" fill="#FFC72C"/>
      </svg>
    ),
  },
  {
    name: "Wipro",
    logo: (
      <svg viewBox="0 0 90 40" className="h-8 w-auto" aria-label="Wipro">
        <circle cx="12" cy="20" r="10" fill="#59A608"/>
        <circle cx="12" cy="20" r="5" fill="#fff"/>
        <text x="28" y="27" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="20" fill="#59A608">wipro</text>
      </svg>
    ),
  },
];

// Duplicate for seamless loop
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

      {/* Fade masks on left & right */}
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{
            background: "linear-gradient(to right, #FDF8F2 0%, transparent 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{
            background: "linear-gradient(to left, #FDF8F2 0%, transparent 100%)",
          }}
        />

        {/* Scrolling track */}
        <div className="flex gap-5 marquee-track w-max">
          {allCompanies.map((company, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center bg-white rounded-2xl px-8 py-5 shadow-sm border border-gray-100"
              style={{ minWidth: "180px", height: "80px" }}
            >
              {company.logo}
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