"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // /advertisment is a self-contained campaign landing page with its own AdvertisementFooter
  if (pathname?.startsWith("/advertisment")) {
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
