export type CourseId =
  | 'uiux'
  | 'product'
  | 'research'
  | 'systems'
  | 'ai'
  | 'figma'
  | 'framer'
  | 'career'

export type Course = {
  id: CourseId
  name: string
  shortName: string
  summary: string
  duration: string
  mode: string
  featured: boolean
  outcomes: string[]
}

export const courses: Course[] = [
  {
    id: 'uiux',
    name: 'UI/UX Design',
    shortName: 'UI/UX',
    summary: 'Learn the complete UX/UI process from research to final interface.',
    duration: '5 Months',
    mode: 'Offline + Online',
    featured: true,
    outcomes: [
      'End-to-end product case studies',
      'Research-led interface design',
      'Figma fluency for real teams',
    ],
  },
  {
    id: 'product',
    name: 'Product Design',
    shortName: 'Product',
    summary: 'Learn to solve complex product problems and create scalable digital experiences.',
    duration: '5 Months',
    mode: 'Offline + Online',
    featured: true,
    outcomes: [
      'Problem framing and strategy',
      'Systems thinking for products',
      'Stakeholder-ready presentations',
    ],
  },
  {
    id: 'ai',
    name: 'AI for Designers',
    shortName: 'AI Design',
    summary:
      'Learn how AI can accelerate research, ideation, content, visual exploration and prototyping.',
    duration: '6–8 Weeks',
    mode: 'Online + Offline',
    featured: true,
    outcomes: [
      'Responsible AI in the design process',
      'Faster research and exploration',
      'Prototype with modern AI workflows',
    ],
  },
  {
    id: 'research',
    name: 'UX Research',
    shortName: 'Research',
    summary: 'Plan studies, interview users, synthesise insights and turn findings into product decisions.',
    duration: 'To be confirmed',
    mode: 'Offline + Online',
    featured: false,
    outcomes: ['Research plans', 'Insight synthesis', 'Evidence-backed recommendations'],
  },
  {
    id: 'systems',
    name: 'Design Systems',
    shortName: 'Systems',
    summary: 'Build scalable component libraries, tokens and documentation that teams can actually use.',
    duration: 'To be confirmed',
    mode: 'Offline + Online',
    featured: false,
    outcomes: ['Tokens and components', 'Governance', 'Designer–developer handoff'],
  },
  {
    id: 'figma',
    name: 'Figma',
    shortName: 'Figma',
    summary: 'Master the tool modern product teams use — from auto layout to variables and prototyping.',
    duration: 'To be confirmed',
    mode: 'Offline + Online',
    featured: false,
    outcomes: ['Auto layout', 'Variables', 'Interactive prototypes'],
  },
  {
    id: 'framer',
    name: 'Framer',
    shortName: 'Framer',
    summary: 'Turn design intent into living, responsive websites and high-fidelity product demos.',
    duration: 'To be confirmed',
    mode: 'Offline + Online',
    featured: false,
    outcomes: ['Responsive layouts', 'Interactions', 'Publishing workflows'],
  },
  {
    id: 'career',
    name: 'Portfolio & Career Preparation',
    shortName: 'Career',
    summary: 'Shape case studies, a designer resume, interview stories and a confident presentation.',
    duration: 'To be confirmed',
    mode: 'Offline + Online',
    featured: false,
    outcomes: ['Case study narrative', 'Interview practice', 'Career direction'],
  },
]

export const featuredCourses = courses.filter((course) => course.featured)
