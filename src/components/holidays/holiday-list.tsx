"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, ShoppingBag, Sparkles, Search, Filter } from "lucide-react"
import { CampaignGeneratorModal } from "@/components/campaigns/generator-modal"
import { Calendar } from "@/components/ui/calendar"

export type Holiday = {
  id: number
  name: string
  date: string
  type: string
  category: "retail" | "international" | "local" | "cultural" | "seasonal"
  description: string
}

export function HolidayList({ initialHolidays }: { initialHolidays: Holiday[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  const filteredHolidays = initialHolidays.filter((holiday) => {
    const matchesSearch = holiday.name.toLowerCase().includes(search.toLowerCase()) || holiday.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "all" || holiday.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Left Column: Flow Control & List */}
      <div className="md:col-span-2 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search holidays..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={category} onValueChange={(val) => setCategory(val || "all")}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="retail">Retail & Shopping</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="local">Local / Regional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="text-xl font-semibold tracking-tight">
          {filteredHolidays.length} {filteredHolidays.length === 1 ? "Holiday" : "Holidays"} Found
        </h2>

        {filteredHolidays.length > 0 ? (
          filteredHolidays.map((holiday) => (
            <Card key={holiday.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                    <CalendarDays className="h-3 w-3 mr-1" /> {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1 capitalize">
                    <ShoppingBag className="h-3 w-3" /> {holiday.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl pt-2">{holiday.name}</CardTitle>
                <CardDescription>{holiday.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <CampaignGeneratorModal>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Create Campaign
                  </Button>
                </CampaignGeneratorModal>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-8 text-center bg-muted/20 border border-dashed rounded-lg">
            <CalendarDays className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">No holidays match your filters.</p>
          </div>
        )}
      </div>

      {/* Right Column: Calendar Visual */}
      <div>
        <Card className="sticky top-6">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg">At a Glance</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex justify-center">
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border-0 pointer-events-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}