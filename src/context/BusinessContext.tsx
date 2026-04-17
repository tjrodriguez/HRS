"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchHolidays, fetchProfile, fetchEngagementData, Holiday as DbHoliday, EngagementData as DbEngagementData } from "@/utils/data";

/**
 * Context types with normalized field names
 */
export interface Profile {
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

export interface EngagementMetrics {
  date: string;
  views: number;
  interactions: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  platform: string;
  holidayName: string;
  holidayId?: number;
}

interface BusinessContextType {
  profile: Profile;
  setProfile: (p: Profile) => void;
  holidays: Holiday[];
  engagementData: EngagementMetrics[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Fallback mock data for when not authenticated
const fallbackProfile: Profile = {
  name: "My Business",
  niche: "Retail",
  tone: "Friendly",
  socialPlatforms: ["Instagram", "Facebook"],
  type: "Retail Store",
  description: "A welcoming retail store",
  location: "Main Street",
  targetAudience: "Local customers",
};

const fallbackHolidays: Holiday[] = [
  { id: 1, name: "New Year", date: "2026-01-01", type: "Federal", reminderSent: false, description: "Start of the year", category: "Holiday" },
  { id: 2, name: "Valentine's Day", date: "2026-02-14", type: "Observance", reminderSent: false, description: "Day of love", category: "Holiday" },
  { id: 3, name: "St. Patrick's Day", date: "2026-03-17", type: "Observance", reminderSent: false, description: "Irish celebration", category: "Holiday" },
  { id: 4, name: "Easter", date: "2026-04-05", type: "Religious", reminderSent: false, description: "Christian holiday", category: "Holiday" },
  { id: 5, name: "Earth Day", date: "2026-04-22", type: "International", reminderSent: false, description: "Celebrate sustainability and eco-friendly practices", category: "Holiday" },
  { id: 6, name: "Mother's Day", date: "2026-05-10", type: "Observance", reminderSent: false, description: "Day to celebrate mothers", category: "Holiday" },
  { id: 7, name: "Father's Day", date: "2026-06-21", type: "Observance", reminderSent: false, description: "Day to celebrate fathers", category: "Holiday" },
  { id: 8, name: "Independence Day", date: "2026-07-04", type: "Federal", reminderSent: false, description: "US Independence Day", category: "Holiday" },
  { id: 9, name: "Labor Day", date: "2026-09-07", type: "Federal", reminderSent: false, description: "Day celebrating workers", category: "Holiday" },
  { id: 10, name: "Halloween", date: "2026-10-31", type: "Observance", reminderSent: false, description: "Day of costumes and treats", category: "Holiday" },
  { id: 11, name: "Thanksgiving", date: "2026-11-26", type: "Federal", reminderSent: false, description: "Day of gratitude", category: "Holiday" },
  { id: 12, name: "Cyber Monday", date: "2026-11-30", type: "Commercial", reminderSent: false, description: "Online shopping event", category: "Holiday" },
  { id: 13, name: "Christmas", date: "2026-12-25", type: "Federal", reminderSent: false, description: "Christian holiday celebrating Jesus's birth", category: "Holiday" },
];

const fallbackEngagementData: EngagementMetrics[] = [
  { date: "2026-01", views: 4000, interactions: 2400, likes: 1000, comments: 200, shares: 100, reach: 5000, holidayName: "New Year", platform: "Instagram" },
  { date: "2026-02", views: 3000, interactions: 1398, likes: 800, comments: 150, shares: 50, reach: 4000, holidayName: "Valentine's Day", platform: "Facebook" },
  { date: "2026-03", views: 2000, interactions: 9800, likes: 5000, comments: 800, shares: 4000, reach: 15000, holidayName: "St. Patrick's Day", platform: "Twitter" },
];

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [holidays, setHolidays] = useState<Holiday[]>(fallbackHolidays);
  const [engagementData, setEngagementData] = useState<EngagementMetrics[]>(fallbackEngagementData);
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
        const normalizedHolidays = holidaysData.map((h: DbHoliday) => ({
          id: h.id,
          name: h.name,
          date: h.date,
          type: h.type,
          reminderSent: h.reminder_sent,
          description: h.description,
          category: h.category,
        }));
        setHolidays(normalizedHolidays);
      }

      // Update engagement data if data exists, otherwise use fallback
      if (engagementDataResult && engagementDataResult.length > 0) {
        const normalizedEngagement = engagementDataResult.map((e: DbEngagementData) => ({
          date: e.date,
          views: e.views,
          interactions: e.interactions,
          likes: e.likes,
          comments: e.comments,
          shares: e.shares,
          reach: e.reach,
          platform: e.platform,
          holidayName: e.holiday_name,
          holidayId: e.holiday_id,
        }));
        setEngagementData(normalizedEngagement);
      }
    } catch (err) {
      // Only set error if it's not just an auth session missing error
      const errorMsg = err instanceof Error ? err.message : "Failed to load data";
      if (!errorMsg.includes("session")) {
        setError(errorMsg);
      }
      if (process.env.NODE_ENV === "development") {
        console.debug("Data loading completed with fallbacks:", err);
      }
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
