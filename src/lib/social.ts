/**
 * Social media types (Simulation Only)
 * This module only contains types - no actual API integrations
 * All platform interactions are purely visual simulations
 */

export interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook';
  account_id: string;
  account_name: string;
  account_username: string;
  profile_picture_url: string | null;
  follower_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  connected: boolean;
}

export interface PostContent {
  caption: string;
  hashtags?: string[];
  image_url?: string;
}

export interface PostResult {
  platform: string;
  success: boolean;
  post_id?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Generate a simulated post ID
 */
export function generateSimulatedPostId(platform: string): string {
  return `${platform}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Check if platforms are "available" for simulation
 * Always returns true since this is pure simulation
 */
export function getAvailablePlatforms(): {
  instagram: boolean;
  facebook: boolean;
} {
  return {
    instagram: true,
    facebook: true,
  };
}
