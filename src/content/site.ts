export type ProjectTier = "featured" | "more" | "archive";

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  problemStatement: string;
  role: string;
  productType: string;
  industry: string;
  year: string;
  cover: string;
  images: ProjectImage[];
  client: string;
  duration: string;
  platform: string;
  team: string;
  contribution: string;
  behance: string;
  tier: ProjectTier;
  tools: string[];
  problem: { heading: string; body: string; questions: string[] };
  understanding: { body: string; evidence: string[] };
  definition: { statement: string; body: string };
  exploration: { body: string; notes: string[] };
  system: { body: string; pieces: string[] };
  experience: { body: string };
  outcome: { body: string; qualitative: string[] };
  learned: string;
  contentNeeded: string[];
};

export const site = {
  name: "Pragash Santhakumar",
  shortName: "PRAGASH",
  title: "UX Designer",
  location: "Chennai, India",
  email: "pragashvishuals@gmail.com",
  linkedin: "https://www.linkedin.com/in/pragash-santhakumar-44074452/",
  behance: "https://www.behance.net/ppragash21",
  github: "https://github.com/Pragashux",
  portrait: "/pragash-portrait.jpg",
  seoTitle: "Pragash Santhakumar — UX Designer",
  seoDescription:
    "UX Designer crafting simple, useful and scalable digital experiences from complex problems.",
  heroLine: "Designing digital experiences that make complex things feel simple.",
  heroPhilosophy: "I don't start with Figma. I start with the problem.",
};

export const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#journey", label: "Journey" },
  { href: "/#contact", label: "Contact" },
] as const;

export const experiences = [
  {
    role: "Senior Technical Consultant UX",
    company: "Perficient",
    period: "Mar 2025 — Present",
    location: "Chennai, India",
    summary:
      "UX consulting across digital product work, including audits, design-system contributions, and structured design thinking on complex product problems.",
  },
  {
    role: "UX Design Specialist",
    company: "Movate",
    period: "Jun 2024 — [CONTENT NEEDED: end date]",
    location: "Chennai, India",
    summary:
      "Worked on the VBC LMS Portal in a consulting environment — journeys, design-system alignment, UX audits, and complex learning workflows.",
  },
  {
    role: "User Experience Designer",
    company: "Mobius Knowledge Services",
    period: "Jan 2022 — May 2024",
    location: "Chennai, India",
    summary:
      "End-to-end UX for product work: research, wireframes, prototypes, and collaboration with teams shipping user-facing experiences.",
  },
  {
    role: "UX Specialist",
    company: "SrinSoft Technologies",
    period: "[CONTENT NEEDED: dates]",
    location: "Chennai, India",
    summary: "[CONTENT NEEDED: a short, accurate description of this role.]",
  },
  {
    role: "User Experience Designer",
    company: "TNQ Technologies",
    period: "Jun 2019 — Jun 2020",
    location: "Chennai, India",
    summary: "[CONTENT NEEDED: a short, accurate description of this role.]",
  },
];

export const journey = [
  {
    era: "Early years",
    title: "Learning how interfaces communicate",
    body: "I started by learning visual design — how type, space, and hierarchy help people understand a screen. Those years taught me that polish is useful only when it serves a task.",
  },
  {
    era: "UX exploration",
    title: "Moving from screens to problems",
    body: "I shifted attention from how something looks to who it is for. Flows, research, and interaction became the work. Figma stayed a tool. The brief became the starting point.",
  },
  {
    era: "Product design",
    title: "Real products, real constraints",
    body: "Enterprise and consumer products — learning portals, operational tools, healthcare and finance flows — forced trade-offs between user effort, business needs, and what should not be built.",
  },
  {
    era: "Today",
    title: "Usability, systems, and outcomes",
    body: "I now spend more time on clarity, consistency, and measurable usefulness. The interesting work is usually the workflow nobody notices — because it simply works.",
  },
];

export const processSteps = [
  {
    id: "understand",
    label: "Understand",
    body: "Who is this for, what are they trying to do, and where does the current experience get in the way?",
  },
  {
    id: "define",
    label: "Define",
    body: "Turn observations into a focused problem. Name what we will simplify — and what we will not build.",
  },
  {
    id: "explore",
    label: "Explore",
    body: "Map structure, sketch flows, test rough ideas. Most of this work never ships. That is the point.",
  },
  {
    id: "design",
    label: "Design",
    body: "Interface, system, and states — enough fidelity to make decisions with product and engineering.",
  },
  {
    id: "validate",
    label: "Validate",
    body: "Check the idea against real tasks. Watch where people hesitate. Adjust before the design hardens.",
  },
  {
    id: "refine",
    label: "Refine",
    body: "Tighten hierarchy, language, and edge cases. Leave the product more consistent than we found it.",
  },
];

const needed = [
  "Client / company name if it can be published",
  "Duration and team makeup",
  "Research artifacts (interviews, flows, personas) if they exist",
  "What changed after launch — qualitative or measured",
];

export const projects: Project[] = [
  {
    slug: "finro",
    title: "Finro",
    tagline: "Designing a simpler financial experience for people managing complex information.",
    problemStatement:
      "Financial information is dense. The design problem was making it scanable, trustworthy, and usable on both mobile and web.",
    role: "UX / UI Designer",
    productType: "Mobile + Web app",
    industry: "Fintech",
    year: "[CONTENT NEEDED]",
    cover: "/projects/finro.png",
    images: [
      {
        src: "/projects/finro.png",
        alt: "Finro mobile and web product screens from the Behance case study",
        caption: "Published product screens from the Finro (PerzoCorp) Behance project.",
      },
    ],
    client: "PerzoCorp",
    duration: "[CONTENT NEEDED]",
    platform: "Mobile and web",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI for the Finro app experience across mobile and web.",
    behance: "https://www.behance.net/gallery/167128655/Finro-(PerzoCorp)-app-for-mobile-and-Web",
    tier: "featured",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "People using financial products are not looking for more charts. They are trying to understand status, next actions, and risk without drowning in numbers. Finro needed an interface that could hold complexity without making the user feel it all at once.",
      questions: [
        "What does the user need to know first?",
        "Which numbers are decisions, and which are decoration?",
        "How should mobile and web share a mental model?",
      ],
    },
    understanding: {
      body: "Published research artifacts for this project are not in this repository. The available evidence is the product UI itself — information-dense financial screens designed for both phone and desktop.",
      evidence: [
        "Behance project: Finro (PerzoCorp) app for mobile and Web",
        "Cover and screens showing a multi-platform financial product",
        "No interview notes, personas, or metrics are published here",
      ],
    },
    definition: {
      statement: "Users didn't need more features. They needed less complexity.",
      body: "The design problem was hierarchy: what to show, what to group, and what to hide until it is useful. A financial product fails when every number competes for the same attention.",
    },
    exploration: {
      body: "Early structure work would have sat in information architecture and flow before visual polish. Detailed iteration history is not available in this repo — replace this block with the actual discarded directions.",
      notes: [
        "[CONTENT NEEDED] Information architecture",
        "[CONTENT NEEDED] Key user flows",
        "[CONTENT NEEDED] Wireframes and rejected concepts",
      ],
    },
    system: {
      body: "A financial product only stays coherent if type, color, and components mean the same thing on every screen. The system should make status, amounts, and primary actions unmistakable.",
      pieces: [
        "Typography for numbers vs. labels",
        "Color used for status, not decoration",
        "Cards, lists, and forms that can scale",
        "Responsive behavior between phone and web",
      ],
    },
    experience: {
      body: "The published screens show a product trying to make dense financial information feel organized. Captions below mark the kinds of UX decisions this work is about — not invented results.",
    },
    outcome: {
      body: "No measured results are published for this project. The qualitative intent is a clearer financial workflow across devices.",
      qualitative: [
        "Created a clearer path through complex financial information.",
        "Designed for both mobile and web so the product could meet people where they work.",
      ],
    },
    learned:
      "This kind of work is a reminder that good UX is rarely the most decorative screen. In finance, trust is a hierarchy problem. If people cannot find the number that matters, the interface has already failed.",
    contentNeeded: needed,
  },
  {
    slug: "find-your-doctor",
    title: "Find Your Doctor",
    tagline: "Helping people find a doctor without turning healthcare into a scavenger hunt.",
    problemStatement:
      "Choosing a doctor is high-stakes and usually poorly structured. The product needed a calmer path from need to decision.",
    role: "UX / UI Designer",
    productType: "Mobile app",
    industry: "Healthcare",
    year: "[CONTENT NEEDED]",
    cover: "/projects/find-your-doctor.jpg",
    images: [
      {
        src: "/projects/find-your-doctor.jpg",
        alt: "Find Your Doctor mobile app screens from Behance",
        caption: "Published screens from the Find Your Doctor Behance project.",
      },
    ],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Mobile",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI for a doctor-finding mobile experience.",
    behance: "https://www.behance.net/gallery/167129725/Find-Your-Doctor",
    tier: "featured",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "When someone needs a doctor, they are often anxious, short on time, and unsure which specialty or clinic is right. Directories that dump filters and lists onto the first screen add cognitive load at the worst moment.",
      questions: [
        "Who is searching — a parent, a first-time patient, someone in a hurry?",
        "What must they know before they can choose?",
        "Where does the flow create unnecessary decisions?",
      ],
    },
    understanding: {
      body: "No interview transcripts or journey maps are stored in this repo. What we can show is the designed interface as published on Behance.",
      evidence: [
        "Behance project: Find Your Doctor",
        "Mobile screens as the primary designed artifact",
      ],
    },
    definition: {
      statement: "The job is not to show more doctors. It is to help someone choose with confidence.",
      body: "Healthcare UX fails when it treats people like database queries. The focused problem was reducing the distance between a health need and a trustworthy next step.",
    },
    exploration: {
      body: "Search, filters, profiles, and booking are the usual skeleton of this product type. The interesting decisions are order and language — what the user sees before they are asked to commit.",
      notes: [
        "[CONTENT NEEDED] User flows",
        "[CONTENT NEEDED] Wireframes",
        "[CONTENT NEEDED] Why later screens replaced earlier ones",
      ],
    },
    system: {
      body: "A healthcare product needs a quiet visual system: readable type, clear primary actions, and cards that make credentials scannable without shouting.",
      pieces: ["Type hierarchy", "Action buttons", "Doctor cards", "Form and booking states"],
    },
    experience: {
      body: "The published screens are the current evidence of the final experience. Add close-ups of search, profile, and booking once those files are in the repo.",
    },
    outcome: {
      body: "No metrics are published. Qualitatively, the work is a structured mobile path for finding a doctor.",
      qualitative: [
        "Gave the healthcare task a clearer sequence than a raw directory.",
      ],
    },
    learned:
      "Healthcare work teaches restraint. People do not need a clever interface. They need to feel oriented. If the primary action is hard to find, the design is arguing with the user.",
    contentNeeded: needed,
  },
  {
    slug: "cfi-portal",
    title: "CFI Portal",
    tagline: "Mapping a usable path through a dense enterprise portal.",
    problemStatement:
      "Portals fail when every task lives at the same depth. This work was about flow — how people move through CFI without getting lost.",
    role: "UX / UI Designer",
    productType: "Web portal",
    industry: "Enterprise",
    year: "[CONTENT NEEDED]",
    cover: "/projects/cfi-portal.png",
    images: [
      {
        src: "/projects/cfi-portal.png",
        alt: "CFI Portal UX/UI flow overview from Behance",
        caption: "Published UX/UI flow for the CFI Portal.",
      },
    ],
    client: "CFI",
    duration: "[CONTENT NEEDED]",
    platform: "Web portal",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI flow design for the CFI Portal.",
    behance: "https://www.behance.net/gallery/167129521/UXUI-Flow-for-CFI-Portal",
    tier: "featured",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Enterprise portals accumulate tools until the original job is hard to find. Users do not experience 'modules'. They experience a sequence of tasks — and every extra click is a tax.",
      questions: [
        "What are the primary jobs in this portal?",
        "Where do people get stuck between those jobs?",
        "What should stay global, and what should stay contextual?",
      ],
    },
    understanding: {
      body: "The public artifact is a UX/UI flow, not a research report. That is still evidence: it shows how the product was structured as a journey rather than a set of disconnected screens.",
      evidence: [
        "Behance project: UXUI Flow for CFI Portal",
        "Flow-first presentation rather than a visual-only mockup dump",
      ],
    },
    definition: {
      statement: "If the flow is unclear, the interface cannot save it.",
      body: "The design problem was sequence and grouping. A portal becomes usable when related actions live together and the next step is obvious.",
    },
    exploration: {
      body: "Flow work is where IA decisions become visible. Add the actual maps, discarded branches, and the reason they changed.",
      notes: [
        "[CONTENT NEEDED] Information architecture",
        "[CONTENT NEEDED] Key happy paths and edge cases",
        "[CONTENT NEEDED] Screens that were cut",
      ],
    },
    system: {
      body: "Portal systems live or die on navigation, tables, and forms. Consistency here is not aesthetic — it is how people learn the product.",
      pieces: ["Navigation", "Tables", "Forms", "Page structure"],
    },
    experience: {
      body: "The flow overview is the available visual. Replace this section with annotated portal screens as they are added.",
    },
    outcome: {
      body: "No numerical results are available. The qualitative outcome is a documented flow for navigating the CFI Portal.",
      qualitative: ["Made the portal's path through tasks more explicit."],
    },
    learned:
      "Enterprise UX is mostly choreography. The screens can be quiet. The sequence has to be right. I would rather show a clear flow than a beautiful dead-end.",
    contentNeeded: needed,
  },
  {
    slug: "freelancer-management",
    title: "Freelancer Management Tool",
    tagline: "A working surface for managing people, work, and status without extra ceremony.",
    problemStatement:
      "Ops tools get noisy when every object — people, projects, invoices — competes on one screen. This product needed a calmer operational structure.",
    role: "UX / UI Designer",
    productType: "Web app",
    industry: "Operations / workforce",
    year: "[CONTENT NEEDED]",
    cover: "/projects/freelancer-management.png",
    images: [
      {
        src: "/projects/freelancer-management.png",
        alt: "Freelancer management tool screens from Behance",
        caption: "Published screens from the freelancer management tool project.",
      },
    ],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Web",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI for a freelancer management tool.",
    behance: "https://www.behance.net/gallery/167128191/Freelancer-management-tool",
    tier: "featured",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Managers and coordinators need to see who is available, what is in progress, and what is blocked. Tools that mix those questions into one undifferentiated dashboard slow everyone down.",
      questions: [
        "Who is the primary operator of this tool?",
        "What is the daily job to be done?",
        "Which objects need their own space?",
      ],
    },
    understanding: {
      body: "Research files are not in the repo. The published UI is the evidence of how the product was framed.",
      evidence: ["Behance project: Freelancer management tool"],
    },
    definition: {
      statement: "An operations tool should answer today's question, not display everything it knows.",
      body: "The design problem was reducing operational noise: status, people, and work needed a structure people could scan in seconds.",
    },
    exploration: {
      body: "Typical explorations for this product type include list vs. board, filters vs. search, and how much detail belongs on the overview.",
      notes: ["[CONTENT NEEDED] Early concepts", "[CONTENT NEEDED] Iteration notes"],
    },
    system: {
      body: "Tables, filters, and status chips do the heavy lifting. The system has to make states readable before it makes them pretty.",
      pieces: ["Tables", "Status", "Filters", "Cards"],
    },
    experience: {
      body: "Published screens from Behance. Add annotated close-ups of the key workflows.",
    },
    outcome: {
      body: "No metrics published. Qualitative intent: a clearer operational workflow.",
      qualitative: ["Structured freelancer-related work into a more scanable tool."],
    },
    learned:
      "Internal tools are where UX honesty shows. There is no marketing page to hide behind. If the table is confusing, people will open a spreadsheet instead.",
    contentNeeded: needed,
  },
  {
    slug: "wincofoods",
    title: "Wincofoods",
    tagline: "Designing grocery shopping as a flow, not a pile of product tiles.",
    problemStatement:
      "Grocery apps fail when browsing, searching, and checkout feel like three different products. This work focused on the shopping path.",
    role: "UX / UI Designer",
    productType: "Mobile commerce",
    industry: "Grocery / retail",
    year: "[CONTENT NEEDED]",
    cover: "/projects/wincofoods.png",
    images: [
      {
        src: "/projects/wincofoods.png",
        alt: "Wincofoods UX/UI flow from Behance",
        caption: "Published UX/UI flow for Wincofoods.",
      },
    ],
    client: "Wincofoods",
    duration: "[CONTENT NEEDED]",
    platform: "Mobile",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI flow for Wincofoods.",
    behance: "https://www.behance.net/gallery/167127725/UXUI-Flow-Wincofoods",
    tier: "featured",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Grocery shopping is repetitive and time-sensitive. People come back with a mental list. If categories, search, and cart fight each other, the app becomes slower than the store.",
      questions: [
        "How do people usually start — search or browse?",
        "What makes a product decision fast?",
        "Where does checkout add friction?",
      ],
    },
    understanding: {
      body: "The public artifact is a UX/UI flow. Detailed research is not included here.",
      evidence: ["Behance project: UXUI Flow Wincofoods"],
    },
    definition: {
      statement: "The product should feel like one trip, not a set of disconnected screens.",
      body: "The focused problem was continuity: browse, decide, and check out as a single mental model.",
    },
    exploration: {
      body: "Add the actual IA, category model, and rejected cart patterns.",
      notes: ["[CONTENT NEEDED] Category structure", "[CONTENT NEEDED] Checkout flow"],
    },
    system: {
      body: "Commerce systems need product cards, quantity controls, and a persistent cart that never surprises the user.",
      pieces: ["Product cards", "Navigation", "Cart", "Quantity and price"],
    },
    experience: {
      body: "Flow overview from Behance. Swap in high-resolution shopping screens when available.",
    },
    outcome: {
      body: "No metrics published.",
      qualitative: ["Framed grocery shopping as a continuous mobile flow."],
    },
    learned:
      "Retail UX is humility work. People already know how they shop. The interface should get out of the way of that habit — then earn the right to improve it.",
    contentNeeded: needed,
  },
  {
    slug: "online-education",
    title: "Online Education",
    tagline: "Making learning feel sequential when content is easy to dump and hard to finish.",
    problemStatement:
      "Education products often catalogue content instead of guiding progress. This work looks at how a learner moves through a course.",
    role: "UX / UI Designer",
    productType: "Education app / web",
    industry: "EdTech",
    year: "[CONTENT NEEDED]",
    cover: "/projects/online-education.jpg",
    images: [
      {
        src: "/projects/online-education.jpg",
        alt: "Online education product screens from Behance",
        caption: "Published screens from the Online education Behance project.",
      },
      {
        src: "/projects/online-education-alt.jpg",
        alt: "Additional online education screens from Behance",
        caption: "Related online education screens from the same Behance profile.",
      },
    ],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Mobile / web",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI for an online education experience.",
    behance: "https://www.behance.net/gallery/102827929/Online-education",
    tier: "featured",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Learners need to know where they are, what is next, and whether they are done. Catalog-first products create anxiety: lots of content, little orientation.",
      questions: [
        "What does progress look like?",
        "How is a lesson different from a course?",
        "What should happen when someone returns after a week?",
      ],
    },
    understanding: {
      body: "Available evidence is the published UI. No research archive is in this repo.",
      evidence: ["Behance project: Online education"],
    },
    definition: {
      statement: "A learning product should make the next step obvious.",
      body: "The design problem was orientation — not adding more course tiles.",
    },
    exploration: {
      body: "Typical explorations: home vs. continue learning, lesson player, and how progress is represented.",
      notes: ["[CONTENT NEEDED] Learner flows", "[CONTENT NEEDED] Wireframes"],
    },
    system: {
      body: "Course cards, progress, and a calm player UI are the core system pieces.",
      pieces: ["Course cards", "Progress", "Lesson layout", "Navigation"],
    },
    experience: {
      body: "Published education screens from Behance.",
    },
    outcome: {
      body: "No metrics published.",
      qualitative: ["Framed online learning as a path through content, not only a catalogue."],
    },
    learned:
      "If a learner cannot resume in one tap, the product has already lost them. Continuity is the UX.",
    contentNeeded: needed,
  },
  {
    slug: "classroom-app",
    title: "Classroom Online Education App",
    tagline: "A classroom-shaped product for following lessons, not just collecting them.",
    problemStatement:
      "Classroom apps need a different rhythm than content marketplaces — people, sessions, and materials have to stay in one place.",
    role: "UX / UI Designer",
    productType: "Mobile app",
    industry: "EdTech",
    year: "[CONTENT NEEDED]",
    cover: "/projects/classroom-app.jpg",
    images: [
      {
        src: "/projects/classroom-app.jpg",
        alt: "Classroom online education app screens from Behance",
      },
    ],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Mobile",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI for a classroom online education app.",
    behance: "https://www.behance.net/gallery/101047023/Class-room-online-education-app",
    tier: "more",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "A classroom product has to hold people and materials together. If those live in separate corners of the app, teaching and learning become admin work.",
      questions: ["Who is the primary user — student or teacher?", "What is a session?", "Where do notes and materials live?"],
    },
    understanding: {
      body: "Evidence is the published Behance project.",
      evidence: ["Behance: Class room online education app"],
    },
    definition: {
      statement: "The classroom is the unit of design, not the individual screen.",
      body: "The focused problem was keeping class context intact as people move between lessons and materials.",
    },
    exploration: {
      body: "[CONTENT NEEDED] Add exploration notes.",
      notes: ["[CONTENT NEEDED]"],
    },
    system: {
      body: "Lists, lesson cards, and a simple information hierarchy for class context.",
      pieces: ["Cards", "Lists", "Navigation"],
    },
    experience: { body: "Published classroom app screens." },
    outcome: {
      body: "No metrics published.",
      qualitative: ["Explored a classroom-centered education app structure."],
    },
    learned: "Context switching is the hidden cost in education products. Hold the class together.",
    contentNeeded: needed,
  },
  {
    slug: "grocery-app",
    title: "Grocery App Tamil",
    tagline: "A local grocery experience designed in Tamil — language as part of the UX, not a layer on top.",
    problemStatement:
      "If the language of the interface is not the language of the shopper, every task gets slower. This project treats Tamil as a first-class part of the product.",
    role: "UX / UI Designer",
    productType: "Mobile app",
    industry: "Grocery / retail",
    year: "[CONTENT NEEDED]",
    cover: "/projects/grocery-app.jpg",
    images: [
      {
        src: "/projects/grocery-app.jpg",
        alt: "Grocery app in Tamil, screens from Behance",
      },
    ],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Mobile",
    team: "[CONTENT NEEDED]",
    contribution: "UX/UI for a Tamil grocery app.",
    behance: "https://www.behance.net/gallery/99983455/Grocery-app-tamil",
    tier: "more",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Localized products fail when type, line length, and labels are designed in English and translated later. Grocery shopping in Tamil needed the language to be native to the layout.",
      questions: ["Can labels stay readable at Tamil line lengths?", "Are categories named the way people actually shop?"],
    },
    understanding: {
      body: "Published UI is the evidence. No research archive in this repo.",
      evidence: ["Behance: Grocery app tamil"],
    },
    definition: {
      statement: "Language is a UX decision.",
      body: "The problem was not only catalog design. It was making the product feel local and usable in Tamil.",
    },
    exploration: {
      body: "[CONTENT NEEDED] Add exploration notes.",
      notes: ["[CONTENT NEEDED]"],
    },
    system: {
      body: "Type scale, product cards, and navigation that can hold Tamil comfortably.",
      pieces: ["Typography", "Product cards", "Navigation"],
    },
    experience: { body: "Published grocery app screens." },
    outcome: {
      body: "No metrics published.",
      qualitative: ["Designed a grocery shopping UI with Tamil as a primary language."],
    },
    learned: "If the type cannot hold the language, the product is not local. It is translated.",
    contentNeeded: needed,
  },
  {
    slug: "bitcoin-landing",
    title: "Bitcoin Landing Page",
    tagline: "A long-form marketing page for a dense topic — hierarchy over hype.",
    problemStatement:
      "Crypto landing pages often shout. This one needed a structure people could scan without trusting every headline.",
    role: "UX / UI Designer",
    productType: "Marketing website",
    industry: "Crypto / finance",
    year: "[CONTENT NEEDED]",
    cover: "/projects/bitcoin-landing.jpg",
    images: [
      {
        src: "/projects/bitcoin-landing.jpg",
        alt: "Full Bitcoin landing page composition from Behance",
        caption: "Full-page composition published on Behance.",
      },
    ],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Web",
    team: "[CONTENT NEEDED]",
    contribution: "Landing page UX/UI.",
    behance: "https://www.behance.net/gallery/100331137/Bitcoin-Landing-page",
    tier: "archive",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "A landing page has seconds to explain what the product is and why it might be relevant. Dense financial topics make that harder.",
      questions: ["What is the page actually selling?", "What should be visible without scrolling?"],
    },
    understanding: {
      body: "The artifact is a long landing composition.",
      evidence: ["Behance: Bitcoin Landing page"],
    },
    definition: {
      statement: "Clarity beats spectacle on a page that asks for trust.",
      body: "The design problem was pacing: sections that can be scanned, not a single wall of claims.",
    },
    exploration: {
      body: "[CONTENT NEEDED]",
      notes: ["[CONTENT NEEDED]"],
    },
    system: {
      body: "Type, section rhythm, and CTAs.",
      pieces: ["Typography", "Sections", "Buttons"],
    },
    experience: { body: "Full landing page visual from Behance." },
    outcome: {
      body: "No metrics published. This is earlier / experimental marketing work.",
      qualitative: ["Explored long-form hierarchy for a crypto marketing page."],
    },
    learned: "A landing page is an information-architecture problem wearing marketing clothes.",
    contentNeeded: needed,
  },
  {
    slug: "lecture-notes",
    title: "Lecture Notes",
    tagline: "Earlier visual and product exploration around learning materials.",
    problemStatement: "Experimental / older work from the Behance archive.",
    role: "Designer",
    productType: "Exploration",
    industry: "Education",
    year: "[CONTENT NEEDED]",
    cover: "/projects/lecture-notes.jpg",
    images: [{ src: "/projects/lecture-notes.jpg", alt: "Lecture notes project cover from Behance" }],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "[CONTENT NEEDED]",
    team: "[CONTENT NEEDED]",
    contribution: "[CONTENT NEEDED]",
    behance: "https://www.behance.net/gallery/103012657/Lecture-notes",
    tier: "archive",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Archive project. Add the original problem statement when you have it.",
      questions: ["[CONTENT NEEDED]"],
    },
    understanding: {
      body: "Only the Behance cover is available in this repo.",
      evidence: ["Behance: Lecture notes"],
    },
    definition: {
      statement: "[CONTENT NEEDED]",
      body: "Older experimental work. Replace this copy with the real case.",
    },
    exploration: { body: "[CONTENT NEEDED]", notes: ["[CONTENT NEEDED]"] },
    system: { body: "[CONTENT NEEDED]", pieces: ["[CONTENT NEEDED]"] },
    experience: { body: "Cover image from Behance." },
    outcome: {
      body: "No outcomes published.",
      qualitative: ["Kept in the archive as part of the public Behance history."],
    },
    learned: "[CONTENT NEEDED]",
    contentNeeded: needed,
  },
  {
    slug: "registration-form",
    title: "Registration Form Design",
    tagline: "A focused look at form UX — still one of the highest-friction surfaces in any product.",
    problemStatement: "Forms are where products quietly lose people. This is an earlier study in that problem.",
    role: "Designer",
    productType: "Form / UI",
    industry: "[CONTENT NEEDED]",
    year: "[CONTENT NEEDED]",
    cover: "/projects/registration-form.jpg",
    images: [{ src: "/projects/registration-form.jpg", alt: "Registration form design from Behance" }],
    client: "[CONTENT NEEDED]",
    duration: "[CONTENT NEEDED]",
    platform: "Web / UI",
    team: "[CONTENT NEEDED]",
    contribution: "Registration form design.",
    behance: "https://www.behance.net/gallery/100354571/Registration-form-design",
    tier: "archive",
    tools: ["[CONTENT NEEDED]"],
    problem: {
      heading: "The problem",
      body: "Registration is a tax. Every extra field is a reason to leave. This earlier piece looks at that surface in isolation.",
      questions: ["What is required?", "What can wait?"],
    },
    understanding: {
      body: "Published form UI from Behance.",
      evidence: ["Behance: Registration form design"],
    },
    definition: {
      statement: "A form should ask only what the next step requires.",
      body: "The problem is restraint.",
    },
    exploration: { body: "[CONTENT NEEDED]", notes: ["[CONTENT NEEDED]"] },
    system: { body: "Inputs, labels, and validation states.", pieces: ["Forms", "Buttons", "States"] },
    experience: { body: "Published form design." },
    outcome: {
      body: "No metrics. Archive study.",
      qualitative: ["Documented an early form-design study."],
    },
    learned: "Most products still lose people in forms. It is unglamorous work and some of the most important.",
    contentNeeded: needed,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function featuredProjects() {
  return projects.filter((project) => project.tier === "featured");
}

export function moreProjects() {
  return projects.filter((project) => project.tier === "more");
}

export function archiveProjects() {
  return projects.filter((project) => project.tier === "archive");
}

export function relatedProjects(slug: string, count = 2) {
  const current = getProject(slug);
  const pool = projects.filter((project) => project.slug !== slug);
  const sameTier = pool.filter((project) => project.tier === current?.tier);
  const rest = pool.filter((project) => project.tier !== current?.tier);
  return [...sameTier, ...rest].slice(0, count);
}
