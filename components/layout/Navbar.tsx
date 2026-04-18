"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[999] bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="LLM Axis Logo"
            width={80}
            height={60}
            className="object-contain md:w-[100px] md:h-[80px]"
          />
          <span className="font-semibold text-base md:text-lg text-[#0F172A]">
            LLM Axis
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-[#334155]">
          <Link href="/learning">LLM Axis Learning</Link>
          <Link href="/hire">Hire Talent</Link>
          <Link href="/contact">Contact US</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/learning"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-full left-0 w-full z-[999]">
          <div className="px-5 py-6 space-y-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block text-base font-medium text-gray-700"
            >
              Home
            </Link>

            <Link
              href="/learning"
              onClick={() => setOpen(false)}
              className="block text-base font-medium text-gray-700"
            >
              LLM Axis Learning
            </Link>

            <Link
              href="/hire"
              onClick={() => setOpen(false)}
              className="block text-base font-medium text-gray-700"
            >
              Hire Talent
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block text-base font-medium text-gray-700"
            >
              Contact Us
            </Link>

            {/* Divider */}
            <div className="border-t pt-4">
              <Link
                href="/learning"
                onClick={() => setOpen(false)}
                className="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-full text-sm font-semibold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
