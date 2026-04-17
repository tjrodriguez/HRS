/**
 * Database operations for analytics
 */

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  campaign_id: string;
  event_type: 'view' | 'click' | 'share' | 'engagement';
  platform: string;
  metrics: {
    engagement?: number;
    reach?: number;
    [key: string]: any;
  };
  created_at: string;
}

export interface AnalyticsSummary {
  totalCampaigns: number;
  totalEngagement: number;
  totalReach: number;
}

/**
 * Log an analytics event
 */
export async function logAnalyticsEvent(
  campaignId: string,
  eventType: AnalyticsEvent['event_type'],
  platform: string,
  metrics: AnalyticsEvent['metrics']
): Promise<AnalyticsEvent> {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaign_id: campaignId,
        event_type: eventType,
        platform,
        metrics,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to log analytics event');
    }

    const { event } = await response.json();
    return event;
  } catch (error) {
    console.error('Error logging analytics event:', error);
    throw error;
  }
}

/**
 * Fetch analytics summary and events
 */
export async function fetchAnalytics(): Promise<{
  summary: AnalyticsSummary;
  events: AnalyticsEvent[];
}> {
  try {
    const response = await fetch('/api/analytics', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}
