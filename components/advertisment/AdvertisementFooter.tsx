"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Sparkles, CheckCircle2 } from "lucide-react";

export default function AdvertisementFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-700 pt-12 pb-8">
      <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-8">
          {/* Brand & Socials (Col 1-4) */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                <Image
                  src="/icon.png"
                  alt="LLM Axis Logo"
                  fill
                  sizes="36px"
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-[17px] text-[#0B132B] tracking-tight leading-none">
                  LLM AXIS
                </span>
                <span className="text-[9px] sm:text-[9.5px] uppercase font-bold text-[#8B5CF6] tracking-[0.18em] mt-0.5">
                  Learn · Build · Grow
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Empowering global careers through applied AI education and
              hands-on product development.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://www.linkedin.com/company/llm-axis"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-600 text-slate-500 flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-600 text-slate-500 flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-600 text-slate-500 flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-600 text-slate-500 flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-600 text-slate-500 flex items-center justify-center transition shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2v3.98h2v8.01z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns (Col 5-8) */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-4">
            {/* Programs */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B132B] mb-3">
                Programs
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link href="#programs" className="hover:text-purple-600 transition">Gen AI Foundation</Link></li>
                <li><Link href="#programs" className="hover:text-purple-600 transition">LLM Engineering</Link></li>
                <li><Link href="#programs" className="hover:text-purple-600 transition">RAG & Vector DBs</Link></li>
                <li><Link href="#programs" className="hover:text-purple-600 transition">AI Agents</Link></li>
                <li><Link href="/learning" className="hover:text-purple-600 transition">Full Stack AI</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B132B] mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link href="/learning" className="hover:text-purple-600 transition">Blogs</Link></li>
                <li><Link href="/learning" className="hover:text-purple-600 transition">Career Guides</Link></li>
                <li><Link href="/learning" className="hover:text-purple-600 transition">FAQs</Link></li>
                <li><Link href="/contact" className="hover:text-purple-600 transition">Events</Link></li>
                <li><Link href="/contact" className="hover:text-purple-600 transition">Community</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B132B] mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><Link href="/learning" className="hover:text-purple-600 transition">About Us</Link></li>
                <li><Link href="/hire" className="hover:text-purple-600 transition">Success Stories</Link></li>
                <li><Link href="/contact" className="hover:text-purple-600 transition">Contact</Link></li>
                <li><Link href="/refund-policy" className="hover:text-purple-600 transition">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-purple-600 transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Stay Updated Card (Col 9-12) */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center p-1.5 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#0B132B]">
                  Stay Updated
                </h4>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Get the latest on AI programs, hackathons, and global opportunities.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200/90 rounded-full pl-4 pr-12 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition shadow-2xs"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1.5 top-1.5 bottom-1.5 w-7 h-7 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center transition shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 sm:text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} LLM AXIS. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            <span>From India to Global AI Futures | Made with ❤️ for Learners Worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

