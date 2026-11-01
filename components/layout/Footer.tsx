import Link from "next/link";

const FALLBACK_WHATSAPP_URL = `https://wa.me/918309782214?text=${encodeURIComponent(
  "Hey, I'm interested to know more about Agentic AI course, let me know the details."
)}`;

function socialHref(value: string | undefined) {
  const url = (value || "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
}

const WHATSAPP_URL = socialHref(process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL) || FALLBACK_WHATSAPP_URL;

const SOCIAL_LINKS = [
  { label: "Facebook", href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL), icon: "facebook" },
  { label: "Instagram", href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL), icon: "instagram" },
  {
    label: "LinkedIn",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL) || socialHref(process.env.NEXT_PUBLIC_LLM_AXIS_LINKEDIN_URL),
    icon: "linkedin",
  },
  { label: "WhatsApp", href: WHATSAPP_URL, icon: "whatsapp" },
];

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Top Section */}
        <div className="flex justify-center md:justify-center mb-10">
          {/* Brand */}
          {/* <div>
            <h2 className="text-xl font-semibold">llmaxis</h2>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Building future-ready professionals through AI-focused education
              and real-world learning experiences.
            </p>
          </div> */}
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              Company
            </h3>

            <ul className="space-y-3 text-sm md:text-base text-gray-400">
              <li>
                <Link href="/learning" className="hover:text-white transition">
                  LLM AXIS Learning
                </Link>
              </li>
              <li>
                <Link href="/hire" className="hover:text-white transition">
                  Hire Talent
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
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
        <div className="border-t border-gray-700 pt-6 flex flex-col items-center gap-4 text-sm text-gray-400 text-center md:flex-row md:justify-between md:text-left">

          <p>
            © {new Date().getFullYear()} llmaxis. All rights reserved.
          </p>

          <div className="flex items-center justify-end gap-2.5 self-end md:self-auto" aria-label="Social links">
            {SOCIAL_LINKS.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/35 bg-white/[0.04] text-white transition hover:border-white/70 hover:bg-white/10"
                >
                  <SocialIcon name={item.icon} />
                </a>
              ) : (
                <span
                  key={item.label}
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/35 bg-white/[0.04] text-white"
                >
                  <SocialIcon name={item.icon} />
                </span>
              )
            )}
          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: "#25D366" }}
        >
          {/* Tooltip */}
          <span className="pointer-events-none absolute bottom-14 md:bottom-16 text-[10px] md:text-xs bg-black text-white px-2 md:px-3 py-1 rounded-md whitespace-nowrap shadow-md">
            Click here to Learn
          </span>

          {/* WhatsApp Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-6 h-6 md:w-8 md:h-8"
            fill="white"
          >
            <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7A19.9 19.9 0 0 0 24 44c11 0 20-9 20-20S35 4 24 4zm0 36.5a16.4 16.4 0 0 1-8.4-2.3l-.6-.4-6.2 1.6 1.6-6-.4-.6A16.5 16.5 0 1 1 24 40.5zm9-12.3c-.5-.2-2.9-1.4-3.3-1.6-.5-.2-.8-.2-1.1.2-.3.5-1.2 1.6-1.5 1.9-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3a14.2 14.2 0 0 1-2.6-3.2c-.3-.5 0-.7.2-1l.7-.8.4-.7.2-.6c0-.3-.1-.6-.2-.8L18.5 18c-.3-.8-.7-.7-1-.7h-.9c-.3 0-.8.1-1.2.6-.4.5-1.7 1.6-1.7 4s1.7 4.6 2 4.9c.2.3 3.4 5.2 8.2 7.3 1.2.5 2.1.8 2.8 1 1.2.4 2.2.3 3 .2.9-.1 2.9-1.2 3.3-2.3.4-1.2.4-2.1.3-2.3-.2-.2-.5-.3-1-.5z" />
          </svg>

          {/* Pulse */}
          <span
            className="pointer-events-none absolute inline-flex w-full h-full rounded-full opacity-40 animate-ping"
            style={{ backgroundColor: "#25D366" }}
          />
        </a>

      </div>
    </footer>
  );
};

function SocialIcon({ name }: { name: string }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M14.2 8.2h-2.1v-1c0-.5.3-.7.8-.7h1.3V4.2h-2.1C10 4.2 8.8 5.5 8.8 7.4v.8H7.2V11h1.6v7.2h2.6V11h2.2l.4-2.8h-2.6V8.2Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4.5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M5.2 8.7h3.1V19H5.2V8.7ZM6.75 5a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1ZM10.4 8.7h3v1.4h.04c.42-.8 1.44-1.64 2.97-1.64 3.18 0 3.77 2.1 3.77 4.82V19h-3.1v-4.55c0-1.08-.02-2.48-1.51-2.48-1.52 0-1.75 1.18-1.75 2.4V19h-3.1V8.7Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.86 9.86 0 0 0 4.77 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

export default Footer;