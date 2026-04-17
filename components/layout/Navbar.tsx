"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" target="/" >
        <div className="flex items-center gap-3">
          
           <div className="flex items-center gap-3">
  <Image
    src="/logo.jpeg"
    alt="LLM Axis Logo"
    width={100}
    height={80}
    className="object-contain"
  />
</div>
         
          <span className="font-semibold text-lg text-[#0F172A]">
            LLM Axis
          </span>
        </div>
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
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-6">

          <div className="flex flex-col gap-4 text-sm font-medium text-[#334155] mt-4">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/learning" onClick={() => setOpen(false)}>LLM Axis Learning</Link>
            <Link href="/hire" onClick={() => setOpen(false)}>Hire Talent</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact US</Link>
          </div>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-full text-sm font-medium"
          >
            Get Started
          </Link>

        </div>
      )}
    </nav>
  );
};

export default Navbar;