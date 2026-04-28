import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface ActivityLogRequest {
  activity_type: 'caption_generated' | 'caption_regenerated' | 'post_simulated' | 'campaign_scheduled' | 'campaign_created' | 'template_saved' | 'account_connected' | 'account_disconnected';
  platform?: 'instagram' | 'facebook' | 'both';
  campaign_id?: string;
  holiday_id?: string;
  holiday_name?: string;
  caption?: string;
  hashtags?: string[];
  simulation_results?: object;
  post_ids?: object;
  status?: 'success' | 'error' | 'pending';
  error_message?: string;
  metadata?: object;
}

/**
 * GET /api/activity
 * Fetch activity logs for the authenticated user with filtering
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const activityType = searchParams.get('activity_type');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const holidayId = searchParams.get('holiday_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (holidayId) {
      query = query.eq('holiday_id', holidayId);
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }
    if (search) {
      query = query.or(`caption.ilike.%${search}%,holiday_name.ilike.%${search}%`);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Error fetching activity logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch activity logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      logs: logs || [],
      total: count || 0,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error in GET /api/activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activity
 * Create a new activity log entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ActivityLogRequest = await request.json();

    // Validate required fields
    if (!body.activity_type) {
      return NextResponse.json(
        { error: 'Missing required field: activity_type' },
        { status: 400 }
      );
    }

    // Create content preview (truncated caption)
    const captionString = typeof body.caption === 'string' ? body.caption : String(body.caption || '');
    const contentPreview = captionString 
      ? captionString.substring(0, 150) + (captionString.length > 150 ? '...' : '')
      : null;

    const { data: log, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        activity_type: body.activity_type,
        platform: body.platform,
        campaign_id: body.campaign_id,
        holiday_id: body.holiday_id,
        holiday_name: body.holiday_name,
        caption: body.caption,
        hashtags: body.hashtags,
        content_preview: contentPreview,
        simulation_results: body.simulation_results,
        post_ids: body.post_ids,
        status: body.status || 'success',
        error_message: body.error_message,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating activity log:', error);
      return NextResponse.json(
        { error: 'Failed to create activity log' },
        { status: 500 }
      );
    }

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/activity:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/activity
 * Delete activity logs (single by ID or bulk)
 */
export async function DELETE(request: NextRequest) {
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
    const logId = searchParams.get('id');
    const clearAll = searchParams.get('clear_all') === 'true';

    if (logId) {
      // Delete specific log
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting activity log:', error);
        return NextResponse.json(
          { error: 'Failed to delete activity log' },
          { status: 500 }
        );
      }
    } else if (clearAll) {
      // Delete all user logs
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing activity logs:', error);
        return NextResponse.json(
          { error: 'Failed to clear activity logs' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Missing id parameter or clear_all flag' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
