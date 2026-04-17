import { BusinessProfile } from '@/components/profile/business-profile'

export const metadata = {
  title: 'Business Profile - HoliDate',
  description: 'Manage your business information',
}

/**
 * Business Profile page - manage business details for personalized suggestions
 * Users can update business type, description, location, and target audience
 */
export default function BusinessPage() {
  return <BusinessProfile />
}
