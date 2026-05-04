/**
 * Campaign-related TypeScript interfaces and types
 */

export type CampaignStatus = 'draft' | 'scheduled' | 'posted' | 'archived';

export interface Campaign {
  id: string;
  user_id: string;
  holiday_id: string;
  content: {
    instagram: string;
    email: string;
    hashtags: string[];
    imageUrl?: string | null;
  };
  platforms: string[];
  status: CampaignStatus;
  scheduled_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface EngagementPrediction {
  reach: { min: number; max: number };
  likes: { min: number; max: number };
  comments: { min: number; max: number };
  engagementRate: string;
  platform: 'instagram' | 'facebook';
}

export interface PlatformTips {
  instagram: string[];
  facebook: string[];
  general: string[];
}

export interface ConnectedPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  type: 'instagram' | 'facebook';
}

export type PlatformType = 'instagram' | 'facebook';
