const steps = [
  {
    title: "Join Program",
    desc: "Enroll and get access to structured roadmap.",
  },
  {
    title: "Build Projects",
    desc: "Work on real-world AI applications.",
  },
  {
    title: "Get Mentored",
    desc: "Receive guidance from industry experts.",
  },
  {
    title: "Get Placed",
    desc: "Prepare and land your dream job.",
  },
];

export default function Process() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold text-[#0F172A]">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-16">

          {steps.map((item, i) => (
            <div key={i} className="p-6">
              <div className="w-10 h-10 mx-auto flex items-center justify-center bg-purple-600 text-white rounded-full mb-4">
                {i + 1}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}