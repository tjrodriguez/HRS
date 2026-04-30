import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * POST /api/schedule
 * Schedule a campaign to be posted
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
    const { campaign_id, scheduled_date, platforms } = body;

    if (!campaign_id || !scheduled_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify campaign ownership
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('id', campaign_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Update campaign with scheduled date and status
    const { data: updatedCampaign, error } = await supabase
      .from('campaigns')
      .update({
        scheduled_date,
        status: 'scheduled',
        ...(platforms && { platforms }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaign_id)
      .select()
      .single();

    if (error) {
      console.error('Error scheduling campaign:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaign: updatedCampaign });
  } catch (error) {
    console.error('Error in POST /api/schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/schedule
 * Get scheduled campaigns for user
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

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'scheduled')
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled campaigns:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error in GET /api/schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
