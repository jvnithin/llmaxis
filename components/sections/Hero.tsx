import Link from "next/link";

const stats = [
  { number: "1200+", label: "Companies" },
  { number: "10000+", label: "Learners" },
  // { number: "85%", label: "Jobs Secured" },
  { number: "3 Weeks", label: "Avg Time to Offer" },
];

const Hero = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center text-center bg-[#F7F8FC] overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-300 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative max-w-3xl mx-auto px-6">
        {/* Badge */}
        <p className="inline-block px-4 py-1 text-xs bg-purple-100 text-purple-600 rounded-full mb-4 font-medium">
          AI Career Accelerator Program
        </p>

        {/* ✅ Main SEO Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.2] tracking-tight">
          <span className="whitespace-nowrap">
            Craft your Career By Building
          </span>{" "}
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">
            Real AI Projects
          </span>
        </h1>

        {/* ✅ Keyword-optimized description */}
        <p className="text-[#64748B] mt-6 text-lg leading-relaxed">
          Live training in AI with industry experts. Exclusively for NRIs. Get
          trained by industry experts and become job-ready for high-paying tech
          roles.
        </p>

        {/* CTA */}
        <nav
          className="mt-8 flex justify-center gap-4 flex-wrap"
          aria-label="Primary actions"
        >
          <Link
            href="/contact"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg"
          >
            Book Free Consultation
          </Link>

          <Link
            href="/learning"
            className="border border-gray-300 bg-white px-8 py-3 rounded-xl text-base font-semibold"
          >
            View Programs
          </Link>
        </nav>

        {/* Trust line */}
        <p className="mt-6 text-sm text-gray-400">
          ✔ Top 1% Mentors from DeepMind, Meta AI, and Google
        </p>
      </div>

      {/* Stats */}
      
      <section
        className="relative mt-16 w-full px-6" aria-label="Program statistics">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl py-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                {item.number}
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-2 tracking-wide uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </header>
  );
};

export default Hero;
