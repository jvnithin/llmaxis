import Link from "next/link";

const WHATSAPP_NUMBER = "+918309782214"; // ← Replace with your number (country code + number, no + or spaces)
const WHATSAPP_MESSAGE = encodeURIComponent("Hii");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

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

      {/* WhatsApp Floating Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: "#25D366" }}
      >
        {/* WhatsApp SVG Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-8 h-8"
          fill="white"
          aria-hidden="true"
        >
          <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7A19.9 19.9 0 0 0 24 44c11 0 20-9 20-20S35 4 24 4zm0 36.5a16.4 16.4 0 0 1-8.4-2.3l-.6-.4-6.2 1.6 1.6-6-.4-.6A16.5 16.5 0 1 1 24 40.5zm9-12.3c-.5-.2-2.9-1.4-3.3-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.2 1.6-1.5 1.9-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3a14.2 14.2 0 0 1-2.6-3.2c-.3-.5 0-.7.2-1l.7-.8.4-.7.2-.6c0-.3-.1-.6-.2-.8L18.5 18c-.3-.8-.7-.7-1-.7h-.9c-.3 0-.8.1-1.2.6-.4.5-1.7 1.6-1.7 4s1.7 4.6 2 4.9c.2.3 3.4 5.2 8.2 7.3 1.2.5 2.1.8 2.8 1 1.2.4 2.2.3 3 .2.9-.1 2.9-1.2 3.3-2.3.4-1.2.4-2.1.3-2.3-.2-.2-.5-.3-1-.5z"/>
        </svg>

        {/* Pulse ring animation */}
        <span
          className="absolute inline-flex w-full h-full rounded-full opacity-50 animate-ping"
          style={{ backgroundColor: "#25D366" }}
        />
      </a>
    </>
  );
};

export default CTA;