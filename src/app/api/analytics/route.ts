import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * POST /api/analytics
 * Log an engagement event
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

    const body = await request.json();
    const {
      campaign_id,
      event_type, // 'view', 'click', 'share', 'engagement'
      platform,
      metrics,
    } = body;

    if (!campaign_id || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert analytics event
    const { data: event, error } = await supabase
      .from('analytics')
      .insert({
        user_id: user.id,
        campaign_id,
        event_type,
        platform,
        metrics,
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging analytics:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics
 * Get analytics summary for user
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get campaigns for this user
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('user_id', user.id);

    if (campaignsError) {
      throw campaignsError;
    }

    const campaignIds = campaigns?.map((c) => c.id) || [];

    if (campaignIds.length === 0) {
      return NextResponse.json({
        summary: {
          totalCampaigns: 0,
          totalEngagement: 0,
          totalReach: 0,
        },
        events: [],
      });
    }

    // Get analytics for these campaigns
    const { data: events, error: eventsError } = await supabase
      .from('analytics')
      .select('*')
      .in('campaign_id', campaignIds)
      .order('created_at', { ascending: false })
      .limit(100);

    if (eventsError) {
      throw eventsError;
    }

    // Calculate summary
    let totalEngagement = 0;
    let totalReach = 0;

    events?.forEach((event) => {
      if (event.metrics) {
        totalEngagement += event.metrics.engagement || 0;
        totalReach += event.metrics.reach || 0;
      }
    });

    return NextResponse.json({
      summary: {
        totalCampaigns: campaignIds.length,
        totalEngagement,
        totalReach,
      },
      events,
    });
  } catch (error) {
    console.error('Error in GET /api/analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
