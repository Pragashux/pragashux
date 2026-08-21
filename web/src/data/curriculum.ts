export type CurriculumModule = {
  number: string
  title: string
  summary: string
  topics: string[]
}

export const curriculum: CurriculumModule[] = [
  {
    number: '01',
    title: 'Design Fundamentals',
    summary: 'See, structure and talk about visual decisions with intent.',
    topics: ['Visual hierarchy', 'Contrast and alignment', 'Composition basics', 'Craft critique'],
  },
  {
    number: '02',
    title: 'Design Thinking',
    summary: 'Frame problems before jumping to screens.',
    topics: ['Problem statements', 'How might we', 'Divergent and convergent thinking', 'Stakeholder maps'],
  },
  {
    number: '03',
    title: 'User Research',
    summary: 'Talk to people, not just dashboards.',
    topics: ['Research plans', 'Interviews', 'Surveys', 'Observation'],
  },
  {
    number: '04',
    title: 'Personas & Empathy',
    summary: 'Turn raw notes into human understanding.',
    topics: ['Affinity mapping', 'Personas', 'Empathy maps', 'Jobs to be done'],
  },
  {
    number: '05',
    title: 'User Journey',
    summary: 'Follow a person through time, emotion and friction.',
    topics: ['Current-state journeys', 'Pain points', 'Opportunity areas', 'Service moments'],
  },
  {
    number: '06',
    title: 'Information Architecture',
    summary: 'Give content a place so people can find it.',
    topics: ['Card sorting', 'Sitemaps', 'Navigation models', 'Content grouping'],
  },
  {
    number: '07',
    title: 'User Flows',
    summary: 'Design the path, not only the page.',
    topics: ['Task flows', 'Happy paths and edge cases', 'Decision points', 'Error states'],
  },
  {
    number: '08',
    title: 'Wireframing',
    summary: 'Think in structure before polish.',
    topics: ['Paper and digital lo-fi', 'Layout systems', 'Annotation', 'Rapid iteration'],
  },
  {
    number: '09',
    title: 'UI Design',
    summary: 'Make interfaces that feel considered, not decorated.',
    topics: ['Visual language', 'Spacing', 'States and variants', 'Mobile and web patterns'],
  },
  {
    number: '10',
    title: 'Typography & Colour',
    summary: 'Use type and colour as tools, not decoration.',
    topics: ['Type scales', 'Readability', 'Accessible contrast', 'Colour systems'],
  },
  {
    number: '11',
    title: 'Design Systems',
    summary: 'Build once, scale with the product.',
    topics: ['Tokens', 'Components', 'Documentation', 'Governance'],
  },
  {
    number: '12',
    title: 'Prototyping',
    summary: 'Make the idea testable.',
    topics: ['Figma prototyping', 'Micro-interactions', 'Handoff', 'Clickable demos'],
  },
  {
    number: '13',
    title: 'Usability Testing',
    summary: 'Watch people use it. Then change it.',
    topics: ['Test scripts', 'Moderated sessions', 'Finding issues', 'Prioritising fixes'],
  },
  {
    number: '14',
    title: 'Responsive Design',
    summary: 'Design for phones, tablets and desktops as one system.',
    topics: ['Breakpoints', 'Adaptive patterns', 'Grids', 'Touch targets'],
  },
  {
    number: '15',
    title: 'AI for Designers',
    summary: 'Use AI to move faster without skipping thinking.',
    topics: ['Research assistance', 'Ideation', 'Visual exploration', 'Responsible use'],
  },
  {
    number: '16',
    title: 'Figma',
    summary: 'Work the way product teams actually work.',
    topics: ['Auto layout', 'Variables', 'Components', 'Collaboration'],
  },
  {
    number: '17',
    title: 'Framer',
    summary: 'Ship living, high-fidelity experiences.',
    topics: ['Layouts', 'Interactions', 'CMS basics', 'Publishing'],
  },
  {
    number: '18',
    title: 'Portfolio & Career',
    summary: 'Tell the story of your work so it can open conversations.',
    topics: ['Case studies', 'Resume', 'Interview practice', 'Presentation'],
  },
]

export const processJourney = [
  'Problem',
  'Research',
  'Insight',
  'Strategy',
  'UX',
  'UI',
  'Prototype',
  'Testing',
  'Launch',
]
