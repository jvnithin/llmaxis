import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { JetBrains_Mono, Manrope, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-space",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-mono",
  preload: false,
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

const fontVars = `${jakarta.variable} ${manrope.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body
        className={`${jakarta.className} antialiased text-[#0F172A] bg-white`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
