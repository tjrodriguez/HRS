import { HolidayCalendar } from '@/components/holidays/holiday-calendar'

export const metadata = {
  title: 'Holiday Calendar - HoliDate',
  description: 'Browse upcoming holidays and create marketing campaigns',
}

/**
 * Holiday Calendar page - displays all upcoming holidays
 * Allows users to search, filter, and create campaigns for specific holidays
 */
export default function HolidaysPage() {
  return <HolidayCalendar />
}
