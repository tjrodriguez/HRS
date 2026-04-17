import { BusinessProvider } from "@/context/BusinessContext"
import { Layout } from "@/components/layout/layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BusinessProvider>
      <Layout>
        {children}
      </Layout>
    </BusinessProvider>
  )
}