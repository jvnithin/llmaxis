import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Suman",
    role: "Data Scientist @ Uber",
    initials: "SM",
    text: "Aura doesn't simplify things; they clarify them. The depth of the curriculum regarding Neural Networks is unmatched by any other bootcamp.",
  },
  {
    name: "Nandhini",
    role: "AI Engineer @ Stripe",
    initials: "DC",
    text: "The practical focus on LLMs was exactly what I needed. I transitioned from a traditional backend role to an AI Engineer position within 2 months of graduating.",
  },
  {
    name: "Mohan",
    role: "Product Manager @ Microsoft",
    initials: "JW",
    text: "Best investment for my career. The mentors alone are worth the price. Highly recommended.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A]">
          Stories from{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Learners
          </span>
        </h2>

        <p className="text-[#64748B] mt-4 text-lg">
          Real stories from professionals who transformed their careers with us
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition border border-gray-100 text-left"
            >

              {/* Stars */}
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[#334155] mt-4 leading-relaxed">
                “{item.text}”
              </p>

              {/* User */}
              <div className="mt-6 flex items-center gap-4">

                {/* Avatar */}
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
                  {item.initials}
                </div>

                {/* Info */}
                <div>
                  <h4 className="font-semibold text-[#0F172A]">
                    {item.name}
                  </h4>
                  <p className="text-sm text-[#64748B]">
                    {item.role}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}