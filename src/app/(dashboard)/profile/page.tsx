import { BusinessProfile } from '@/components/profile/business-profile'

export const metadata = {
  title: 'Business Profile - HolidayBoost',
  description: 'Manage your business information and preferences',
}

/**
 * Profile page - displays and manages business profile
 * User can update business name, niche, tone, social platforms, and preferences
 */
export default function ProfilePage() {
  return <BusinessProfile />
}
