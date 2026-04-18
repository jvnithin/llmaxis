import Hero from "@/components/sections/Hero";
import CaseStudies from "@/components/sections/CaseStudies";
import Testimonials from "@/components/sections/Testimonials";
import LeadForm from "@/components/sections/LeadForm";
import CTA from "@/components/sections/CTA";
import Programs from "@/components/sections/programs";
import HowLearningWorks from "@/components/sections/HowLearningWorks";
import Features from "@/components/sections/Features";
import CompanyLogos from "@/components/sections/CompanyLogos";

export const metadata = {
  title: "AI Bootcamp in India | Learn AI with Real Projects | LLM Axis",
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
    title: "AI Bootcamp | LLM Axis",
    description:
      "Learn AI with real-world projects and expert mentorship.",
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
      <Hero />
      <HowLearningWorks />
      <Programs />
      <Features />
      <CaseStudies />
      <CompanyLogos />
      <Testimonials />
      <LeadForm />
      <CTA />
    </main>
  );
}