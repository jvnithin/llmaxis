import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  metadataBase: new URL("https://llmaxis.in"),

  title: {
    default: "LLM Axis - AI Learning & Product Development",
    template: "%s | LLM Axis",
  },

  description:
    "Learn AI by building real-world projects. Join LLM Axis to become job-ready with expert mentorship and hands-on experience.",

  keywords: [
    "AI course",
    "AI bootcamp India",
    "learn artificial intelligence",
    "full stack AI",
    "AI projects",
    "AI training with placement",
    "AI development company India"
  ],

  // ✅ Canonical (VERY IMPORTANT)
  alternates: {
    canonical: "https://llmaxis.in",
  },

  openGraph: {
    title: "LLM Axis - AI Learning & Product Development",
    description:
      "Build real-world AI projects and become job-ready with LLM Axis.",
    url: "https://llmaxis.in",
    siteName: "LLM Axis",
    images: [
      {
        url: "/public/logo.jpeg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "LLM Axis - AI Bootcamp",
    description:
      "Build real-world AI projects and become job-ready.",
    images: ["/og-image.png"],
  },

  // ✅ Robots control
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ✅ Icons (IMPORTANT for branding + SEO trust)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  // ✅ Basic verification placeholder (add later)
  verification: {
    google: "2fLL8yF7-HtGGRh...",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}