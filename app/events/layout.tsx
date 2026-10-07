import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Masterclasses | Beyond ChatGPT: Generative & Agentic AI | LLM Axis",
  description:
    "Join our live masterclass 'Beyond ChatGPT: How AI Is Learning to Think, Act & Work'. Explore AI agents, MCP, RAG, and hands-on GenAI demonstrations with LLM Axis.",
  keywords: [
    "AI Masterclass",
    "Agentic AI Workshop",
    "Beyond ChatGPT",
    "LLM Axis Events",
    "AI Agents",
    "Model Context Protocol",
    "Generative AI Webinar",
  ],
  openGraph: {
    title: "Beyond ChatGPT: How AI Is Learning to Think, Act & Work | LLM Axis Live Event",
    description:
      "Join our live practical masterclass exploring AI Agents, MCP, RAG, and tools. Discover what you can build with Agentic AI.",
    url: "https://llmaxis.in/events",
    siteName: "LLM Axis",
    images: [
      {
        url: "/event-poster.jpg",
        width: 1200,
        height: 630,
        alt: "Beyond ChatGPT Event Poster",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
