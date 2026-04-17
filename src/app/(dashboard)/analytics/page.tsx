import { Analytics } from '@/components/analytics/analytics'

export const metadata = {
  title: 'Analytics - HoliDate',
  description: 'View engagement metrics and campaign performance',
}

/**
 * Analytics page - displays engagement data and performance metrics
 * Shows views, likes, comments, shares, and reach for each holiday campaign
 */
export default function AnalyticsPage() {
  return <Analytics />
}
