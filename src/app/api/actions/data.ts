"use server";

import { createClient } from "@/utils/supabase/server";
import { Holiday } from "@/components/context/BusinessContext";

interface Profile {
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
    console.error("Error fetching holidays:", error);
    return [];
  }

  return (
    data?.map((holiday: any) => ({
      id: holiday.id,
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      reminderSent: holiday.reminder_sent,
      description: holiday.description,
      category: holiday.category,
    })) || []
  );
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
    console.error("Error fetching user:", authError);
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    niche: data.niche,
    tone: data.tone,
    type: data.type,
    description: data.description,
    location: data.location,
    target_audience: data.target_audience,
    social_platforms: data.social_platforms || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Fetch engagement data from Supabase
 */
export async function fetchEngagementData(): Promise<EngagementData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("engagement_data")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching engagement data:", error);
    return [];
  }

  return (
    data?.map((item: any) => ({
      date: item.date,
      views: item.views,
      interactions: item.interactions,
      likes: item.likes,
      comments: item.comments,
      shares: item.shares,
      reach: item.reach,
      holidayId: item.holiday_id,
      holidayName: item.holiday_name,
      platform: item.platform,
    })) || []
  );
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
    .update({
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
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    niche: data.niche,
    tone: data.tone,
    type: data.type,
    description: data.description,
    location: data.location,
    target_audience: data.target_audience,
    social_platforms: data.social_platforms || [],
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
