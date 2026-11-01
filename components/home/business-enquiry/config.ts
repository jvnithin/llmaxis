export const BUSINESS_ROLES = [
  "Founder / Co-Founder",
  "CEO / CTO / CXO",
  "Business Owner",
  "HR / L&D Manager",
  "IT Manager / Technical Lead",
  "Working Professional",
  "Other",
] as const;

const START_OPTIONS = [
  "Immediately",
  "Within 1 month",
  "Within 3 months",
  "Within 6 months",
  "Not sure yet",
];

export type EnquiryField = {
  id: string;
  label: string;
  type: "select" | "textarea" | "text";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type BusinessService = {
  id: string;
  title: string;
  enquiryLabel: string;
  objective: string;
  fields: EnquiryField[];
};

export const BUSINESS_SERVICES: BusinessService[] = [
  {
    id: "training",
    title: "AI Education & Corporate Training",
    enquiryLabel: "Training enquiry",
    objective:
      "Understand the training requirements, audience, and learning goals.",
    fields: [
      {
        id: "trainingType",
        label: "What type of training are you looking for?",
        type: "select",
        required: true,
        options: [
          "Corporate AI Training",
          "Generative AI Training",
          "Agentic AI Training",
          "AI for Business Leaders",
          "Individual AI Upskilling",
          "Customized Training",
        ],
      },
      {
        id: "audience",
        label: "Who is the target audience?",
        type: "select",
        required: true,
        options: [
          "Developers / Engineers",
          "Business Teams",
          "Managers / Leadership",
          "Freshers / Students",
          "Entire Organization",
        ],
      },
      {
        id: "headcount",
        label: "Approximately how many people need training?",
        type: "select",
        required: true,
        options: ["1–10", "11–25", "26–50", "51–100", "100+"],
      },
      {
        id: "knowledge",
        label: "What is the current AI knowledge level?",
        type: "select",
        required: true,
        options: ["Beginner", "Intermediate", "Advanced", "Mixed skill levels"],
      },
      {
        id: "objectives",
        label: "What are your primary training objectives?",
        type: "select",
        required: true,
        options: [
          "AI awareness and adoption",
          "Employee productivity",
          "Building AI applications",
          "Developing AI engineers",
          "Automating business workflows",
        ],
      },
      {
        id: "format",
        label: "Preferred training format?",
        type: "select",
        required: true,
        options: ["Live Online", "On-site", "Hybrid"],
      },
      {
        id: "start",
        label: "When would you like to start?",
        type: "select",
        required: true,
        options: START_OPTIONS,
      },
    ],
  },
  {
    id: "solutions",
    title: "AI Solutions",
    enquiryLabel: "Solution enquiry",
    objective:
      "Identify business challenges and potential AI implementation opportunities.",
    fields: [
      {
        id: "solutionType",
        label: "What type of AI solution are you looking for?",
        type: "select",
        required: true,
        options: [
          "AI Agents",
          "Business Process Automation",
          "Custom AI Application Development",
          "AI Chatbots / Virtual Assistants",
          "RAG / Knowledge Management Systems",
          "Enterprise AI Integration",
          "Not sure – Need guidance",
        ],
      },
      {
        id: "problem",
        label: "What business problem are you trying to solve?",
        type: "textarea",
        required: true,
        placeholder: "Describe the workflow, bottleneck, or outcome you want to change.",
      },
      {
        id: "department",
        label: "Which department or business function needs AI automation?",
        type: "select",
        required: true,
        options: [
          "Sales & Marketing",
          "Customer Support",
          "HR & Recruitment",
          "Finance & Operations",
          "IT & Engineering",
          "Multiple Departments",
        ],
      },
      {
        id: "currentTools",
        label: "Are you currently using any AI tools or solutions?",
        type: "select",
        required: true,
        options: ["Yes", "No", "Exploring options"],
      },
      {
        id: "platforms",
        label: "What systems or platforms do you currently use?",
        type: "text",
        required: true,
        placeholder: "For example: Salesforce, SAP, Slack, internal tools.",
      },
      {
        id: "outcome",
        label: "What is your expected outcome?",
        type: "select",
        required: true,
        options: [
          "Reduce operational costs",
          "Improve productivity",
          "Automate repetitive tasks",
          "Improve customer experience",
          "Build a new AI-powered product",
          "Other",
        ],
      },
      {
        id: "timeline",
        label: "When are you planning to implement this solution?",
        type: "select",
        required: true,
        options: [
          "Immediately",
          "Within 1 month",
          "Within 3 months",
          "Exploring / Researching",
        ],
      },
    ],
  },
  {
    id: "consulting",
    title: "AI Consulting",
    enquiryLabel: "Consulting enquiry",
    objective:
      "Understand your AI maturity, strategic challenges, and consulting needs.",
    fields: [
      {
        id: "consultingType",
        label: "What type of AI consulting support do you need?",
        type: "select",
        required: true,
        options: [
          "AI Strategy & Roadmap",
          "AI Use Case Discovery",
          "AI Readiness Assessment",
          "AI Implementation Planning",
          "AI Transformation Strategy",
          "Technical Architecture & Advisory",
          "AI Governance & Risk Assessment",
        ],
      },
      {
        id: "stage",
        label: "What best describes your current AI adoption stage?",
        type: "select",
        required: true,
        options: [
          "Just exploring AI",
          "Evaluating AI opportunities",
          "Already experimenting with AI",
          "Implementing AI solutions",
          "Scaling AI across the organization",
        ],
      },
      {
        id: "challenges",
        label: "What are your biggest challenges with AI adoption?",
        type: "textarea",
        required: true,
        placeholder: "Share the blockers, risks, or decisions you need help with.",
      },
      {
        id: "industry",
        label: "What is your industry?",
        type: "select",
        required: true,
        options: [
          "Healthcare",
          "Finance / Banking",
          "IT / Technology",
          "Education",
          "Retail / E-commerce",
          "Manufacturing",
          "Other",
        ],
      },
      {
        id: "engagement",
        label: "What kind of consulting engagement are you looking for?",
        type: "select",
        required: true,
        options: [
          "One-time consultation",
          "Strategic advisory",
          "Long-term consulting",
          "End-to-end implementation support",
        ],
      },
      {
        id: "start",
        label: "When would you like to get started?",
        type: "select",
        required: true,
        options: START_OPTIONS,
      },
    ],
  },
];

export function getBusinessService(title: string) {
  return BUSINESS_SERVICES.find((service) => service.title === title) ?? null;
}
