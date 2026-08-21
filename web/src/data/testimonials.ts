export type Testimonial = {
  id: string
  quote: string
  name: string
  course: string
  /** Only fill when the learner has verified this publicly. */
  currentRole: string | null
  photo: string | null
  placeholder: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Replace this quote with a real learner story. Until then, this card shows the structure we will use.',
    name: 'Learner name',
    course: 'UI/UX Design',
    currentRole: null,
    photo: null,
    placeholder: true,
  },
  {
    id: 't2',
    quote:
      'A short reflection on projects, mentorship and how the course changed the way they think about design.',
    name: 'Learner name',
    course: 'Product Design',
    currentRole: null,
    photo: null,
    placeholder: true,
  },
  {
    id: 't3',
    quote:
      'Keep testimonials specific: a project, a critique, a moment of clarity — not generic praise.',
    name: 'Learner name',
    course: 'AI for Designers',
    currentRole: null,
    photo: null,
    placeholder: true,
  },
  {
    id: 't4',
    quote:
      'Working professionals can speak to weekday or weekend rhythm, portfolio reviews and career conversations.',
    name: 'Learner name',
    course: 'UI/UX Design',
    currentRole: null,
    photo: null,
    placeholder: true,
  },
]
