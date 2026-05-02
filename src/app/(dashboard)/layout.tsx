import { BusinessProvider } from "@/context/BusinessContext"
import { PageLayout } from "@/components/layout/page-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BusinessProvider>
      <PageLayout>
        {children}
      </PageLayout>
    </BusinessProvider>
  )
}