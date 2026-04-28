import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET /api/social/instagram/callback
 * Handle Instagram OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Verify state cookie
    const stateCookie = request.cookies.get('instagram_oauth_state')?.value;

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

    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/social/instagram/callback`;

    if (!appId || !appSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=not_configured`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Instagram token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;

    // Get long-lived token
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${access_token}`
    );

    let longLivedToken = access_token;
    let expiresIn = 0;

    if (longLivedTokenResponse.ok) {
      const longLivedData = await longLivedTokenResponse.json();
      longLivedToken = longLivedData.access_token;
      expiresIn = longLivedData.expires_in || 0;
    }

    // Get user profile information
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${longLivedToken}`
    );

    let accountName = '';
    let accountUsername = '';

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      accountName = profileData.username || '';
      accountUsername = profileData.username || '';
    }

    // Calculate token expiration
    const tokenExpiresAt = expiresIn > 0
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    // Store in database
    const { error: upsertError } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: 'instagram',
        account_id: user_id,
        account_name: accountName,
        account_username: accountUsername,
        access_token: longLivedToken,
        token_expires_at: tokenExpiresAt,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform',
      });

    if (upsertError) {
      console.error('Error storing Instagram account:', upsertError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/business?error=database_error`
      );
    }

    // Clear state cookie and redirect
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/business?success=instagram_connected`
    );
    response.cookies.delete('instagram_oauth_state');

    return response;
  } catch (error) {
    console.error('Error in Instagram callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/business?error=internal_error`
    );
  }
}
