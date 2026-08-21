import { Batches } from '../components/Batches'
import { CareerSupport } from '../components/CareerSupport'
import { CourseSection } from '../components/CourseSection'
import { CTA } from '../components/CTA'
import { Curriculum } from '../components/Curriculum'
import { DesignProcess } from '../components/DesignProcess'
import { FAQ } from '../components/FAQ'
import { Hero } from '../components/Hero'
import { Locations } from '../components/Locations'
import { Mentors } from '../components/Mentors'
import { Pricing } from '../components/Pricing'
import { Projects } from '../components/Projects'
import { Testimonials } from '../components/Testimonials'
import { WhySnailtechs } from '../components/WhySnailtechs'
import { Workshop } from '../components/Workshop'

export function HomePage() {
  return (
    <>
      <Hero />
      <Locations />
      <WhySnailtechs />
      <CourseSection />
      <Curriculum />
      <Pricing />
      <Projects />
      <DesignProcess />
      <Mentors />
      <CareerSupport />
      <Testimonials />
      <Batches />
      <Workshop />
      <FAQ />
      <CTA />
    </>
  )
}
