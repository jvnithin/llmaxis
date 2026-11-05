import { CAREER_ROLES, type CareerRole } from "./data";

export type CareerJdGroup = {
  title: string;
  items: string[];
};

export type CareerJdBlock =
  | { type: "paragraphs"; title?: string; body: string[] }
  | { type: "list"; title: string; items: string[] }
  | { type: "grouped-list"; title: string; groups: CareerJdGroup[] };

export type CareerJobDetail = {
  slug: string;
  roleId: string;
  fullTitle: string;
  departmentLabel: string;
  experience: string;
  employmentType: string;
  locationDetail: string;
  summary: string;
  overview: string[];
  blocks: CareerJdBlock[];
  idealCandidate?: string;
};

const ROLE_BY_ID = Object.fromEntries(
  CAREER_ROLES.map((role) => [role.id, role]),
) as Record<string, CareerRole>;

export const CAREER_JOB_DETAILS: CareerJobDetail[] = [
  {
    slug: "ai-consultant",
    roleId: "ai-consultant",
    fullTitle: "AI Consultant",
    departmentLabel: "AI Consulting & Solutions",
    experience: "3–6 years",
    employmentType: "Parttime/Full Time",
    locationDetail: "Hybrid//bengaluru",
    summary:
      "Advise clients on AI adoption, design practical AI-powered solutions, and guide implementation with engineering teams.",
    overview: [
      "LLM Axis is looking for an AI Consultant who can understand business challenges, identify opportunities for AI adoption and translate business requirements into practical AI-powered solutions.",
      "The candidate will work closely with clients, business stakeholders and internal engineering teams to identify use cases, recommend suitable technologies and guide AI implementation initiatives.",
      "This role requires a combination of technical understanding, business consulting, solution design and communication skills.",
      "The candidate may also participate in corporate AI workshops, client enablement sessions and technical knowledge-sharing initiatives.",
    ],
    blocks: [
      {
        type: "grouped-list",
        title: "Key Responsibilities",
        groups: [
          {
            title: "AI Consulting & Solution Design",
            items: [
              "Understand client business requirements, workflows and operational challenges.",
              "Identify opportunities for Artificial Intelligence, Generative AI and automation.",
              "Recommend suitable AI solutions based on business objectives and feasibility.",
              "Design AI solution architectures, technical roadmaps and implementation strategies.",
              "Evaluate AI models, frameworks, tools and technologies for specific business use cases.",
              "Work with engineering teams to develop proof-of-concepts and demonstrations.",
              "Prepare technical proposals, solution documentation and implementation plans.",
              "Evaluate solution performance, scalability, security and cost efficiency.",
            ],
          },
          {
            title: "Client Engagement & Business Collaboration",
            items: [
              "Conduct client meetings, requirement-gathering sessions and technical discussions.",
              "Explain complex AI concepts and solutions to technical and non-technical stakeholders.",
              "Conduct solution demonstrations and technical presentations.",
              "Collaborate with sales and business development teams during technical discussions.",
              "Support client workshops and AI adoption initiatives.",
            ],
          },
          {
            title: "Knowledge Sharing & Learning Support",
            items: [
              "Contribute to technical workshops and AI awareness sessions.",
              "Support the development of practical learning content based on industry use cases.",
              "Share implementation insights with internal trainers and engineering teams.",
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Required Technical Skills",
        items: [
          "Strong understanding of Artificial Intelligence and Machine Learning fundamentals.",
          "Practical knowledge of Generative AI and Large Language Models.",
          "Familiarity with Python and API integrations.",
          "Understanding of prompt engineering, RAG and vector databases.",
          "Knowledge of AI agents and workflow automation.",
          "Familiarity with cloud platforms and AI application architecture.",
          "Ability to translate business requirements into technical solutions.",
        ],
      },
      {
        type: "list",
        title: "Preferred Skills",
        items: [
          "Experience with LangChain, LangGraph or LlamaIndex.",
          "Exposure to OpenAI, Anthropic, Gemini or open-source models.",
          "Familiarity with AWS, Azure or Google Cloud.",
          "Experience in enterprise AI consulting or technology implementation.",
          "Understanding of AI governance, security and responsible AI practices.",
          "Experience delivering client presentations, workshops or technology consulting engagements.",
        ],
      },
      {
        type: "list",
        title: "Experience & Qualifications",
        items: [
          "3–6 years of overall experience in AI/ML, technology consulting, solution architecture or related fields.",
          "At least 2 years of practical experience working with Generative AI, LLM applications or AI-powered solutions.",
          "Experience in client requirement gathering, solution design, technical presentations or proof-of-concept development.",
          "Demonstrated ability to work with both business stakeholders and technical teams.",
          "Experience in enterprise consulting or AI implementation is preferred.",
        ],
      },
    ],
    idealCandidate:
      "A technically sound consultant who can understand business problems, identify opportunities for AI adoption and translate those opportunities into practical implementation strategies.",
  },
  {
    slug: "agentic-ai-engineer",
    roleId: "agentic-ai-engineer",
    fullTitle: "Agentic AI Engineer",
    departmentLabel: "AI Engineering & Development",
    experience: "2–5 years",
    employmentType: "Parttime/Full Time",
    locationDetail: "Hybrid//bengaluru",
    summary:
      "Design and ship intelligent AI agents, multi-agent systems, and production LLM applications.",
    overview: [
      "LLM Axis is looking for an Agentic AI Engineer to design, develop and implement intelligent AI agents, multi-agent systems and LLM-powered applications.",
      "The candidate should have strong Python and software engineering fundamentals, along with hands-on experience building AI applications that can reason, interact with external systems, use tools and execute multi-step workflows.",
      "The role involves developing practical AI applications for real-world use cases, supporting enterprise implementations and collaborating with technical and learning teams to create industry-relevant projects.",
    ],
    blocks: [
      {
        type: "grouped-list",
        title: "Key Responsibilities",
        groups: [
          {
            title: "AI Engineering & Development",
            items: [
              "Design and develop AI agents and multi-agent workflows.",
              "Build LLM-powered applications using modern AI frameworks.",
              "Implement tool calling, planning, reasoning and task orchestration.",
              "Develop Retrieval-Augmented Generation (RAG) systems.",
              "Integrate LLM applications with APIs, databases and external services.",
              "Build agent memory, context management and workflow automation.",
              "Develop backend services and APIs for AI applications.",
              "Test, evaluate and improve agent performance and reliability.",
              "Implement logging, monitoring, guardrails and error handling.",
              "Optimise latency, token consumption and infrastructure costs.",
              "Collaborate with engineering teams to deploy production-ready AI solutions.",
            ],
          },
          {
            title: "Enterprise Implementation",
            items: [
              "Develop AI solutions for practical business use cases.",
              "Support integration of AI applications with existing enterprise systems.",
              "Troubleshoot application, model and integration issues.",
              "Participate in technical discussions, demonstrations and implementation reviews.",
            ],
          },
          {
            title: "Knowledge Sharing & Technical Collaboration",
            items: [
              "Document technical architectures and implementation approaches.",
              "Conduct internal technical knowledge-sharing sessions.",
              "Support the creation of practical technical demonstrations and project exercises.",
              "Collaborate with trainers and subject matter experts on industry-relevant learning projects.",
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Required Technical Skills",
        items: [
          "Strong programming skills in Python.",
          "Practical experience with Generative AI and LLM applications.",
          "Experience with LangChain, LangGraph or similar frameworks.",
          "Understanding of RAG architecture, embeddings and vector databases.",
          "Familiarity with Pinecone, Chroma, Weaviate or FAISS.",
          "Understanding of REST APIs, backend development and databases.",
          "Knowledge of prompt engineering and structured outputs.",
          "Understanding of function calling, tool integration and multi-step workflows.",
          "Familiarity with Git, Docker and software development practices.",
        ],
      },
      {
        type: "list",
        title: "Preferred Skills",
        items: [
          "Experience with AutoGen, CrewAI or LlamaIndex.",
          "Exposure to AWS, Azure or Google Cloud.",
          "Knowledge of Kubernetes, CI/CD and deployment practices.",
          "Experience with LLM evaluation and performance optimisation.",
          "Familiarity with fine-tuning and open-source language models.",
          "Experience deploying AI applications in production environments.",
          "Understanding of monitoring, security and application scalability.",
        ],
      },
      {
        type: "list",
        title: "Experience & Qualifications",
        items: [
          "2–5 years of overall experience in software engineering, Python development, AI/ML or backend engineering.",
          "At least 1–2 years of hands-on experience building LLM-powered or Generative AI applications.",
          "Practical exposure to RAG, AI agents, tool calling and API integrations.",
          "Experience developing and deploying working applications is preferred.",
          "Candidates should be able to demonstrate practical projects and explain their technical architecture.",
        ],
      },
    ],
    idealCandidate:
      "A hands-on AI engineer who can move beyond basic prompt-based demonstrations and build reliable, integrated AI agents and applications that solve real-world problems.",
  },
  {
    slug: "ai-sme",
    roleId: "ai-sme",
    fullTitle: "AI Subject Matter Expert – Generative AI & Artificial Intelligence",
    departmentLabel: "AI Research, Learning & Technical Excellence",
    experience: "5–8+ years",
    employmentType: "Parttime/Full Time",
    locationDetail: "Hybrid//bengaluru",
    summary:
      "Lead AI technical excellence across B2C and B2B learning, corporate enablement, and solution guidance.",
    overview: [
      "LLM Axis is looking for an experienced AI Subject Matter Expert who combines strong technical expertise with proven training and knowledge-delivery capabilities.",
      "The candidate will play an important role across both our B2C and B2B business divisions.",
      "For B2C, the candidate will deliver structured technical learning programs, retail batches, live classes, practical workshops and project-based learning experiences for students and working professionals.",
      "For B2B, the candidate will design and deliver customised AI training programs, corporate workshops and technical enablement sessions for organisations.",
      "Beyond training, the candidate will contribute to AI solution development, technical research, architecture reviews and practical AI implementation initiatives.",
      "This is a dual-capability role: an AI technical expert who can also teach, mentor and develop other professionals.",
    ],
    blocks: [
      {
        type: "grouped-list",
        title: "Key Responsibilities",
        groups: [
          {
            title: "Technical Expertise & AI Solutions",
            items: [
              "Provide technical expertise across Artificial Intelligence, Machine Learning, Generative AI and LLM applications.",
              "Guide the design and architecture of AI-powered solutions.",
              "Review technical approaches, system designs and implementation quality.",
              "Evaluate AI models, frameworks, tools and emerging technologies.",
              "Guide the development of RAG systems, AI agents and intelligent automation.",
              "Support proof-of-concept development and complex technical problem-solving.",
              "Establish technical standards and best practices.",
              "Participate in client technical discussions and AI solution demonstrations.",
            ],
          },
          {
            title: "B2C Training & Learning Programs",
            items: [
              "Deliver live technical training sessions for LLM Axis retail batches.",
              "Teach students, graduates, working professionals and other learners.",
              "Develop structured curricula, course modules and learning pathways.",
              "Conduct hands-on coding sessions, demonstrations and practical workshops.",
              "Design assignments, projects, assessments and evaluation criteria.",
              "Mentor learners through technical projects and implementation challenges.",
              "Explain complex AI concepts in a clear and structured manner.",
              "Continuously improve learning outcomes based on learner feedback and performance.",
            ],
          },
          {
            title: "B2B Corporate Training",
            items: [
              "Design and deliver customised AI training programs for corporate clients.",
              "Conduct corporate workshops on Generative AI, LLMs, RAG, AI agents and related technologies.",
              "Understand the technical backgrounds and learning requirements of corporate participants.",
              "Adapt training content for different industries, teams and experience levels.",
              "Develop practical enterprise-oriented case studies and hands-on exercises.",
              "Conduct technical enablement sessions for corporate teams.",
              "Support corporate training proposals through curriculum recommendations and technical expertise.",
            ],
          },
          {
            title: "Curriculum & Content Development",
            items: [
              "Develop and maintain industry-relevant AI training curricula.",
              "Create presentation materials, technical documentation and practical exercises.",
              "Keep course content updated with emerging AI tools, frameworks and technologies.",
              "Work with the LLM Axis learning team to improve program quality.",
              "Ensure training programs balance theoretical understanding with practical implementation.",
            ],
          },
          {
            title: "Mentoring & Technical Leadership",
            items: [
              "Mentor internal engineering teams and junior technical professionals.",
              "Provide architecture guidance and technical reviews.",
              "Support learners and corporate participants with advanced technical questions.",
              "Share research findings, implementation practices and industry developments.",
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Required Technical Skills",
        items: [
          "Strong understanding of Artificial Intelligence, Machine Learning and Deep Learning.",
          "Advanced knowledge of Generative AI and LLM architectures.",
          "Strong Python programming and practical AI development experience.",
          "Expertise in RAG, embeddings, vector databases and semantic search.",
          "Understanding of model evaluation, fine-tuning and inference optimisation.",
          "Experience with AI agents and orchestration frameworks.",
          "Understanding of cloud infrastructure and production AI systems.",
          "Ability to develop practical AI applications and technical demonstrations.",
        ],
      },
      {
        type: "list",
        title: "Required Training & Instructional Skills",
        items: [
          "Demonstrable experience delivering technical training, workshops, bootcamps or structured learning programs.",
          "Ability to conduct live technical sessions and explain complex concepts effectively.",
          "Experience developing technical curricula, course materials and practical assignments.",
          "Ability to mentor learners with different levels of technical knowledge.",
          "Confidence in conducting hands-on coding sessions and project-based training.",
          "Ability to adapt technical content for both individual learners and corporate audiences.",
          "Strong presentation, communication and knowledge-sharing skills.",
        ],
      },
      {
        type: "list",
        title: "Preferred Skills",
        items: [
          "Experience with LangChain, LangGraph or LlamaIndex.",
          "Exposure to OpenAI, Anthropic, Gemini and open-source models.",
          "Familiarity with MLOps and LLMOps.",
          "Experience with enterprise AI implementations.",
          "Contributions to technical research, open-source projects or AI products.",
          "Previous experience delivering corporate AI training programs.",
          "Experience mentoring developers, students or working professionals.",
        ],
      },
      {
        type: "list",
        title: "Experience & Qualifications",
        items: [
          "5–8+ years of overall experience in AI/ML, Data Science, software engineering or related technical fields.",
          "At least 3 years of practical experience in Generative AI, LLM applications or advanced AI development.",
          "Demonstrated experience delivering technical training, workshops or structured learning programs.",
          "Experience designing curricula, developing learning materials and mentoring learners.",
          "Experience conducting corporate training or customised technical workshops is highly desirable.",
          "Candidates should be able to demonstrate both technical projects and previous training or instructional engagements.",
        ],
      },
    ],
    idealCandidate:
      "An experienced AI professional who can build, explain and teach AI technologies. Someone who can lead a retail batch, train corporate professionals, mentor technical teams and contribute to real AI solution development.",
  },
  {
    slug: "fde-sme",
    roleId: "fde-sme",
    fullTitle: "Subject Matter Expert – Forward Deployed Engineering (FDE)",
    departmentLabel: "AI Solutions, Enterprise Implementation & Learning",
    experience: "5–8+ years",
    employmentType: "Parttime/Full Time",
    locationDetail: "Hybrid//bengaluru",
    summary:
      "Guide enterprise AI implementations from requirements to production, and teach FDE practices across B2C and B2B programs.",
    overview: [
      "LLM Axis is looking for a Subject Matter Expert in Forward Deployed Engineering (FDE) who combines enterprise implementation experience, AI engineering knowledge and technical training capabilities.",
      "The candidate will work at the intersection of AI engineering, enterprise technology and real-world business implementation.",
      "On the enterprise side, the candidate will engage with clients, understand their operational challenges, translate requirements into technical solutions and guide implementation teams from proof-of-concept to production deployment.",
      "On the learning side, the candidate will deliver FDE-focused B2C programs and customised B2B corporate training, helping learners and professionals understand how AI systems are designed, integrated and deployed in real business environments.",
      "This role requires someone who has implemented or guided real technical solutions and can effectively transfer that knowledge through practical training.",
    ],
    blocks: [
      {
        type: "grouped-list",
        title: "Key Responsibilities",
        groups: [
          {
            title: "Enterprise AI & Forward Deployed Engineering",
            items: [
              "Work directly with clients to understand business requirements and technical challenges.",
              "Analyse existing business processes and identify opportunities for AI implementation.",
              "Translate business requirements into technical specifications and implementation plans.",
              "Design and guide AI-powered enterprise solutions.",
              "Work with LLMs, RAG systems, AI agents and intelligent automation.",
              "Support integrations with enterprise applications, APIs, databases and internal systems.",
              "Evaluate infrastructure, architecture and technology requirements.",
              "Guide engineering teams during development and implementation.",
              "Drive proof-of-concept development and production deployment.",
              "Troubleshoot technical and integration challenges.",
              "Conduct client workshops, technical demonstrations and solution walkthroughs.",
              "Ensure solutions meet requirements for scalability, security, reliability and performance.",
            ],
          },
          {
            title: "B2C Training & Learning Programs",
            items: [
              "Deliver technical training sessions on Forward Deployed Engineering concepts and practices.",
              "Teach learners how to approach real-world enterprise AI implementation problems.",
              "Develop practical modules covering system integration, APIs, application architecture and deployment.",
              "Conduct hands-on sessions, technical demonstrations and project-based exercises.",
              "Mentor learners through real-world implementation projects and technical case studies.",
              "Explain how enterprise requirements are translated into working technical solutions.",
              "Help learners understand the complete journey from problem identification to deployment.",
            ],
          },
          {
            title: "B2B Corporate Training",
            items: [
              "Design and deliver customised corporate training programs related to FDE and enterprise AI implementation.",
              "Conduct technical workshops on AI integration, solution architecture and deployment.",
              "Train corporate engineering teams on practical AI implementation methodologies.",
              "Develop enterprise-oriented case studies, exercises and implementation scenarios.",
              "Adapt training programs to the technical requirements and business objectives of corporate clients.",
              "Support corporate training discussions by recommending suitable technical modules and learning outcomes.",
            ],
          },
          {
            title: "Curriculum & Technical Knowledge Development",
            items: [
              "Develop structured FDE and enterprise AI learning curricula.",
              "Create practical assignments, architecture exercises and implementation projects.",
              "Document real-world technical implementation approaches and best practices.",
              "Collaborate with the LLM Axis learning team to continuously improve program quality.",
              "Incorporate relevant enterprise implementation experience into learning materials.",
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Required Technical Skills",
        items: [
          "Strong understanding of AI, Generative AI and LLM-based applications.",
          "Practical knowledge of Python and backend engineering concepts.",
          "Understanding of APIs, microservices and enterprise integrations.",
          "Familiarity with RAG, AI agents and workflow automation.",
          "Knowledge of cloud infrastructure and deployment environments.",
          "Understanding of databases, data pipelines and application architecture.",
          "Ability to translate business requirements into technical solutions.",
          "Strong troubleshooting, communication and client-facing skills.",
          "Ability to work across business stakeholders and engineering teams.",
        ],
      },
      {
        type: "list",
        title: "Required Training & Instructional Skills",
        items: [
          "Demonstrable experience conducting technical training, workshops, mentoring programs or structured learning sessions.",
          "Ability to teach enterprise technology and implementation concepts through practical examples.",
          "Experience developing technical training materials, project assignments and hands-on exercises.",
          "Ability to guide learners through end-to-end implementation projects.",
          "Confidence in delivering both B2C technical learning sessions and B2B corporate workshops.",
          "Ability to explain complex architecture and implementation concepts to different audiences.",
          "Strong presentation, communication and mentoring capabilities.",
        ],
      },
      {
        type: "list",
        title: "Preferred Skills",
        items: [
          "Experience with enterprise AI implementation projects.",
          "Familiarity with LangChain, LangGraph or similar AI frameworks.",
          "Experience with AWS, Azure or Google Cloud.",
          "Exposure to CRM, ERP and enterprise workflow integrations.",
          "Knowledge of Docker, Kubernetes and CI/CD practices.",
          "Understanding of security, access control and monitoring.",
          "Experience in technical consulting, solution architecture or customer-facing engineering.",
          "Previous experience in Forward Deployed Engineering or similar implementation-focused roles.",
          "Experience delivering corporate technology or AI training programs.",
        ],
      },
      {
        type: "list",
        title: "Experience & Qualifications",
        items: [
          "5–8+ years of overall experience in software engineering, solution architecture, technical consulting or enterprise technology implementation.",
          "At least 2–3 years of practical experience in AI/ML, Generative AI or LLM-based applications.",
          "Experience with enterprise integrations, APIs, cloud platforms and technical solution delivery.",
          "Demonstrated ability to convert client requirements into deployable technical solutions.",
          "Experience taking projects from proof-of-concept to production is strongly preferred.",
          "Demonstrable experience delivering technical training, workshops or mentoring programs.",
          "Experience designing practical learning modules and conducting corporate training is highly desirable.",
        ],
      },
    ],
    idealCandidate:
      "A technically experienced professional who understands how enterprise technology works in the real world, can engage directly with clients, guide implementation teams and teach others how to build and deploy practical AI solutions.",
  },
  {
    slug: "bd-executive",
    roleId: "bd-executive",
    fullTitle: "Business Development Executive – College Partnerships & Student Admissions",
    departmentLabel: "Sales & Business Development",
    experience: "0–3 years (EdTech sales path: 2–5 years preferred)",
    employmentType: "Full-time, Work from Office",
    locationDetail: "Bengaluru, Karnataka (On-site)",
    summary:
      "Build college partnerships, drive student admissions, and own the EdTech sales journey for LLM Axis AI programs.",
    overview: [
      "LLM Axis is looking for an energetic and target-driven Business Development Executive to build partnerships with colleges, promote our AI training programs, and drive student enrollments.",
      "The role requires strong communication, sales, relationship-building, and negotiation skills, with a focus on converting opportunities into business.",
      "As a BDE you may also own the complete sales journey from engaging with qualified leads to counselling prospective learners and successfully converting them into enrolled students—directly contributing to revenue growth.",
    ],
    blocks: [
      {
        type: "grouped-list",
        title: "Key Responsibilities",
        groups: [
          {
            title: "College Partnerships & Institutional Sales",
            items: [
              "Connect with colleges, HODs, placement officers, and college management.",
              "Introduce LLM Axis AI training programs and pitch workshops, bootcamps, and institutional partnerships.",
              "Schedule meetings, share proposals, negotiate terms, and close institutional deals.",
            ],
          },
          {
            title: "Student Admissions & Sales",
            items: [
              "Generate student leads and promote AI certification and training programs.",
              "Conduct college presentations, webinars, and student engagement activities.",
              "Follow up with interested students and drive paid course enrollments.",
              "Coordinate with internal sales teams to achieve admission targets.",
            ],
          },
          {
            title: "Campus Ambassador Management",
            items: [
              "Recruit, onboard, and manage student campus ambassadors across colleges.",
              "Guide ambassadors on course promotion and referral generation.",
              "Track leads, referrals, enrollments, and ambassador productivity.",
            ],
          },
          {
            title: "Campus Marketing & Business Growth",
            items: [
              "Build relationships with college clubs, student communities, and placement cells.",
              "Coordinate campus workshops, webinars, and promotional events.",
              "Identify new student-acquisition and institutional partnership opportunities.",
              "Maintain reports on leads, meetings, conversions, and revenue.",
            ],
          },
          {
            title: "Lead Management & Sales Counselling",
            items: [
              "Connect with assigned leads through phone calls, WhatsApp, email, and virtual meetings.",
              "Qualify leads based on eligibility and readiness.",
              "Understand each prospect's background, career goals, current challenges, and learning requirements.",
              "Explain LLM Axis programs, curriculum, learning outcomes, placement support, pricing, and payment options.",
              "Recommend suitable learning paths based on the candidate's profile.",
              "Handle objections confidently and professionally.",
              "Follow up consistently until enrolment.",
              "Build trust by acting as a career advisor rather than a transactional salesperson.",
            ],
          },
          {
            title: "Sales Closure, CRM & Customer Experience",
            items: [
              "Achieve individual monthly revenue and enrolment targets.",
              "Maintain a healthy sales pipeline and forecasting accuracy.",
              "Maintain accurate CRM records after every interaction.",
              "Track follow-ups and ensure no qualified lead is missed.",
              "Submit daily activity reports, call reports, and sales updates.",
              "Guide candidates through the payment and onboarding process.",
              "Coordinate with operations and learner success teams for smooth onboarding after enrolment.",
              "Deliver a positive counselling experience throughout the sales journey.",
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Skills Required",
        items: [
          "Strong communication, presentation, and negotiation skills.",
          "Understanding of sales, lead generation, and follow-ups.",
          "Confidence in cold calling, conducting meetings, and closing deals.",
          "Ability to work independently, build relationships, and meet sales targets.",
          "Basic knowledge of Excel, Google Sheets, or CRM tools.",
          "Fluency in English; additional languages are an advantage.",
        ],
      },
      {
        type: "list",
        title: "Eligibility",
        items: [
          "0–3 years of experience; freshers with strong communication and sales skills may apply.",
          "For EdTech inside-sales track: 2–5 years of EdTech sales experience preferred.",
          "Graduate in any discipline.",
          "Experience in Business Development, Institutional Sales, Education Sales, College Partnerships, or Student Admissions is an advantage.",
          "Willingness to visit colleges and participate in campus activities as required.",
          "Interest in AI, technology, and professional training programs is preferred.",
        ],
      },
      {
        type: "list",
        title: "Performance Expectations",
        items: [
          "Accountable for qualified leads, college meetings and proposals, paid institutional partnerships, student enrollments, productive campus ambassador referrals, and revenue generation.",
          "Performance is evaluated on revenue generated, sales conversion, follow-up discipline, CRM hygiene, communication skills, and adherence to company processes.",
        ],
      },
      {
        type: "list",
        title: "Why Join LLM Axis?",
        items: [
          "Work in one of the fastest-growing sectors: Artificial Intelligence.",
          "Opportunity to sell a high-impact career transformation program.",
          "Attractive uncapped earning potential.",
          "High ownership and rapid career growth.",
          "Startup culture with fast decision-making and real responsibility.",
          "Learn directly from AI educators, founders, and industry experts.",
          "Flexible working hours with an output-based culture (availability during business hours expected).",
        ],
      },
    ],
    idealCandidate:
      "A target-driven sales professional who enjoys interacting with people, solving career problems, closing high-value enrolments, and building lasting college and learner relationships.",
  },
  {
    slug: "content-creator",
    roleId: "content-creator",
    fullTitle: "Content Creator & Influencer Marketing Executive",
    departmentLabel: "Marketing",
    experience: "1–3 Years",
    employmentType: "Parttime/Full Time",
    locationDetail: "Hybrid//bengaluru",
    summary:
      "Plan, create, and execute engaging content across Instagram, LinkedIn, YouTube and other digital channels, while growing influencer collaborations that build the LLM Axis brand.",
    overview: [
      "LLM Axis is an AI-focused technology and learning company working at the intersection of Artificial Intelligence, Generative AI, Agentic AI and Forward Deployed Engineering (FDE).",
      "We focus on making AI practical through industry-oriented learning experiences, AI solutions, technical programs, events and community initiatives.",
      "We are looking for a creative and energetic Content Creator & Influencer Marketing Executive who can help establish and grow the LLM Axis brand across digital platforms.",
      "The candidate will be responsible for planning, creating and executing engaging content across social media platforms, including Instagram, LinkedIn, YouTube and other relevant digital channels.",
      "The role involves developing creative content strategies, producing short-form videos, coordinating with technical experts and mentors, managing influencer collaborations, and promoting LLM Axis programs, events and brand initiatives.",
      "The ideal candidate should understand current social media trends and know how to convert technical subjects into engaging, accessible and shareable content.",
    ],
    blocks: [
      {
        type: "grouped-list",
        title: "Key Responsibilities",
        groups: [
          {
            title: "Content Creation & Strategy",
            items: [
              "Develop creative content strategies aligned with LLM Axis branding and business objectives.",
              "Create engaging short-form videos, reels, shorts, promotional videos and social media creatives.",
              "Develop content around Generative AI, Agentic AI, AI tools, automation, FDE and emerging technologies.",
              "Convert complex technical concepts into simple, engaging and audience-friendly content.",
              "Develop creative scripts, hooks, captions, storytelling concepts and video ideas.",
              "Create promotional content for AI programs, webinars, masterclasses, hackathons and other events.",
            ],
          },
          {
            title: "Social Media Management",
            items: [
              "Manage and grow LLM Axis social media accounts across Instagram, LinkedIn, YouTube and other relevant platforms.",
              "Plan and maintain a consistent content calendar.",
              "Publish content and monitor engagement, reach, impressions and audience growth.",
              "Identify trending topics, formats, hashtags and opportunities relevant to AI and technology.",
              "Develop platform-specific content strategies for Indian and US audiences.",
              "Maintain consistency in brand identity, tone and communication.",
            ],
          },
          {
            title: "Video Production & Editing",
            items: [
              "Record and edit professional-quality short-form and long-form videos.",
              "Coordinate with trainers, AI experts, mentors and internal teams for video shoots.",
              "Create promotional videos, educational videos, testimonials, event highlights and interview content.",
              "Use editing tools such as CapCut, Adobe Premiere Pro, Canva or equivalent tools.",
              "Ensure videos have engaging openings, appropriate subtitles, visuals and clear messaging.",
            ],
          },
          {
            title: "Influencer Marketing & Collaborations",
            items: [
              "Identify and connect with relevant AI creators, technology influencers, student influencers and industry professionals.",
              "Build influencer collaboration opportunities for LLM Axis.",
              "Coordinate influencer campaigns, promotional activities and content partnerships.",
              "Manage creator communication, deliverables, timelines and campaign execution.",
              "Explore collaborations with college communities, student creators and technology communities.",
            ],
          },
          {
            title: "Events & Brand Promotion",
            items: [
              "Create promotional campaigns for webinars, AI hackathons, masterclasses and technical events.",
              "Coordinate content coverage during events and capture highlights.",
              "Develop post-event videos, photographs, testimonials and recap content.",
              "Support marketing campaigns for GenAI and Agentic AI cohorts.",
              "Work with the sales and business development teams to support campaign execution.",
            ],
          },
          {
            title: "Performance Monitoring",
            items: [
              "Track content performance and social media growth.",
              "Analyse audience engagement and identify high-performing content formats.",
              "Recommend improvements based on content performance and audience feedback.",
              "Experiment with new content formats, storytelling approaches and creative campaigns.",
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Required Skills & Qualifications",
        items: [
          "1–3 years of experience in content creation, digital marketing, social media management or influencer marketing.",
          "Strong creative thinking, storytelling and communication skills.",
          "Hands-on experience in creating and editing reels, shorts and promotional videos.",
          "Familiarity with Instagram, LinkedIn and YouTube.",
          "Knowledge of video editing and graphic design tools.",
          "Understanding of social media trends and digital audience behaviour.",
          "Ability to write creative scripts, captions and promotional content.",
          "Interest in Artificial Intelligence, technology and emerging digital trends.",
          "Ability to work independently and collaborate with cross-functional teams.",
        ],
      },
      {
        type: "list",
        title: "Preferred Skills",
        items: [
          "Experience creating content for technology, AI, EdTech or SaaS brands.",
          "Comfortable appearing in videos or coordinating on-camera content.",
          "Experience working with influencers and digital creators.",
          "Basic understanding of paid social media campaigns.",
          "Familiarity with AI-powered content creation tools.",
          "Experience managing brand social media accounts and growing audiences organically.",
        ],
      },
      {
        type: "list",
        title: "Key Performance Indicators (KPIs)",
        items: [
          "Consistency and quality of content production.",
          "Social media audience growth across platforms.",
          "Engagement, reach, impressions and video views.",
          "Quality and performance of promotional campaigns.",
          "Influencer collaborations and partnership execution.",
          "Content contribution towards event registrations and program enquiries.",
          "Creative initiatives that improve brand visibility and audience engagement.",
        ],
      },
      {
        type: "list",
        title: "What We Offer",
        items: [
          "Opportunity to work with an emerging AI-focused technology company.",
          "Exposure to Generative AI, Agentic AI and Forward Deployed Engineering.",
          "Opportunity to collaborate with AI experts, mentors and technology professionals.",
          "Creative freedom to experiment with content and marketing strategies.",
          "Opportunities to build a strong professional portfolio.",
          "Growth opportunities within the marketing and brand development team.",
        ],
      },
    ],
    idealCandidate:
      "A creative, energetic marketer who understands social trends, can turn technical AI topics into shareable content, and thrives owning content production plus influencer collaborations end to end.",
  },
];

const DETAIL_BY_SLUG = Object.fromEntries(
  CAREER_JOB_DETAILS.map((detail) => [detail.slug, detail]),
) as Record<string, CareerJobDetail>;

export function careerDetailSlugs() {
  return CAREER_JOB_DETAILS.map((detail) => detail.slug);
}

export function getCareerJobDetail(slug: string) {
  return DETAIL_BY_SLUG[slug] ?? null;
}

export function getCareerRoleForDetail(detail: CareerJobDetail) {
  return ROLE_BY_ID[detail.roleId] ?? null;
}
