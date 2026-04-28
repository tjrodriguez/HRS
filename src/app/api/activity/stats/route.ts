import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/activity/stats
 * Get activity statistics for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get all logs in date range for aggregation
    const { data: logs, error: logsError } = await supabase
      .from('activity_logs')
      .select('activity_type, platform, created_at')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (logsError) {
      console.error('Error fetching activity logs:', logsError);
    }

    // Aggregate activity counts by type
    const activityCounts: { activity_type: string; count: number }[] = [];
    const platformStats: { platform: string; count: number }[] = [];
    
    if (logs) {
      const activityMap = new Map<string, number>();
      const platformMap = new Map<string, number>();
      
      for (const log of logs) {
        // Count by activity type
        const currentActivityCount = activityMap.get(log.activity_type) || 0;
        activityMap.set(log.activity_type, currentActivityCount + 1);
        
        // Count by platform (skip null platforms)
        if (log.platform) {
          const currentPlatformCount = platformMap.get(log.platform) || 0;
          platformMap.set(log.platform, currentPlatformCount + 1);
        }
      }
      
      // Convert maps to arrays
      activityMap.forEach((count, activity_type) => {
        activityCounts.push({ activity_type, count });
      });
      
      platformMap.forEach((count, platform) => {
        platformStats.push({ platform, count });
      });
    }

    // Get daily trend - group by date
    const dailyMap = new Map<string, { date: string; count: number; types: Record<string, number> }>();
    
    if (logs) {
      for (const log of logs) {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        const existing = dailyMap.get(date);
        
        if (existing) {
          existing.count++;
          existing.types[log.activity_type] = (existing.types[log.activity_type] || 0) + 1;
        } else {
          dailyMap.set(date, {
            date,
            count: 1,
            types: { [log.activity_type]: 1 }
          });
        }
      }
    }
    
    const dailyActivity = Array.from(dailyMap.values());

    // Get recent activity summary
    const { data: recentActivity, error: recentError } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error fetching recent activity:', recentError);
    }

    // Calculate totals with proper typing
    const totalLogs = logs?.length || 0;
    const captionCount = activityCounts.find((a: { activity_type: string; count: number }) => a.activity_type === 'caption_generated')?.count || 0;
    const postCount = activityCounts.find((a: { activity_type: string; count: number }) => a.activity_type === 'post_simulated')?.count || 0;
    const scheduleCount = activityCounts.find((a: { activity_type: string; count: number }) => a.activity_type === 'campaign_scheduled')?.count || 0;

    return NextResponse.json({
      summary: {
        total_logs: totalLogs,
        captions_generated: captionCount,
        posts_simulated: postCount,
        campaigns_scheduled: scheduleCount,
        days_tracked: days,
      },
      activity_breakdown: activityCounts || [],
      platform_distribution: platformStats || [],
      daily_trend: dailyActivity || [],
      recent_activity: recentActivity || [],
    });
  } catch (error) {
    console.error('Error in GET /api/activity/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
