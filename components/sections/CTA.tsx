import Link from "next/link";

const CTA = () => {
  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
            Ready to Build Your Future in AI?
          </h2>

          {/* Subtext */}
          <p className="text-[#64748B] mt-6 text-lg md:text-xl">
            Join our programs and start building real-world AI projects with expert guidance.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link
              href="/learning"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition"
            >
              Get Started Now
            </Link>
          </div>

        </div>
      </section>

      
    </>
  );
};

export default CTA;