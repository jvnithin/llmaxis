import Link from "next/link";

const stats = [
  { number: "500+", label: "Companies" },
  { number: "6000+", label: "Learners" },
  { number: "3 Months", label: "To Industry Ready" },
];

const Hero = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center text-center bg-[#F7F8FC] overflow-hidden px-4">

      {/* Glow */}
      <div className="absolute top-[-120px] md:top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-300 opacity-20 blur-[100px] md:blur-[120px] rounded-full"></div>

      <div className="relative max-w-3xl mx-auto">

        {/* Badge */}
        <p className="inline-block px-3 md:px-4 py-1 text-[10px] md:text-xs bg-purple-100 text-purple-600 rounded-full mb-4 font-medium">
          AI Career Accelerator Program
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.2] tracking-tight">
          <span className="block md:inline whitespace-normal md:whitespace-nowrap">
            Craft your Career By Building
          </span>
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-transparent bg-clip-text">
            Real AI Projects
          </span>
        </h1>

        {/* Description */}
        <p className="text-[#64748B] mt-5 md:mt-6 text-base md:text-lg leading-relaxed px-2 md:px-0">
          Live training in AI with industry experts. Exclusively for NRIs. Get
          trained by industry experts and become job-ready for high-paying tech
          roles.
        </p>

        {/* CTA */}
        <nav className="mt-7 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 md:px-8 py-3 rounded-xl text-sm md:text-base font-semibold shadow-lg w-full sm:w-auto"
          >
            Book Free Consultation
          </Link>

          <Link
            href="/learning"
            className="border border-gray-300 bg-white px-6 md:px-8 py-3 rounded-xl text-sm md:text-base font-semibold w-full sm:w-auto"
          >
            View Programs
          </Link>
        </nav>

        {/* Trust line */}
        <p className="mt-5 md:mt-6 text-xs md:text-sm text-gray-400 px-2">
          ✔ Top 1% Mentors from DeepMind, Meta AI, and Google
        </p>
      </div>

      {/* Stats */}
      <section className="relative mt-12 md:mt-16 w-full px-2 md:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl md:rounded-2xl py-5 md:py-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                {item.number}
              </h2>
              <p className="text-[10px] md:text-sm text-gray-500 mt-1 md:mt-2 tracking-wide uppercase">
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