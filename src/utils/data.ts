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
  id: number;
  name: string;
  date: string;
  type: string;
  reminder_sent?: boolean;
  description?: string;
  category?: string;
}

export interface EngagementData {
  date: string;
  views: number;
  interactions: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  holiday_id?: number;
  holiday_name: string;
  platform: string;
}

type AnalyticsRow = {
  created_at?: string;
  metrics?: Record<string, unknown>;
  platform?: string;
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
