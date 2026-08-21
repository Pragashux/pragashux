export type Project = {
  id: string
  name: string
  studentName: string
  category: string
  description: string
  image: string
  layout: 'wide' | 'tall'
}

export const projects: Project[] = [
  {
    id: 'finpay',
    name: 'FinPay',
    studentName: 'Student name to be added',
    category: 'Fintech mobile experience',
    description: 'A calmer way to understand money, spend and savings on a phone.',
    image: '/images/finpay-project.png',
    layout: 'tall',
  },
  {
    id: 'medicare',
    name: 'MediCare',
    studentName: 'Student name to be added',
    category: 'Healthcare appointment experience',
    description: 'Booking care without the waiting-room anxiety of typical hospital apps.',
    image: '/images/medicare-project.png',
    layout: 'tall',
  },
  {
    id: 'localeats',
    name: 'LocalEats',
    studentName: 'Student name to be added',
    category: 'Food discovery platform',
    description: 'Finding neighbourhood food with taste, maps and honest recommendations.',
    image: '/images/localeats-project.png',
    layout: 'wide',
  },
  {
    id: 'tripmate',
    name: 'TripMate',
    studentName: 'Student name to be added',
    category: 'Travel planning product',
    description: 'Planning a trip as a shared, visual conversation rather than a spreadsheet.',
    image: '/images/tripmate-project.png',
    layout: 'tall',
  },
  {
    id: 'learnly',
    name: 'Learnly',
    studentName: 'Student name to be added',
    category: 'Education platform',
    description: 'A focused learning space that treats progress as a story, not a scoreboard.',
    image: '/images/learnly-project.png',
    layout: 'wide',
  },
]
