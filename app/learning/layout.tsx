import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "12-Week GenAI & Agentic AI Program | LLM Axis",
  description:
    "Learn to design, build, and deploy real-world Generative AI and Agentic AI applications through hands-on projects, expert mentorship, and a practical 12-week learning journey.",
  keywords: [
    "GenAI program",
    "Agentic AI internship",
    "AI bootcamp India",
    "LLM training",
    "RAG LangChain CrewAI",
  ],
  openGraph: {
    title: "12-Week GenAI & Agentic AI Program | LLM Axis",
    description:
      "Get job-ready for the AI-powered future. Master Generative AI and Agentic AI with industry mentorship and hands-on projects.",
    url: "https://llmaxis.in/learning",
    siteName: "LLM Axis",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
