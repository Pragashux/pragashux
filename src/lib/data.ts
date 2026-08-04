export const siteConfig = {
  name: "Pragash Santhakumar",
  title: "Senior UX Designer | UX Strategist | Product Designer",
  tagline:
    "Designing human-centered digital experiences that balance business goals and user needs.",
  location: "Chennai, Tamil Nadu, India",
  company: "Perficient",
  email: "hello@pragash.design",
  url: "https://pragashux.github.io",
  linkedin: "https://www.linkedin.com/in/pragash-santhakumar-44074452/",
  behance: "https://www.behance.net/pragashinnovates",
  dribbble: "https://dribbble.com/",
  github: "https://github.com/Pragashux",
  designfolio: "https://pragash.designfolio.me/",
  image: "/pragash-profile.jpg",
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
      "Interaction Design",
      "Accessibility",
    ],
  },
  {
    title: "UI Design",
    accent: "secondary",
    skills: [
      "Figma",
      "Adobe XD",
      "Sketch",
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

export const experiences = [
  {
    role: "Senior Technical Consultant UX",
    company: "Perficient",
    location: "Chennai, Tamil Nadu, India",
    period: "Mar 2025 – Present",
    current: true,
    summary:
      "Leading UX strategy and product design for enterprise digital experiences, partnering with cross-functional teams to deliver research-backed, accessible solutions.",
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
      "Recognized with the Extra Mile Award at Perficient.",
      "Led multiple UX initiatives that improved workflows and usability.",
    ],
  },
  {
    role: "UX Design Specialist",
    company: "Movate",
    location: "Chennai, Tamil Nadu, India",
    period: "Jun 2024 – Dec 2024",
    current: false,
    summary:
      "Researched, designed, and implemented end-to-end user experiences for digital products and tools across enterprise engagements.",
    responsibilities: [
      "User Research",
      "Experience Design",
      "Prototyping",
      "Usability Validation",
    ],
    highlights: [
      "Owned research-to-delivery UX workflows.",
      "Collaborated closely with product and engineering partners.",
    ],
  },
  {
    role: "User Experience Designer",
    company: "Mobius Knowledge Services",
    location: "Chennai, Tamil Nadu, India",
    period: "Jan 2022 – May 2024",
    current: false,
    summary:
      "Focused on user journeys through research, wireframes, prototypes, and cross-team collaboration to ship clearer digital experiences.",
    responsibilities: [
      "User Research",
      "Wireframing & Prototyping",
      "Interaction Design",
      "Stakeholder Collaboration",
    ],
    highlights: [
      "Spent 2+ years deepening end-to-end UX craft.",
      "Supported product teams with usable, research-informed designs.",
    ],
  },
  {
    role: "UX Specialist / UX Designer",
    company: "SrinSoft Technologies",
    location: "Chennai, Tamil Nadu, India",
    period: "Jul 2019 – Jul 2021",
    current: false,
    summary:
      "Crafted visually strong, usable interfaces and translated concepts into polished digital experiences using modern design tools and patterns.",
    responsibilities: [
      "UI Design",
      "UX Design",
      "Visual Design",
      "Prototype Delivery",
    ],
    highlights: [
      "Grew from UX Designer into UX Specialist responsibilities.",
      "Delivered pixel-refined interfaces that elevated engagement.",
    ],
  },
  {
    role: "UX Consultant",
    company: "snailtechs digital",
    location: "Puducherry, India",
    period: "Jul 2013 – Jun 2019",
    current: false,
    summary:
      "Freelance UX consulting across diverse clients with a focus on research, wireframing, prototyping, and translating business goals into intuitive experiences.",
    responsibilities: [
      "Freelance UX Consulting",
      "User Research",
      "Wireframing",
      "Client Collaboration",
    ],
    highlights: [
      "Built a strong foundation across nearly 6 years of consulting work.",
      "Delivered thoughtful UX for a wide range of digital products.",
    ],
  },
];

/** @deprecated use experiences[0] */
export const experience = {
  role: experiences[0].role,
  company: experiences[0].company,
  period: experiences[0].period,
  responsibilities: experiences[0].responsibilities,
  highlights: experiences[0].highlights,
};

export const caseStudies = [
  {
    id: "pimworks",
    title: "PIMworks Case Study",
    tags: ["Ecommerce", "PIM", "Enterprise", "Figma"],
    image: "/projects/pimworks.png",
    url: "https://www.behance.net/gallery/212744261/PIMworks-Case-study",
    challenge:
      "Product teams managing large catalogs needed a clearer, more scalable PIM experience—complex product data, attributes, and workflows made everyday tasks slow and error-prone.",
    process:
      "Combined UX research, heuristic evaluation, information architecture mapping, and Figma prototyping to uncover friction across ecommerce product management journeys.",
    solution:
      "Designed a streamlined PIMworks experience with clearer hierarchy, improved task flows, and interface patterns that made product data easier to browse, edit, and govern.",
    impact:
      "Created a more intuitive PIM workflow foundation that reduced cognitive load and supported faster, more confident product operations.",
  },
  {
    id: "vbc-lms",
    title: "VBC LMS Portal",
    tags: ["EdTech", "LMS", "Web", "Portal"],
    image: "/projects/vbc-lms.png",
    url: "https://www.behance.net/gallery/211696365/VBC-LMS-Portal",
    challenge:
      "Learners and administrators needed a clearer learning portal experience—content discovery, progress tracking, and key LMS actions felt fragmented across the platform.",
    process:
      "Mapped learner and admin journeys, prioritized high-intent flows, and iterated UI structures for both the LMS portal and supporting website experience.",
    solution:
      "Delivered a cohesive LMS portal design with improved navigation, clearer content hierarchy, and a companion website experience that reinforced the product story.",
    impact:
      "Helped create a more guided learning experience that made courses and progress easier to understand for students and operators alike.",
  },
  {
    id: "mojo-redesign",
    title: "MOJO UI Before & After Redesign",
    tags: ["UI Redesign", "Mobile", "Visual Design"],
    image: "/projects/mojo.png",
    url: "https://www.behance.net/gallery/211697189/MOJO-UI-Before-and-After-Redeisgn",
    challenge:
      "The existing MOJO interface felt dated and inconsistent, making core interactions harder to scan and less engaging for users.",
    process:
      "Audited the current UI, identified visual and interaction gaps, and redesigned key screens with a cleaner hierarchy and modern component language.",
    solution:
      "Delivered a before-and-after UI redesign that refreshed layout, typography, spacing, and interaction clarity while preserving product intent.",
    impact:
      "Elevated perceived quality and usability through a sharper visual system and more approachable product screens.",
  },
];

export const featuredProjects = [
  {
    title: "Fitness App",
    category: "Mobile UX",
    image: "/projects/fitness.png",
    url: "https://www.behance.net/gallery/212297707/Fitness-App",
  },
  {
    title: "ANT Design System",
    category: "Design Systems",
    image: "/projects/ant-ds.jpg",
    url: "https://www.behance.net/gallery/211698015/ANT-Design-System",
  },
  {
    title: "Heuristic Approach for PIMworks",
    category: "UX Research",
    image: "/projects/pimworks.png",
    url: "https://www.behance.net/gallery/214165875/Heuristic-Approach-for-Pimworks",
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
  { value: 12, suffix: "+", label: "Years UX Experience" },
  { value: 0, suffix: "", label: "Extra Mile Award — Perficient", display: "Award" },
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
