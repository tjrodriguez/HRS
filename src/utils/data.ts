"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Type definitions for data operations
 */
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  niche: string;
  tone: string;
  type?: string;
  description?: string;
  location?: string;
  target_audience?: string;
  social_platforms: string[];
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  reminder_sent?: boolean;
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

export interface EngagementData {
  date: string;
  views: number;
  interactions: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  holiday_id?: string;
  holiday_name: string;
  platform: string;
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

type AnalyticsRow = {
  created_at?: string;
  metrics?: Record<string, unknown>;
  platform?: string;
};

type CampaignQueryRow = {
  id: string;
  user_id: string;
  holiday_id: string;
  content: string;
  platforms?: string[] | null;
  status: Campaign["status"];
  scheduled_date?: string | null;
  created_at: string;
  updated_at: string;
  holiday?: Holiday | null;
};

type AnalyticsEventRow = {
  campaign_id: string;
  event_type: string;
  platform: string;
  metrics?: Record<string, unknown>;
  created_at: string;
};

type TemplateRow = {
  id: string;
  user_id: string;
  name: string;
  content: string;
  hashtags?: string[] | null;
  category?: string | null;
  holiday_name?: string | null;
  business_type?: string | null;
  tone?: string | null;
  platforms?: string[] | null;
  is_favorite?: boolean | null;
  usage_count?: number | null;
  created_at: string;
  updated_at: string;
};

const getMetricValue = (metrics: Record<string, unknown> | undefined, key: string): number => {
  const value = metrics?.[key];
  return typeof value === "number" ? value : 0;
};

/**
 * Fetch holidays from Supabase
 */
export async function fetchHolidays(): Promise<Holiday[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("holidays")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    // Silently handle auth errors (user not authenticated)
    if (error.code !== "PGRST301" && process.env.NODE_ENV === "development") {
      console.debug("Error fetching holidays:", error.message);
    }
    return [];
  }

  return data || [];
}

/**
 * Fetch user profile from Supabase
 */
export async function fetchProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  // Get current user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // Silently return null for unauthenticated users (expected)
    if (process.env.NODE_ENV === "development" && authError?.code !== "session_not_found") {
      console.debug("User not authenticated:", authError?.message);
    }
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug("Error fetching profile:", error.message);
    }
    return null;
  }

  // Return first profile if exists, otherwise null (user hasn't set up profile yet)
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Fetch engagement data from Supabase
 */
export async function fetchEngagementData(): Promise<EngagementData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("analytics")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Silently handle auth errors (user not authenticated)
    if (error.code !== "PGRST301" && process.env.NODE_ENV === "development") {
      console.debug("Error fetching engagement data:", error.message);
    }
    return [];
  }

  const rows = (data || []) as AnalyticsRow[];

  return rows.map((item) => ({
    date: typeof item.created_at === "string" ? item.created_at : new Date().toISOString(),
    views: getMetricValue(item.metrics, "views"),
    interactions: getMetricValue(item.metrics, "interactions"),
    likes: getMetricValue(item.metrics, "likes"),
    comments: getMetricValue(item.metrics, "comments"),
    shares: getMetricValue(item.metrics, "shares"),
    reach: getMetricValue(item.metrics, "reach"),
    holiday_id: undefined,
    holiday_name: "",
    platform: typeof item.platform === "string" ? item.platform : "unknown",
  }));
}

/**
 * Fetch user campaigns from Supabase with holiday details
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select("*, holiday:holidays(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug("Error fetching campaigns:", error.message);
    }
    return [];
  }

  const rows = (data || []) as CampaignQueryRow[];

  return rows.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    holiday_id: item.holiday_id,
    content: item.content,
    platforms: item.platforms || [],
    status: item.status,
    scheduled_date: item.scheduled_date ?? undefined,
    created_at: item.created_at,
    updated_at: item.updated_at,
    holiday: item.holiday ? {
      id: item.holiday.id,
      name: item.holiday.name,
      date: item.holiday.date,
      type: item.holiday.type,
      reminder_sent: item.holiday.reminder_sent,
      description: item.holiday.description,
      category: item.holiday.category,
    } : undefined,
  }));
}

/**
 * Fetch campaign analytics — joined campaigns, holidays, and analytics events
 */
export async function fetchCampaignAnalytics(): Promise<CampaignAnalytics[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  // Fetch campaigns with holidays
  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("*, holiday:holidays(*)")
    .eq("user_id", user.id);

  if (campaignsError || !campaigns || campaigns.length === 0) {
    return [];
  }

  const campaignRows = campaigns as CampaignQueryRow[];
  const campaignIds = campaignRows.map((c) => c.id);

  // Fetch analytics events for these campaigns
  const { data: events, error: eventsError } = await supabase
    .from("analytics")
    .select("*")
    .in("campaign_id", campaignIds)
    .order("created_at", { ascending: false });

  if (eventsError) {
    return [];
  }

  // Group events by campaign
  const eventRows = (events || []) as AnalyticsEventRow[];
  const eventsByCampaign = new Map<string, AnalyticsEventRow[]>();
  eventRows.forEach((evt) => {
    const list = eventsByCampaign.get(evt.campaign_id) || [];
    list.push(evt);
    eventsByCampaign.set(evt.campaign_id, list);
  });

  return campaignRows.map((campaign) => {
    const campaignEvents = eventsByCampaign.get(campaign.id) || [];
    const likes = campaignEvents.reduce((sum: number, e) => sum + getMetricValue(e.metrics, "likes"), 0);
    const comments = campaignEvents.reduce((sum: number, e) => sum + getMetricValue(e.metrics, "comments"), 0);
    const shares = campaignEvents.reduce((sum: number, e) => sum + getMetricValue(e.metrics, "shares"), 0);
    const reach = campaignEvents.reduce((sum: number, e) => sum + getMetricValue(e.metrics, "reach"), 0);
    const totalEngagement = likes + comments + shares;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    return {
      campaign: {
        id: campaign.id,
        user_id: campaign.user_id,
        holiday_id: campaign.holiday_id,
        content: campaign.content,
        platforms: campaign.platforms || [],
        status: campaign.status,
        scheduled_date: campaign.scheduled_date ?? undefined,
        created_at: campaign.created_at,
        updated_at: campaign.updated_at,
        holiday: campaign.holiday ? {
          id: campaign.holiday.id,
          name: campaign.holiday.name,
          date: campaign.holiday.date,
          type: campaign.holiday.type,
          reminder_sent: campaign.holiday.reminder_sent,
          description: campaign.holiday.description,
          category: campaign.holiday.category,
        } : undefined,
      },
      events: campaignEvents.map((e) => ({
        event_type: e.event_type,
        platform: e.platform,
        metrics: e.metrics || {},
        created_at: e.created_at,
      })),
      totals: {
        likes,
        comments,
        shares,
        reach,
        engagementRate: Number(engagementRate.toFixed(2)),
      },
    };
  });
}

/**
 * Fetch user templates from Supabase
 */
export async function fetchTemplates(): Promise<Template[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("user_id", user.id)
    .order("is_favorite", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug("Error fetching templates:", error.message);
    }
    return [];
  }

  const rows = (data || []) as TemplateRow[];

  return rows.map((item) => ({
    id: item.id,
    user_id: item.user_id,
    name: item.name,
    content: item.content,
    hashtags: item.hashtags || [],
    category: item.category || "general",
    holiday_name: item.holiday_name ?? undefined,
    business_type: item.business_type ?? undefined,
    tone: item.tone ?? undefined,
    platforms: item.platforms || [],
    is_favorite: !!item.is_favorite,
    usage_count: item.usage_count ?? 0,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

/**
 * Update user profile
 */
export async function updateProfile(
  profileData: Partial<Profile>
): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Error fetching user:", authError);
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id, // Assuming id is the primary key matched with auth.users
      name: profileData.name,
      niche: profileData.niche,
      tone: profileData.tone,
      type: profileData.type,
      description: profileData.description,
      location: profileData.location,
      target_audience: profileData.target_audience,
      social_platforms: profileData.social_platforms,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return data;
}
