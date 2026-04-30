"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchHolidays, fetchProfile, fetchEngagementData, fetchCampaigns, fetchCampaignAnalytics, fetchTemplates, Holiday as DbHoliday, EngagementData as DbEngagementData, Campaign as DbCampaign } from "@/utils/data";

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
  id: string;
  name: string;
  date: string;
  type: string;
  reminderSent?: boolean;
  description?: string;
  category?: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  holiday_id: string;
  content: string;
  platforms: string[];
  status: "draft" | "scheduled" | "published" | "archived";
  scheduled_date?: string;
  created_at: string;
  updated_at: string;
  holiday?: Holiday;
}

export interface CampaignAnalytics {
  campaign: Campaign;
  events: {
    event_type: string;
    platform: string;
    metrics: Record<string, unknown>;
    created_at: string;
  }[];
  totals: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    engagementRate: number;
  };
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
  holidayId?: string;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  content: string;
  hashtags: string[];
  category: string;
  holiday_name?: string;
  business_type?: string;
  tone?: string;
  platforms: string[];
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface BusinessContextType {
  profile: Profile;
  setProfile: (p: Profile) => void;
  holidays: Holiday[];
  campaigns: Campaign[];
  campaignAnalytics: CampaignAnalytics[];
  engagementData: EngagementMetrics[];
  templates: Template[];
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
  { id: "new-year", name: "New Year", date: "2026-01-01", type: "Seasonal", reminderSent: false, description: "Start the year with fresh beginnings", category: "Seasonal" },
  { id: "valentine", name: "Valentine's Day", date: "2026-02-14", type: "Love", reminderSent: false, description: "Celebrate love and relationships", category: "Love" },
  { id: "stpatrick", name: "St. Patrick's Day", date: "2026-03-17", type: "Cultural", reminderSent: false, description: "Celebrate Irish heritage and culture", category: "Cultural" },
  { id: "easter", name: "Easter", date: "2026-04-05", type: "Religious", reminderSent: false, description: "Celebrate the Easter season", category: "Religious" },
  { id: "earthday", name: "Earth Day", date: "2026-04-22", type: "Environmental", reminderSent: false, description: "Celebrate and protect our planet", category: "Environmental" },
  { id: "mothersday", name: "Mother's Day", date: "2026-05-10", type: "Family", reminderSent: false, description: "Honor and celebrate mothers", category: "Family" },
  { id: "juneteenth", name: "Juneteenth", date: "2026-06-19", type: "Historical", reminderSent: false, description: "Celebrate freedom and independence", category: "Historical" },
  { id: "summersol", name: "Summer Solstice", date: "2026-06-21", type: "Seasonal", reminderSent: false, description: "Celebrate the longest day of the year", category: "Seasonal" },
  { id: "independence", name: "Independence Day", date: "2026-07-04", type: "National", reminderSent: false, description: "Celebrate national independence", category: "National" },
  { id: "laborday", name: "Labor Day", date: "2026-09-07", type: "Historical", reminderSent: false, description: "Honor the labor movement", category: "Historical" },
  { id: "halloween", name: "Halloween", date: "2026-10-31", type: "Seasonal", reminderSent: false, description: "Celebrate spooky season", category: "Seasonal" },
  { id: "thanksgiving", name: "Thanksgiving", date: "2026-11-26", type: "Family", reminderSent: false, description: "Give thanks and celebrate together", category: "Family" },
  { id: "blackfriday", name: "Black Friday", date: "2026-11-27", type: "Shopping", reminderSent: false, description: "Start holiday shopping season", category: "Shopping" },
  { id: "cybermonday", name: "Cyber Monday", date: "2026-12-01", type: "Shopping", reminderSent: false, description: "Online shopping extravaganza", category: "Shopping" },
  { id: "christmas", name: "Christmas", date: "2026-12-25", type: "Religious", reminderSent: false, description: "Celebrate the holiday season", category: "Religious" },
  { id: "newyearseve", name: "New Year's Eve", date: "2026-12-31", type: "Seasonal", reminderSent: false, description: "Ring in the new year", category: "Seasonal" },
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementMetrics[]>(fallbackEngagementData);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data in parallel
      const [profileData, holidaysData, engagementDataResult, campaignsData, campaignAnalyticsData, templatesData] = await Promise.all([
        fetchProfile(),
        fetchHolidays(),
        fetchEngagementData(),
        fetchCampaigns(),
        fetchCampaignAnalytics(),
        fetchTemplates(),
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

      // Update campaigns
      if (campaignsData && campaignsData.length > 0) {
        const normalizedCampaigns: Campaign[] = campaignsData.map((c: DbCampaign) => ({
          id: c.id,
          user_id: c.user_id,
          holiday_id: c.holiday_id,
          content: c.content,
          platforms: c.platforms || [],
          status: c.status,
          scheduled_date: c.scheduled_date,
          created_at: c.created_at,
          updated_at: c.updated_at,
          holiday: c.holiday ? {
            id: c.holiday.id,
            name: c.holiday.name,
            date: c.holiday.date,
            type: c.holiday.type,
            reminderSent: c.holiday.reminder_sent,
            description: c.holiday.description,
            category: c.holiday.category,
          } : undefined,
        }));
        setCampaigns(normalizedCampaigns);
      }

      // Update campaign analytics
      if (campaignAnalyticsData && campaignAnalyticsData.length > 0) {
        setCampaignAnalytics(campaignAnalyticsData as CampaignAnalytics[]);
      }

      // Update templates
      if (templatesData && templatesData.length > 0) {
        setTemplates(templatesData as Template[]);
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
        campaigns,
        campaignAnalytics,
        engagementData,
        templates,
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
