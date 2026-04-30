import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/social/instagram/auth
 * Demo mode: Returns simulation message instead of OAuth URL
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

    // Demo mode: Return simulation info
    return NextResponse.json({
      demo_mode: true,
      message: 'Instagram OAuth is simulated in demo mode. No actual OAuth flow will occur.',
      note: 'In production, this would redirect to Instagram OAuth to authenticate your Business account.',
    });
  } catch (error) {
    console.error('Error in Instagram auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
