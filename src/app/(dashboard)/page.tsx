import * as React from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'

export const metadata = {
  title: 'Dashboard - HoliDate',
  description: 'View upcoming holidays and manage your marketing campaigns',
}

/**
 * Dashboard page - main entry point for authenticated users
 * Displays upcoming holidays and campaign overview
 */
export default function DashboardPage(): React.ReactElement {
  return <Dashboard />
}
