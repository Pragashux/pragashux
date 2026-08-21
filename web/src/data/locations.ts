export type LocationId = 'chennai' | 'coimbatore' | 'pondicherry' | 'online'

export type AcademyLocation = {
  id: LocationId
  city: string
  kind: 'Offline Campus' | 'Online Learning'
  blurb: string
  upcomingBatch: string
  schedule: string
  courseAvailability: string
}

export const locations: AcademyLocation[] = [
  {
    id: 'chennai',
    city: 'Chennai',
    kind: 'Offline Campus',
    blurb: 'Learn in studio with peers, critiques and hands-on project reviews.',
    upcomingBatch: 'Dates to be announced',
    schedule: 'Weekday and weekend options',
    courseAvailability: 'UI/UX, Product Design, AI for Designers and more',
  },
  {
    id: 'coimbatore',
    city: 'Coimbatore',
    kind: 'Offline Campus',
    blurb: 'A focused campus for learners who want industry-led design education close to home.',
    upcomingBatch: 'Dates to be announced',
    schedule: 'Weekday and weekend options',
    courseAvailability: 'UI/UX, Product Design, AI for Designers and more',
  },
  {
    id: 'pondicherry',
    city: 'Pondicherry',
    kind: 'Offline Campus',
    blurb: 'A quieter coastal city with the same practical, mentor-led classroom experience.',
    upcomingBatch: 'Dates to be announced',
    schedule: 'Weekday and weekend options',
    courseAvailability: 'UI/UX, Product Design, AI for Designers and more',
  },
  {
    id: 'online',
    city: 'Online',
    kind: 'Online Learning',
    blurb: 'Live sessions, project reviews and mentorship from anywhere in India.',
    upcomingBatch: 'Dates to be announced',
    schedule: 'Weekday and weekend options',
    courseAvailability: 'All listed programmes, subject to batch schedule',
  },
]
