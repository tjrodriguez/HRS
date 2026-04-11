"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Mock Data
const mockHolidays = [
  { id: 1, name: "New Year", date: "2024-01-01", type: "Federal" },
  { id: 2, name: "Valentine's Day", date: "2024-02-14", type: "Observance" },
  { id: 3, name: "St. Patrick's Day", date: "2024-03-17", type: "Observance" }
];

const mockEngagementData = [
  { date: "2024-01", views: 4000, interactions: 2400, likes: 1000, comments: 200, shares: 100, reach: 5000, holidayName: "New Year", platform: "Instagram" },
  { date: "2024-02", views: 3000, interactions: 1398, likes: 800, comments: 150, shares: 50, reach: 4000, holidayName: "Valentine's Day", platform: "Facebook" },
  { date: "2024-03", views: 2000, interactions: 9800, likes: 5000, comments: 800, shares: 4000, reach: 15000, holidayName: "St. Patrick's Day", platform: "Twitter" }
];

const mockProfile = {
  name: "My Business",
  niche: "Retail",
  tone: "Friendly",
  socialPlatforms: ["Instagram", "Facebook"]
};

interface Profile {
  name: string;
  niche: string;
  tone: string;
  type?: string;
  description?: string;
  location?: string;
  targetAudience?: string;
  socialPlatforms: string[];
}

export interface Holiday {
  id: number;
  name: string;
  date: string;
  type: string;
  reminderSent?: boolean;
  description?: string;
  category?: string;
}

interface EngagementData {
  date: string;
  views: number;
  interactions: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  holidayId?: number;
  holidayName: string;
  platform: string;
}

interface BusinessContextType {
  profile: Profile;
  setProfile: (p: Profile) => void;
  holidays: Holiday[];
  engagementData: EngagementData[];
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [holidays] = useState<Holiday[]>(mockHolidays);
  const [engagementData] = useState<EngagementData[]>(mockEngagementData);

  return (
    <BusinessContext.Provider value={{ profile, setProfile, holidays, engagementData }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
