import { ArrowRight } from "lucide-react";
import Link from "next/link";
const programs = [
  {
    title: "Gen AI & Agentic AI Program",
    desc: "Master AI development with hands-on real-world projects.",
    link: "/learning",
  },
  // {
  //   title: "Full Stack + AI",
  //   desc: "Build scalable apps integrated with AI capabilities.",
  // },
  // {
  //   title: "Data Science & ML",
  //   desc: "Learn data-driven decision making and machine learning.",
  // },
];

const Programs = () => {
  return (
    <section className="py-20 bg-white" aria-labelledby="programs-heading">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          {/* ✅ Better SEO heading */}
          <h2
            id="programs-heading"
            className="text-3xl md:text-4xl font-bold text-[#0F172A]"
          >
            Gen AI & Agentic AI Program
          </h2>

          {/* ✅ Keyword enriched description */}
          <p className="text-[#64748B] mt-3">
            Industry-focused AI, machine learning, and full-stack development
            programs designed to make you job-ready.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-1 gap-6">
          {programs.map((item, index) => (
            <article
              key={index}
              className="group border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-xl transition-all duration-300 "
            >
              {/* Icon */}
              {/* <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-4">
                {index + 1}
              </div> */}

              {/* ✅ Program title as heading */}
              <h3 className="text-lg font-semibold text-[#0F172A]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#64748B] mt-2">{item.desc}</p>

              {/* CTA */}
              <Link href={item.link}>
                <div className="mt-4 flex items-center text-purple-600 font-medium text-sm">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
