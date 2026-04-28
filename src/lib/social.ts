/**
 * Social media integration library (Demo Mode)
 * Simulates OAuth connections and posting without actual API calls
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
 * Fetch simulated social media accounts
 */
export async function fetchSocialAccounts(): Promise<SocialAccount[]> {
  try {
    const response = await fetch('/api/social/accounts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch social accounts');
    }

    const { accounts, demo_mode } = await response.json();
    console.log('Demo mode:', demo_mode);
    return accounts;
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    throw error;
  }
}

/**
 * Simulate Instagram OAuth connection
 * In demo mode, just shows a notification instead of actual OAuth
 */
export async function connectInstagram(): Promise<void> {
  try {
    const response = await fetch('/api/social/instagram/auth', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate Instagram OAuth');
    }

    const data = await response.json();
    
    if (data.demo_mode) {
      // Demo mode: Just reload the page to show "connected" state
      // Accounts are always "connected" in demo mode
      window.location.reload();
    }
  } catch (error) {
    console.error('Error connecting Instagram:', error);
    throw error;
  }
}

/**
 * Simulate Facebook OAuth connection
 * In demo mode, just shows a notification instead of actual OAuth
 */
export async function connectFacebook(): Promise<void> {
  try {
    const response = await fetch('/api/social/facebook/auth', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate Facebook OAuth');
    }

    const data = await response.json();
    
    if (data.demo_mode) {
      // Demo mode: Just reload the page to show "connected" state
      // Accounts are always "connected" in demo mode
      window.location.reload();
    }
  } catch (error) {
    console.error('Error connecting Facebook:', error);
    throw error;
  }
}

/**
 * Simulate disconnecting a social media account
 */
export async function disconnectAccount(platform: 'instagram' | 'facebook'): Promise<void> {
  try {
    const response = await fetch(`/api/social/accounts?platform=${platform}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to disconnect ${platform}`);
    }

    const data = await response.json();
    console.log('Demo disconnect:', data);
  } catch (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    throw error;
  }
}

/**
 * Simulate posting content to social media platforms
 * Returns simulated success without actual API calls
 */
export async function postToSocial(
  campaignId: string,
  platforms: ('instagram' | 'facebook')[],
  content: PostContent
): Promise<{ success: boolean; simulated: boolean; results: PostResult[]; platform_post_ids: Record<string, string>; message?: string }> {
  try {
    const response = await fetch('/api/social/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaignId,
        platforms,
        content,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to post to social platforms');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting to social:', error);
    throw error;
  }
}

/**
 * Check if platforms are "connected" (always true in demo mode)
 */
export function getConnectedPlatforms(accounts: SocialAccount[]): {
  instagram: boolean;
  facebook: boolean;
} {
  return {
    instagram: accounts.some(a => a.platform === 'instagram' && a.connected),
    facebook: accounts.some(a => a.platform === 'facebook' && a.connected),
  };
}
