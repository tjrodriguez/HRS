import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface PostRequest {
  campaign_id: string;
  platforms: ('instagram' | 'facebook')[];
  content: {
    caption: string;
    hashtags?: string[];
    image_url?: string;
  };
}

/**
 * POST /api/social/post
 * Simulate posting to social media platforms (demo mode)
 * This mimics the posting behavior without actual API calls
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

    const body: PostRequest = await request.json();
    const { campaign_id, platforms, content } = body;

    if (!campaign_id || !platforms || platforms.length === 0 || !content?.caption) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get campaign to verify ownership
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaign_id)
      .eq('user_id', user.id)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Simulate posting delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results: {
      platform: string;
      success: boolean;
      post_id?: string;
      simulated: boolean;
      error?: string;
    }[] = [];

    const platformPostIds: Record<string, string> = {};

    // Simulate posting to each platform
    for (const platform of platforms) {
      // Generate a realistic-looking post ID
      const postId = `${platform}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      results.push({
        platform,
        success: true,
        post_id: postId,
        simulated: true,
      });

      platformPostIds[platform] = postId;
    }

    // Update campaign with simulated post results
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({
        status: 'posted',
        posted_at: new Date().toISOString(),
        platform_post_ids: platformPostIds,
        post_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', campaign_id);

    if (updateError) {
      console.error('Error updating campaign after simulated posting:', updateError);
    }

    return NextResponse.json({
      success: true,
      simulated: true,
      results,
      platform_post_ids: platformPostIds,
      message: 'This was a simulated post. In production, this would publish to your connected social media accounts.',
    });
  } catch (error) {
    console.error('Error in POST /api/social/post:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
