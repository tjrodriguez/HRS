import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  followers_count?: number;
  fan_count?: number;
}

interface FacebookUserAccounts {
  data: FacebookPage[];
}

/**
 * GET /api/social/facebook/callback
 * Handle Facebook OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Verify state cookie
    const stateCookie = request.cookies.get('facebook_oauth_state')?.value;

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state || state !== stateCookie) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=invalid_state`
      );
    }

    // Parse state to get user ID
    let userId: string;
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      userId = stateData.userId;
    } catch {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=invalid_state`
      );
    }

    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/social/facebook/callback`;

    if (!appId || !appSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=not_configured`
      );
    }

    // Exchange code for access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    tokenUrl.searchParams.append('client_id', appId);
    tokenUrl.searchParams.append('client_secret', appSecret);
    tokenUrl.searchParams.append('redirect_uri', redirectUri);
    tokenUrl.searchParams.append('code', code);

    const tokenResponse = await fetch(tokenUrl.toString());

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Facebook token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user's pages
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,category,picture,followers_count,fan_count&access_token=${access_token}`
    );

    if (!accountsResponse.ok) {
      console.error('Failed to fetch Facebook pages');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=fetch_pages_failed`
      );
    }

    const accountsData: FacebookUserAccounts = await accountsResponse.json();
    const pages = accountsData.data;

    if (!pages || pages.length === 0) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=no_pages_found`
      );
    }

    // Use the first page (primary page)
    const primaryPage = pages[0];
    const followerCount = primaryPage.followers_count || primaryPage.fan_count || 0;

    // Store in database
    const { error: upsertError } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'facebook',
        account_id: primaryPage.id,
        account_name: primaryPage.name,
        account_username: primaryPage.name,
        access_token: primaryPage.access_token,
        profile_picture_url: primaryPage.picture?.data?.url || null,
        follower_count: followerCount,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform',
      });

    if (upsertError) {
      console.error('Error storing Facebook account:', upsertError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=database_error`
      );
    }

    // Clear state cookie and redirect
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/business?success=facebook_connected`
    );
    response.cookies.delete('facebook_oauth_state');

    return response;
  } catch (error) {
    console.error('Error in Facebook callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/business?error=internal_error`
    );
  }
}
