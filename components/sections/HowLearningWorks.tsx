import { Hammer, MessageCircle, Rocket } from "lucide-react";

const features = [
  {
    icon: <Hammer className="text-purple-600 w-5 h-5" />,
    title: "Learn By Building",
    desc: "Ditch theoretical lectures. Ship production-grade applications to GitHub before you graduate.",
  },
  {
    icon: <MessageCircle className="text-purple-600 w-5 h-5" />,
    title: "Live Interactive Sessions",
    desc: "Attend expert-led sessions, ask questions in real-time, and collaborate with peers globally.",
  },
  {
    icon: <Rocket className="text-purple-600 w-5 h-5" />,
    title: "Career Acceleration",
    desc: "Daily job alerts, mock interviews, resume building, and direct connections with hiring partners.",
  },
];

export default function HowLearningWorks() {
  return (
    <section className="py-16 md:py-24 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#0F172A] leading-tight">
          How Learning Works At LLM Axis
        </h2>

        <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">

          {/* LEFT SIDE */}
          <div className="space-y-6 md:space-y-10">

            {features.map((item, i) => (
              <div key={i} className="flex gap-4 md:gap-5 items-start">

                {/* Icon */}
                <div className="min-w-[44px] h-11 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100">
                  {item.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-base md:text-xl font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#64748B] mt-1 md:mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

              </div>
            ))}

          </div>

          {/* RIGHT SIDE CARD */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">

            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A] leading-snug">
              Real-World{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                AI Solutions
              </span>
            </h3>

            <p className="text-sm md:text-base text-[#64748B] mt-3 md:mt-4 leading-relaxed">
              Work on hands-on industry challenges to build a portfolio that demonstrates your readiness for high-impact roles.
            </p>

            {/* Inner testimonial */}
            <div className="mt-6 md:mt-8 bg-[#F7F8FC] rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">

              <p className="text-[10px] md:text-xs text-purple-600 font-semibold tracking-wide">
                LEARNER STORY
              </p>

              <p className="text-sm md:text-base text-[#334155] mt-2 md:mt-3 italic leading-relaxed">
                &quot;The practical focus at LLM Axis is unmatched. I transitioned from a traditional backend role to an AI Engineer in 2 months, all thanks to the real projects and mentorship.&quot;
              </p>

              <p className="mt-3 md:mt-4 text-sm md:text-base font-semibold text-[#0F172A]">
                — David Chen
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}