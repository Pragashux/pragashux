import type { LocationId } from './locations'
import type { CourseId } from './courses'

export type Batch = {
  id: string
  locationId: LocationId
  courseId: CourseId
  schedule: 'Weekday' | 'Weekend'
  startDate: string
  time: string
  availability: string
}

export const batches: Batch[] = [
  {
    id: 'chn-uiux-weekend',
    locationId: 'chennai',
    courseId: 'uiux',
    schedule: 'Weekend',
    startDate: '[DATE]',
    time: '10:00 AM – 1:00 PM',
    availability: 'Seats to be confirmed',
  },
  {
    id: 'chn-uiux-weekday',
    locationId: 'chennai',
    courseId: 'uiux',
    schedule: 'Weekday',
    startDate: '[DATE]',
    time: 'To be confirmed',
    availability: 'Seats to be confirmed',
  },
  {
    id: 'cbe-product-weekend',
    locationId: 'coimbatore',
    courseId: 'product',
    schedule: 'Weekend',
    startDate: '[DATE]',
    time: 'To be confirmed',
    availability: 'Seats to be confirmed',
  },
  {
    id: 'pondy-uiux-weekend',
    locationId: 'pondicherry',
    courseId: 'uiux',
    schedule: 'Weekend',
    startDate: '[DATE]',
    time: 'To be confirmed',
    availability: 'Seats to be confirmed',
  },
  {
    id: 'online-ai-weekend',
    locationId: 'online',
    courseId: 'ai',
    schedule: 'Weekend',
    startDate: '[DATE]',
    time: 'To be confirmed',
    availability: 'Seats to be confirmed',
  },
  {
    id: 'online-uiux-weekday',
    locationId: 'online',
    courseId: 'uiux',
    schedule: 'Weekday',
    startDate: '[DATE]',
    time: 'To be confirmed',
    availability: 'Seats to be confirmed',
  },
]
