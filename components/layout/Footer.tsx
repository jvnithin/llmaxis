import Image from "next/image";
import Link from "next/link";
import "./footer.css";

const FALLBACK_WHATSAPP_URL = `https://wa.me/918309782214?text=${encodeURIComponent(
  "Hey, I'm interested to know more about Agentic AI course, let me know the details.",
)}`;

function socialHref(value: string | undefined) {
  const url = (value || "").trim();
  return /^https?:\/\//i.test(url) ? url : "";
}

const WHATSAPP_URL =
  socialHref(process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL) || FALLBACK_WHATSAPP_URL;

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL),
    icon: "/images/footer/instagram.svg",
  },
  {
    label: "Facebook",
    href: socialHref(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL),
    icon: "/images/footer/facebook.svg",
  },
  {
    label: "LinkedIn",
    href:
      socialHref(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL) ||
      socialHref(process.env.NEXT_PUBLIC_LLM_AXIS_LINKEDIN_URL),
    icon: "/images/footer/linkedin.svg",
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: "/images/footer/whatsapp.svg",
  },
];

const COMPANY_LINKS = [
  { label: "Our Program", href: "/learning" },
  { label: "Hire Talent", href: "/hire" },
  { label: "Contact Us", href: "/contact" },
];

const RESOURCE_LINKS = [
  { label: "Free Roadmaps", href: "/blogs?tab=roadmaps" },
  { label: "Articles", href: "/blogs?tab=articles" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-glow" aria-hidden="true" />
      <div className="site-footer-glow site-footer-glow-side" aria-hidden="true" />

      <div className="site-footer-shell">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link href="/" className="site-footer-logo" aria-label="LLM Axis home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/footer/logo.png" alt="LLM Axis" width={70} height={40} />
            </Link>
            <div className="site-footer-brand-copy">
              <h2>LLM Axis</h2>
              <p>Pioneering Generative &amp; Agentic AI Education</p>
            </div>
            <p className="site-footer-desc">
              The premier immersive accelerator for Generative AI &amp; Agentic AI
              engineering. 12 guided weeks of hands-on production architectures and
              real-world system deployments.
            </p>
          </div>

          <div className="site-footer-col site-footer-col-company">
            <h3 className="site-footer-heading">Company</h3>
            <ul className="site-footer-links">
              {COMPANY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col site-footer-col-resources">
            <h3 className="site-footer-heading">Resources</h3>
            <ul className="site-footer-links">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col site-footer-col-connect">
            <h3 className="site-footer-heading">Connect With Us</h3>
            <div className="site-footer-contact">
              <a className="site-footer-contact-row" href="tel:+918309782214">
                <span className="site-footer-icon">
                  <Image src="/images/footer/phone.svg" alt="" width={14} height={14} unoptimized />
                </span>
                +91 8309782214
              </a>
              <a className="site-footer-contact-row" href="mailto:team@llmaxis.in">
                <span className="site-footer-icon">
                  <Image src="/images/footer/email.svg" alt="" width={14} height={14} unoptimized />
                </span>
                team@llmaxis.in
              </a>
            </div>

            <div className="site-footer-channels">
              <p className="site-footer-channels-label">Follow our channels</p>
              <div className="site-footer-socials" aria-label="Social links">
                {SOCIAL_LINKS.map((item) =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="site-footer-social"
                    >
                      <Image src={item.icon} alt="" width={16} height={16} unoptimized />
                    </a>
                  ) : (
                    <span
                      key={item.label}
                      aria-label={item.label}
                      className="site-footer-social"
                    >
                      <Image src={item.icon} alt="" width={16} height={16} unoptimized />
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} LLM Axis. All rights reserved.</p>
          <div className="site-footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Condition</Link>
          </div>
        </div>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="site-footer-whatsapp"
      >
        <span className="site-footer-whatsapp-tip">Click here to Learn</span>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden="true">
          <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.86 9.86 0 0 0 4.77 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
        </svg>
        <span className="site-footer-whatsapp-pulse" aria-hidden="true" />
      </a>
    </footer>
  );
}
