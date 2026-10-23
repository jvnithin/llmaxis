import "@/components/home/home.css";
import HomeClientWrapper from "@/components/home/HomeClientWrapper";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhySection from "@/components/home/WhySection";
import ExperienceSection from "@/components/home/ExperienceSection";
import StoriesSection from "@/components/home/StoriesSection";
import ContactSection from "@/components/home/ContactSection";

export const metadata = {
  title: "AI Bootcamp | Learn AI with Real Projects | LLM Axis",
  description:
    "Join LLM Axis AI Bootcamp to learn machine learning, automation, and full-stack AI development through real-world projects, expert mentorship, and job-ready training.",

  keywords: [
    "AI bootcamp India",
    "learn AI online",
    "machine learning course India",
    "AI training with projects",
    "full stack AI development",
    "AI career program",
  ],

  metadataBase: new URL("https://llmaxis.in"),

  openGraph: {
    title: "LLM Axis - AI Bootcamp & Real-World Projects",
    description:
      "Build real-world AI projects, learn from top mentors, and get job-ready with LLM Axis.",
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
    title: "AI Bootcamp | LLM Axis",
    description: "Learn AI with real-world projects and expert mentorship.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main>
      <HomeClientWrapper>
        <HeroSection />
        <ServicesSection />
        <WhySection />
        <ExperienceSection />
        <StoriesSection />
        <ContactSection />
      </HomeClientWrapper>
    </main>
  );
}
