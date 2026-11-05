import type { Metadata } from "next";
import { CareersPage } from "@/components/careers";

export const metadata: Metadata = {
  title: "Careers at LLM Axis | Open Roles",
  description:
    "Join LLM Axis. Explore open roles across Engineering & Training, Sales & Business Development, and Marketing & Communications.",
  alternates: {
    canonical: "https://llmaxis.in/careers",
  },
};

export default function CareersRoutePage() {
  return <CareersPage />;
}
