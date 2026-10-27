"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLearning = pathname === "/learning" || pathname === "/programs";

  return (
    <header className="site-header">
      <div className="nav-wrap">
        {/* Brand Logo (from newllm2) */}
        <Link className="brand" href="/" aria-label="LLM Axis home">
          <Image
            src="/MainLogo.png"
            alt="LLM Axis"
            width={130}
            height={47}
            priority
            className="brand-logo"
          />
        </Link>

        {/* Center Nav Links (Previous sections: Our Programs, Hire Talent, Contact Us) */}
        <nav
          className={open ? "nav-links open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <Link
            href="/learning"
            className={isLearning ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Our Programs
          </Link>
          <Link
            href="/hire"
            className={pathname === "/hire" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Hire Talent
          </Link>
          <Link
            href="/contact"
            className={pathname === "/contact" ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Contact Us
          </Link>

          {/* Mobile-only CTA in dropdown */}
          <Link
            href={isLearning ? "#enroll" : "/learning"}
            className="nav-mobile-cta"
            style={{ display: "none" }}
            onClick={() => setOpen(false)}
          >
            Get Started →
          </Link>
        </nav>

        {/* Desktop CTA Button (Get Started with arrow icon) */}
        <Link
          className="button-nav"
          href={isLearning ? "#enroll" : "/learning"}
          onClick={() => setOpen(false)}
        >
          Get Started
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="menu-button"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
