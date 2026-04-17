import { Hammer, MessageCircle, Rocket } from "lucide-react";

const features = [
  {
    icon: <Hammer className="text-purple-600" />,
    title: "Learn By Building",
    desc: "Ditch theoretical lectures. Ship production-grade applications to GitHub before you graduate.",
  },
  {
    icon: <MessageCircle className="text-purple-600" />,
    title: "Live Interactive Sessions",
    desc: "Attend expert-led sessions, ask questions in real-time, and collaborate with peers globally.",
  },
  {
    icon: <Rocket className="text-purple-600" />,
    title: "Career Acceleration",
    desc: "Daily job alerts, mock interviews, resume building, and direct connections with hiring partners.",
  },
];

export default function HowLearningWorks() {
  return (
    <section className="py-28 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#0F172A]">
          How Learning Works
        </h2>

        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-10">

            {features.map((item, i) => (
              <div key={i} className="flex gap-5">

                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                  {item.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="text-[#64748B] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

              </div>
            ))}

          </div>

          {/* RIGHT SIDE CARD */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">

            <h3 className="text-2xl font-semibold text-[#0F172A]">
              Real-World{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                AI Solutions
              </span>
            </h3>

            <p className="text-[#64748B] mt-4 leading-relaxed">
              Work on hands-on industry challenges to build a portfolio that demonstrates your readiness for high-impact roles.
            </p>

            {/* Inner testimonial */}
            <div className="mt-8 bg-[#F7F8FC] rounded-2xl p-6 border border-gray-100">

              <p className="text-xs text-purple-600 font-semibold tracking-wide">
                LEARNER STORY
              </p>

              <p className="text-[#334155] mt-3 italic leading-relaxed">
                &quot;The practical focus at LLM Axis is unmatched. I transitioned from a traditional backend role to an AI Engineer in 2 months, all thanks to the real projects and mentorship.&quot;
              </p>

              <p className="mt-4 font-semibold text-[#0F172A]">
                — David Chen
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}