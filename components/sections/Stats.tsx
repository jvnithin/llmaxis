const stats = [
  { number: "1000+", label: "Students Trained" },
  { number: "50+", label: "Projects Built" },
  { number: "90%", label: "Placement Rate" },
];

export default function Stats() {
  return (
    <section className="py-20 bg-[#F7F8FC]">
      <div className="max-w-5xl mx-auto px-6 text-center grid md:grid-cols-3 gap-8">

        {stats.map((item, i) => (
          <div key={i}>
            <h3 className="text-4xl font-bold text-purple-600">
              {item.number}
            </h3>
            <p className="text-gray-500 mt-2">{item.label}</p>
          </div>
        ))}

      </div>
    </section>
  );
}