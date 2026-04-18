const features = [
  {
    title: "Real-World Projects",
    desc: "Work on industry-level AI projects that build your portfolio.",
  },
  {
    title: "Expert Mentorship",
    desc: "Learn directly from professionals working in top tech companies.",
  },
  {
    title: "Career Support",
    desc: "Get resume guidance, interview prep, and job support.",
  },
];

export default function Features() {
  return (
    <section className="py-14 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0F172A] leading-tight">
          Why Choose LLM Axis?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-10 md:mt-16">
          {features.map((item, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 md:p-8 border rounded-xl md:rounded-2xl hover:shadow-lg transition text-left sm:text-center"
            >
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#0F172A]">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mt-2 md:mt-3 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}