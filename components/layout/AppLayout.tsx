"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // /advertisment, /learning, and /programs have self-contained headers & footers
  if (
    pathname?.startsWith("/advertisment") ||
    pathname?.startsWith("/learning") ||
    pathname?.startsWith("/programs")
  ) {
    return <main>{children}</main>;
  }

  // Standard pages include the global Navbar and Footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
