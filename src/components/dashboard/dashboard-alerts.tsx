"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CalendarDays, ArrowRight, Sparkles, Clock } from "lucide-react"
import { CampaignGeneratorModal } from "@/components/campaigns/generator-modal"
import Link from "next/link"

export type Holiday = {
  id: number
  name: string
  date: string // YYYY-MM-DD
  type: string
  category: "retail" | "cultural" | "seasonal" | "international" | "local" | "federal"
  description: string
}

interface DashboardAlertsProps {
  holidays: Holiday[]
}

export function DashboardAlerts({ holidays }: DashboardAlertsProps) {
  const { actionRequired, upcoming } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const actionRequired: Holiday[] = []
    const upcoming: Holiday[] = []

    holidays.forEach((holiday) => {
      const holidayDate = new Date(holiday.date)
      const diffTime = holidayDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays >= 0 && diffDays <= 7) {
        actionRequired.push(holiday)
      } else if (diffDays > 7 && diffDays <= 60) {
        upcoming.push(holiday)
      }
    })

    // Sort by soonest
    actionRequired.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return { actionRequired, upcoming }
  }, [holidays])

  return (
    <div className="space-y-6">
      {/* 7-Day Action Required Alerts */}
      {actionRequired.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Action Required (Next 7 Days)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {actionRequired.map((holiday) => (
              <Alert key={holiday.id} variant="default" className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertTitle className="text-destructive font-semibold">{holiday.name}</AlertTitle>
                <AlertDescription className="text-destructive/80 mt-1">
                  <p className="mb-3 text-sm">{new Date(holiday.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  <CampaignGeneratorModal>
                    <Button size="sm" variant="destructive" className="w-full gap-2">
                      <Sparkles className="h-4 w-4" /> Generate Post Now
                    </Button>
                  </CampaignGeneratorModal>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* 60-Day Upcoming Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Upcoming in 60 Days
          </h2>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/holidays" />}>
            <span className="gap-2 flex items-center">
              View All <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </div>
        
        {upcoming.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((holiday) => (
              <Card key={holiday.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(holiday.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {holiday.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{holiday.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground flex-grow">
                  {holiday.description}
                </CardContent>
                <CardFooter>
                  <CampaignGeneratorModal>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Draft Campaign
                    </Button>
                  </CampaignGeneratorModal>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
              <CalendarDays className="h-8 w-8 mb-2 opacity-20" />
              <p>No upcoming holidays in the next 60 days.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
