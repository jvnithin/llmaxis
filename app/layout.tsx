import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import MetaPixel from "@/components/analytics/MetaPixel";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
    "AI development company India",
  ],

  // ✅ Canonical
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
        url: "/logo.jpeg",
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
    description: "Build real-world AI projects and become job-ready.",
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

  // ✅ Icons - Uses public/favicon.ico
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

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
    <html lang="en" className={font.className}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${font.className} antialiased text-[#0F172A] bg-white`}>
        <MetaPixel />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}