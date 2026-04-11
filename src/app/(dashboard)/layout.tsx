import { BusinessProvider } from "@/components/context/BusinessContext"
import { Layout as ConversionLayout } from "@/components/conversion/Layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BusinessProvider>
      <ConversionLayout>
        {children}
      </ConversionLayout>
    </BusinessProvider>
  )
}