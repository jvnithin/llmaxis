const caseStudies = [
  {
    title: "AI Chatbot for Business",
    result: "Reduced customer support time by 40%",
  },
  {
    title: "E-commerce AI Recommender",
    result: "Increased sales by 25%",
  },
  {
    title: "Automation Tool",
    result: "Saved 15+ hours/week",
  },
];

export default function CaseStudies() {
  return (
    <section className="py-24 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold text-[#0F172A]">
          Real Results from Real Projects
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {caseStudies.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-purple-600 mt-2 font-medium">
                {item.result}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}