/**
 * Activity logging library
 * Tracks all simulation activity including caption generation and posting
 */

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: 'caption_generated' | 'caption_regenerated' | 'post_simulated' | 'campaign_scheduled' | 'campaign_created' | 'template_saved' | 'account_connected' | 'account_disconnected';
  platform?: 'instagram' | 'facebook' | 'both';
  campaign_id?: string;
  holiday_id?: string;
  holiday_name?: string;
  caption?: string;
  hashtags?: string[];
  content_preview?: string;
  simulation_results?: object;
  post_ids?: object;
  status: 'success' | 'error' | 'pending';
  error_message?: string;
  metadata?: object;
  created_at: string;
  updated_at: string;
}

export interface ActivityStats {
  summary: {
    total_logs: number;
    captions_generated: number;
    posts_simulated: number;
    campaigns_scheduled: number;
    days_tracked: number;
  };
  activity_breakdown: { activity_type: string; count: number }[];
  platform_distribution: { platform: string; count: number }[];
  daily_trend: { date: string; count: number; types: Record<string, number> }[];
  recent_activity: ActivityLog[];
}

export interface ActivityFilters {
  activity_type?: string;
  platform?: string;
  status?: string;
  holiday_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Create a new activity log entry
 */
export async function logActivity(data: Omit<ActivityLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ActivityLog> {
  try {
    const response = await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to log activity');
    }

    const { log } = await response.json();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging should not break the main flow
    return null as unknown as ActivityLog;
  }
}

/**
 * Log caption generation
 */
export async function logCaptionGenerated(
  caption: string,
  hashtags: string[],
  holidayId: string,
  holidayName: string,
  campaignId?: string,
  isRegeneration: boolean = false
): Promise<void> {
  await logActivity({
    activity_type: isRegeneration ? 'caption_regenerated' : 'caption_generated',
    caption,
    hashtags,
    holiday_id: holidayId,
    holiday_name: holidayName,
    campaign_id: campaignId,
    status: 'success',
    metadata: {
      caption_length: caption.length,
      hashtags_count: hashtags.length,
    },
  });
}

/**
 * Log simulated post to social platforms
 */
export async function logPostSimulated(
  platforms: ('instagram' | 'facebook')[],
  caption: string,
  hashtags: string[],
  holidayId: string,
  holidayName: string,
  campaignId: string,
  simulationResults: object,
  postIds: object
): Promise<void> {
  const platform = platforms.length === 2 ? 'both' : platforms[0];
  
  await logActivity({
    activity_type: 'post_simulated',
    platform: platform as 'instagram' | 'facebook' | 'both',
    caption,
    hashtags,
    holiday_id: holidayId,
    holiday_name: holidayName,
    campaign_id: campaignId,
    status: 'success',
    simulation_results: simulationResults,
    post_ids: postIds,
    metadata: {
      platforms,
      simulation_mode: true,
    },
  });
}

/**
 * Log campaign scheduling
 */
export async function logCampaignScheduled(
  holidayId: string,
  holidayName: string,
  campaignId: string,
  platforms: ('instagram' | 'facebook')[],
  scheduledDate: string
): Promise<void> {
  const platform = platforms.length === 2 ? 'both' : platforms[0];
  
  await logActivity({
    activity_type: 'campaign_scheduled',
    platform: platform as 'instagram' | 'facebook' | 'both',
    holiday_id: holidayId,
    holiday_name: holidayName,
    campaign_id: campaignId,
    status: 'success',
    metadata: {
      scheduled_date: scheduledDate,
      platforms,
    },
  });
}

/**
 * Log template save
 */
export async function logTemplateSaved(
  templateName: string,
  holidayName: string,
  platforms: string[]
): Promise<void> {
  await logActivity({
    activity_type: 'template_saved',
    holiday_name: holidayName,
    status: 'success',
    metadata: {
      template_name: templateName,
      platforms,
    },
  });
}

/**
 * Log social account connection
 */
export async function logAccountConnected(platform: 'instagram' | 'facebook'): Promise<void> {
  await logActivity({
    activity_type: 'account_connected',
    platform,
    status: 'success',
    metadata: {
      simulated: true,
    },
  });
}

/**
 * Log social account disconnection
 */
export async function logAccountDisconnected(platform: 'instagram' | 'facebook'): Promise<void> {
  await logActivity({
    activity_type: 'account_disconnected',
    platform,
    status: 'success',
    metadata: {
      simulated: true,
    },
  });
}

/**
 * Fetch activity logs with optional filters
 */
export async function fetchActivityLogs(filters: ActivityFilters = {}): Promise<{ logs: ActivityLog[]; total: number; limit: number; offset: number }> {
  try {
    const params = new URLSearchParams();
    
    if (filters.activity_type) params.append('activity_type', filters.activity_type);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.status) params.append('status', filters.status);
    if (filters.holiday_id) params.append('holiday_id', filters.holiday_id);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await fetch(`/api/activity?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity logs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
}

/**
 * Fetch activity statistics
 */
export async function fetchActivityStats(days: number = 30): Promise<ActivityStats> {
  try {
    const response = await fetch(`/api/activity/stats?days=${days}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    throw error;
  }
}

/**
 * Delete a single activity log
 */
export async function deleteActivityLog(logId: string): Promise<void> {
  try {
    const response = await fetch(`/api/activity?id=${logId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete activity log');
    }
  } catch (error) {
    console.error('Error deleting activity log:', error);
    throw error;
  }
}

/**
 * Clear all activity logs for the user
 */
export async function clearAllActivityLogs(): Promise<void> {
  try {
    const response = await fetch('/api/activity?clear_all=true', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to clear activity logs');
    }
  } catch (error) {
    console.error('Error clearing activity logs:', error);
    throw error;
  }
}

/**
 * Get activity type display name
 */
export function getActivityTypeDisplay(type: string): string {
  const displayNames: Record<string, string> = {
    caption_generated: 'Caption Generated',
    caption_regenerated: 'Caption Regenerated',
    post_simulated: 'Post Simulated',
    campaign_scheduled: 'Campaign Scheduled',
    campaign_created: 'Campaign Created',
    template_saved: 'Template Saved',
    account_connected: 'Account Connected',
    account_disconnected: 'Account Disconnected',
  };
  return displayNames[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get activity icon based on type
 */
export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    caption_generated: '✨',
    caption_regenerated: '🔄',
    post_simulated: '📤',
    campaign_scheduled: '📅',
    campaign_created: '📝',
    template_saved: '💾',
    account_connected: '🔗',
    account_disconnected: '❌',
  };
  return icons[type] || '📋';
}

/**
 * Get platform display name
 */
export function getPlatformDisplay(platform?: string): string {
  if (!platform) return '';
  const displays: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    both: 'Instagram & Facebook',
  };
  return displays[platform] || platform;
}
