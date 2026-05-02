/**
 * Database operations for campaigns
 * These are helper functions for frontend to interact with campaign API
 * 
 * @deprecated Use @/lib/api/campaigns for new code
 * This file is maintained for backward compatibility
 */

// Re-export types from new location for backward compatibility
export type { Campaign, CampaignStatus } from './types/campaign';
import type { Campaign } from './types/campaign';

/**
 * Fetch all campaigns for the current user
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    const { campaigns } = await response.json();
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

/**
 * Fetch a single campaign by ID
 */
export async function fetchCampaign(id: string): Promise<Campaign> {
  try {
    const response = await fetch(`/api/campaigns/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaign');
    }

    const { campaign } = await response.json();
    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
}

/**
 * Create a new campaign
 */
export async function createCampaign(
  holidayId: string,
  content: Campaign['content'],
  platforms: Campaign['platforms'],
  scheduledDate: string | null = null
): Promise<Campaign> {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        holiday_id: holidayId,
        content,
        platforms,
        scheduled_date: scheduledDate,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create campaign');
    }

    const { campaign } = await response.json();
    return campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(
  id: string,
  updates: Partial<Omit<Campaign, 'id' | 'user_id' | 'holiday_id' | 'created_at'>>
): Promise<Campaign> {
  try {
    const response = await fetch(`/api/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update campaign');
    }

    const { campaign } = await response.json();
    return campaign;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/campaigns/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete campaign');
    }
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
}

/**
 * Schedule a campaign
 */
export async function scheduleCampaign(
  campaignId: string,
  scheduledDate: string,
  platforms: Campaign['platforms']
): Promise<Campaign> {
  try {
    const response = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaignId,
        scheduled_date: scheduledDate,
        platforms,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule campaign');
    }

    const { campaign } = await response.json();
    return campaign;
  } catch (error) {
    console.error('Error scheduling campaign:', error);
    throw error;
  }
}

/**
 * Fetch scheduled campaigns
 */
export async function fetchScheduledCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch('/api/schedule', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch scheduled campaigns');
    }

    const { campaigns } = await response.json();
    return campaigns;
  } catch (error) {
    console.error('Error fetching scheduled campaigns:', error);
    throw error;
  }
}
