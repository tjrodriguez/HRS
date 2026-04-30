import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Demo mode: Return simulated social accounts
const DEMO_ACCOUNTS = [
  {
    id: 'demo-instagram',
    platform: 'instagram' as const,
    account_id: 'demo_ig_account',
    account_name: 'Your Business',
    account_username: 'yourbusiness',
    profile_picture_url: null,
    follower_count: 1250,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    connected: true,
  },
  {
    id: 'demo-facebook',
    platform: 'facebook' as const,
    account_id: 'demo_fb_page',
    account_name: 'Your Business Page',
    account_username: 'Your Business Page',
    profile_picture_url: null,
    follower_count: 3400,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    connected: true,
  },
];

/**
 * GET /api/social/accounts
 * Get simulated social media accounts (demo mode)
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

    // Return demo accounts (simulated connections)
    // In production, this would fetch from the database
    return NextResponse.json({
      accounts: DEMO_ACCOUNTS,
      demo_mode: true,
      message: 'Running in demo mode. Social accounts are simulated for testing purposes.',
    });
  } catch (error) {
    console.error('Error in GET /api/social/accounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/social/accounts
 * Simulate disconnecting a social media account
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
    const platform = searchParams.get('platform');

    if (!platform || !['instagram', 'facebook'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Demo mode: Just return success (no actual disconnection)
    return NextResponse.json({
      success: true,
      demo_mode: true,
      message: `Simulated disconnect for ${platform}. In production, this would revoke OAuth tokens.`,
    });
  } catch (error) {
    console.error('Error in DELETE /api/social/accounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
