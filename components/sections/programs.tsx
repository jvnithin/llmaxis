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
    <section
      className="py-14 md:py-20 bg-white"
      aria-labelledby="programs-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2
            id="programs-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] leading-tight"
          >
            Gen AI & Agentic AI Program
          </h2>

          <p className="text-[#64748B] mt-2 md:mt-3 text-sm sm:text-base max-w-xl mx-auto">
            Industry-focused AI, machine learning, and full-stack development
            programs designed to make you job-ready.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {programs.map((item, index) => (
            <article
              key={index}
              className="group border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-6 bg-white hover:shadow-lg md:hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              {/* <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-4">
                {index + 1}
              </div> */}

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#0F172A]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-[#64748B] mt-1 md:mt-2 leading-relaxed">
                {item.desc}
              </p>

              {/* CTA BUTTON */}
              <Link href={item.link}>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg hover:opacity-90 transition">
                  Learn More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
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