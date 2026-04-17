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
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">
          Why Choose LLM Axis?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((item, i) => (
            <div key={i} className="p-8 border rounded-2xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-500 mt-3">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}