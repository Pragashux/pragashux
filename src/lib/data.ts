export const siteConfig = {
  name: "Pragash Santhakumar",
  title: "Senior UX Designer | UX Strategist | Product Designer",
  tagline:
    "Designing human-centered digital experiences that balance business goals and user needs.",
  email: "hello@pragash.design",
  url: "https://pragashux.github.io",
  linkedin: "https://www.linkedin.com/in/pragash-santhakumar-44074452/",
  behance: "https://www.behance.net/",
  dribbble: "https://dribbble.com/",
  github: "https://github.com/Pragashux",
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#insights", label: "Insights" },
  { href: "#contact", label: "Contact" },
];

export const skillCategories = [
  {
    title: "UX Design",
    accent: "primary",
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "Information Architecture",
    ],
  },
  {
    title: "UI Design",
    accent: "secondary",
    skills: [
      "Figma",
      "Design Systems",
      "Visual Design",
      "Responsive Design",
    ],
  },
  {
    title: "Product Thinking",
    accent: "accent",
    skills: [
      "Product Strategy",
      "Design Workshops",
      "Stakeholder Management",
      "Agile Methodology",
    ],
  },
] as const;

export const experience = {
  role: "Senior Technical Consultant",
  company: "Enterprise Healthcare & Digital Platforms",
  period: "Present",
  responsibilities: [
    "UX Strategy",
    "Product Design",
    "User Experience Improvements",
    "Healthcare Platform Modernization",
    "Design System Contributions",
    "Cross-functional Collaboration",
  ],
  highlights: [
    "Successfully delivered 95+ user stories.",
    "Led multiple UX initiatives.",
    "Improved user workflows and usability.",
  ],
};

export const caseStudies = [
  {
    id: "healthcare-portal",
    title: "Healthcare Member Portal Experience",
    tags: ["Healthcare", "Accessibility", "Research"],
    challenge:
      "Members struggled to navigate benefits, claims, and care resources across a fragmented portal experience with inconsistent patterns and limited accessibility support.",
    process:
      "Conducted stakeholder interviews, UX audits, and task-based usability sessions to map member journeys and uncover friction in high-intent flows.",
    solution:
      "Redesigned core member journeys with clearer information architecture, accessible UI patterns, and progressive disclosure that simplified complex healthcare tasks.",
    impact:
      "Improved member engagement and task completion confidence while establishing a more inclusive foundation for future portal enhancements.",
  },
  {
    id: "hra-survey",
    title: "HRA Survey Experience Transformation",
    tags: ["Healthcare", "Forms", "Usability"],
    challenge:
      "A lengthy health risk assessment questionnaire created cognitive overload, abandonment, and confusion around question intent and progress.",
    process:
      "Analyzed drop-off patterns, identified pain points through heuristic evaluation, and co-created flow improvements with clinical and product partners.",
    solution:
      "Streamlined the questionnaire with clearer grouping, better progress signaling, and reduced complexity without compromising clinical completeness.",
    impact:
      "Created a calmer, more guided survey experience that reduced perceived effort and supported higher-quality completion.",
  },
  {
    id: "enterprise-dx",
    title: "Enterprise Digital Transformation",
    tags: ["Enterprise", "Dashboard", "IA"],
    challenge:
      "Cross-functional teams relied on fragmented dashboards and workflows that slowed decision-making and obscured priority actions.",
    process:
      "Facilitated workshops, audited information architecture, and mapped operational workflows to identify opportunities for consolidation and clarity.",
    solution:
      "Delivered a redesigned dashboard system with prioritized workflows, clearer hierarchy, and shared patterns that scaled across enterprise teams.",
    impact:
      "Improved cross-team collaboration and workflow efficiency while aligning product, design, and engineering around a shared experience vision.",
  },
];

export const processSteps = [
  {
    title: "Discover",
    description:
      "Research users, business goals, and constraints to uncover opportunities.",
  },
  {
    title: "Define",
    description:
      "Synthesize insights into problem statements, personas, and success metrics.",
  },
  {
    title: "Ideate",
    description:
      "Explore concepts through workshops, sketching, and collaborative critique.",
  },
  {
    title: "Design",
    description:
      "Craft flows, interfaces, and systems that feel clear and intentional.",
  },
  {
    title: "Test",
    description:
      "Validate assumptions with usability testing and iterative refinement.",
  },
  {
    title: "Deliver",
    description:
      "Partner with engineering to ship polished, accessible experiences.",
  },
];

export const testimonials = [
  {
    quote:
      "Pragash brings clarity to complex product challenges. His research-backed recommendations consistently elevated our healthcare experience.",
    name: "Alex Rivera",
    role: "Product Director, Healthcare Platforms",
  },
  {
    quote:
      "A rare blend of strategic thinking and craft. He aligns stakeholders quickly and designs with both users and business outcomes in mind.",
    name: "Jordan Lee",
    role: "Engineering Manager, Enterprise Products",
  },
  {
    quote:
      "Working with Pragash improved our design system maturity and accessibility posture. The collaboration was thoughtful and highly effective.",
    name: "Sam Patel",
    role: "Design Lead, Digital Transformation",
  },
];

export const achievements = [
  { value: 95, suffix: "+", label: "Stories Delivered" },
  { value: 10, suffix: "+", label: "Products Improved" },
  { value: 5, suffix: "+", label: "Years UX Experience" },
  { value: 0, suffix: "", label: "Multiple Enterprise Projects", display: "Multiple" },
];

export const blogPosts = [
  {
    title: "UX in Healthcare",
    excerpt:
      "How empathy, clarity, and accessibility shape safer digital care experiences.",
    category: "Healthcare UX",
  },
  {
    title: "Design Systems",
    excerpt:
      "Building scalable pattern libraries that accelerate teams without sacrificing craft.",
    category: "Systems",
  },
  {
    title: "Accessibility Best Practices",
    excerpt:
      "Practical ways to embed inclusive design into everyday product decisions.",
    category: "Accessibility",
  },
  {
    title: "AI Assisted UX Design",
    excerpt:
      "Using AI as a creative partner while keeping human judgment at the center.",
    category: "AI & UX",
  },
];
