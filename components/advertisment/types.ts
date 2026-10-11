export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: "bulb" | "users" | "rocket" | "chart";
  bgColor: string;
  iconColor: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  points: string[];
  imageSrc: string;
  imageAlt: string;
  cardBg: string;
  borderColor: string;
  badgeColor: string;
  arrowBg: string;
  fallbackType: "genai" | "llm" | "rag" | "agent";
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  imageSrc: string;
  linkedinUrl: string;
  initials: string;
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message?: string;
}
