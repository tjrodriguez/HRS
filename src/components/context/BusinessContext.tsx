"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchHolidays, fetchProfile, fetchEngagementData } from "@/app/api/actions/data";

// Fallback mock data for when not authenticated
const fallbackProfile = {
  name: "My Business",
  niche: "Retail",
  tone: "Friendly",
  socialPlatforms: ["Instagram", "Facebook"],
  type: "Retail Store",
  description: "A welcoming retail store",
  location: "Main Street",
  targetAudience: "Local customers",
};

const fallbackHolidays = [
  { id: 1, name: "New Year", date: "2026-01-01", type: "Federal", reminderSent: false, description: "Start of the year", category: "Holiday" },
  { id: 2, name: "Valentine's Day", date: "2026-02-14", type: "Observance", reminderSent: false, description: "Day of love", category: "Holiday" },
  { id: 3, name: "St. Patrick's Day", date: "2026-03-17", type: "Observance", reminderSent: false, description: "Irish celebration", category: "Holiday" },
];

const fallbackEngagementData = [
  { date: "2026-01", views: 4000, interactions: 2400, likes: 1000, comments: 200, shares: 100, reach: 5000, holidayName: "New Year", platform: "Instagram" },
  { date: "2026-02", views: 3000, interactions: 1398, likes: 800, comments: 150, shares: 50, reach: 4000, holidayName: "Valentine's Day", platform: "Facebook" },
  { date: "2026-03", views: 2000, interactions: 9800, likes: 5000, comments: 800, shares: 4000, reach: 15000, holidayName: "St. Patrick's Day", platform: "Twitter" },
];

interface Profile {
  id?: string;
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
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [holidays, setHolidays] = useState<Holiday[]>(fallbackHolidays);
  const [engagementData, setEngagementData] = useState<EngagementData[]>(fallbackEngagementData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data in parallel
      const [profileData, holidaysData, engagementDataResult] = await Promise.all([
        fetchProfile(),
        fetchHolidays(),
        fetchEngagementData(),
      ]);

      // Update profile if data exists, otherwise use fallback
      if (profileData) {
        setProfile({
          id: profileData.id,
          name: profileData.name,
          niche: profileData.niche,
          tone: profileData.tone,
          type: profileData.type,
          description: profileData.description,
          location: profileData.location,
          targetAudience: profileData.target_audience,
          socialPlatforms: profileData.social_platforms,
        });
      }

      // Update holidays if data exists, otherwise use fallback
      if (holidaysData && holidaysData.length > 0) {
        setHolidays(holidaysData);
      }

      // Update engagement data if data exists, otherwise use fallback
      if (engagementDataResult && engagementDataResult.length > 0) {
        setEngagementData(engagementDataResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading business data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        profile,
        setProfile,
        holidays,
        engagementData,
        isLoading,
        error,
        refetch: loadData,
      }}
    >
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
