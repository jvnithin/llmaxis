"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/toast";
import {
  ConsentGatedAnalytics,
  CookieBanner,
  CookieConsentProvider,
} from "@/components/cookies";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  // /advertisment, /learning, and /programs have self-contained headers & footers
  const content =
    pathname?.startsWith("/advertisment") ||
    pathname?.startsWith("/learning") ||
    pathname?.startsWith("/programs") ? (
      <main>{children}</main>
    ) : (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );

  return (
    <CookieConsentProvider>
      <ConsentGatedAnalytics />
      <ToastProvider>{content}</ToastProvider>
      <CookieBanner />
    </CookieConsentProvider>
  );
}
