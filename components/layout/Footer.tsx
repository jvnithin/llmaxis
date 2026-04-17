import Link from "next/link";

const WHATSAPP_NUMBER = "+918309782214"; // ← Replace with your number (country code + number, no + or spaces)
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hey, I'm interested to know more about Agentic AI course, let me know the details.",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6 text-center ">
        {/* Top Section */}
        <div className="flex justify-center mb-12">
          {/* Brand */}
          {/* <div>
            <h2 className="text-xl font-semibold">llmaxis</h2>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Building future-ready professionals through AI-focused education
              and real-world learning experiences.
            </p>
          </div> */}

          {/* Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/learning">LLM AXIS Learning</Link>
              </li>
              <li>
                <Link href="/hire">Hire Talent</Link>
              </li>
              <li>
                <Link href="/contact">Contact US</Link>
              </li>
              <Link href="/terms-and-conditions">Terms & Conditions</Link>
              <br />
              <Link href="/refund-policy">Refund Policy</Link>
            </ul>
          </div>

          {/* Programs */}
          {/* <div>
            <h3 className="text-sm font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#">AI Bootcamp</Link>
              </li>
              <li>
                <Link href="#">Full Stack + AI</Link>
              </li>
              <li>
                <Link href="#">Data Science</Link>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          {/* <div>
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-400">official@llmaxis.in</p>
            <p className="text-sm text-gray-400 mt-2">India</p>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} llmaxis. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms-and-condition">Privacy Policy</Link>
            <Link href="/refund-policy">Terms</Link>
          </div>
        </div>
        {/* WhatsApp Floating Button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: "#25D366" }}
        >
          {/* Tooltip */}
          <span className="absolute bottom-16 bg-black text-white text-xs px-3 py-1 rounded-md whitespace-nowrap shadow-md">
            Click here to Learn
          </span>

          {/* WhatsApp SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-8 h-8"
            fill="white"
          >
            <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7A19.9 19.9 0 0 0 24 44c11 0 20-9 20-20S35 4 24 4zm0 36.5a16.4 16.4 0 0 1-8.4-2.3l-.6-.4-6.2 1.6 1.6-6-.4-.6A16.5 16.5 0 1 1 24 40.5zm9-12.3c-.5-.2-2.9-1.4-3.3-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.2 1.6-1.5 1.9-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3a14.2 14.2 0 0 1-2.6-3.2c-.3-.5 0-.7.2-1l.7-.8.4-.7.2-.6c0-.3-.1-.6-.2-.8L18.5 18c-.3-.8-.7-.7-1-.7h-.9c-.3 0-.8.1-1.2.6-.4.5-1.7 1.6-1.7 4s1.7 4.6 2 4.9c.2.3 3.4 5.2 8.2 7.3 1.2.5 2.1.8 2.8 1 1.2.4 2.2.3 3 .2.9-.1 2.9-1.2 3.3-2.3.4-1.2.4-2.1.3-2.3-.2-.2-.5-.3-1-.5z" />
          </svg>

          {/* Pulse */}
          <span
            className="absolute inline-flex w-full h-full rounded-full opacity-50 animate-ping"
            style={{ backgroundColor: "#25D366" }}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
