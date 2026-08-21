export type Mentor = {
  id: string
  name: string
  role: string
  /** Leave empty until the academy confirms years, companies and titles. */
  experience: string
  expertise: string[]
  photo: string | null
  bio: string
}

export const mentors: Mentor[] = [
  {
    id: 'pragash-s',
    name: 'Pragash S',
    role: 'UX/Product Designer',
    experience: 'Experience details to be added by the academy.',
    expertise: ['UX Strategy', 'Product Design', 'Design Systems', 'AI Design'],
    photo: '/images/mentor-pragash.png',
    bio: 'Mentors learners on how to think through product problems, not only how to style screens.',
  },
]
