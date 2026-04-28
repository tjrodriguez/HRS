# Social Media Integration Guide (Simulation Mode)

This document describes the **simulated** Instagram and Facebook posting feature for HolidayBoost.

## Overview

The social media integration demonstrates how direct posting would work, but runs in **simulation mode** without actual API calls. This allows users to experience the full workflow without the complexity of:
- Meta Developer account setup
- OAuth app configuration
- API permissions and approvals
- Production compliance requirements

## Current Behavior (Demo Mode)

The system simulates:
- **Connected accounts** - Always shows as "connected" with sample data
- **OAuth flow** - Button clicks simulate connection without real OAuth
- **Posting** - "Simulate Post" button mimics posting with artificial delay
- **Success feedback** - Shows confirmation that simulation completed

## How It Works

### API Routes

All routes return demo/simulated responses:

- `GET /api/social/accounts` - Returns mock Instagram & Facebook accounts
- `GET /api/social/instagram/auth` - Returns demo mode message
- `GET /api/social/facebook/auth` - Returns demo mode message
- `DELETE /api/social/accounts` - Simulates disconnect
- `POST /api/social/post` - Simulates posting (1.5s delay) with fake post IDs

### Frontend

**`SocialAccountsManager`** component shows:
- "Demo Mode" badge in the header
- Simulated account data (1,250 Instagram followers, 3,400 Facebook followers)
- Connect/Disconnect buttons that trigger simulations
- Blue info box explaining demo mode

**Campaign Creation page** shows:
- "Simulate Post" button instead of "Post Now"
- Posts to simulated accounts when clicked
- Toast notification confirming simulation completed

## User Flow

1. **Navigate to Business Profile** (`/business`)
2. **See "Demo Mode" indicator** on Social Media Accounts card
3. **Create campaign** for any holiday
4. **Click "Simulate Post"** button
5. **View simulation feedback** - Shows success message indicating it was a demo

## To Enable Real Integration

To switch from simulation to real API integration:

### 1. Set up Meta Developer Account
- Create account at https://developers.facebook.com
- Create app with Instagram Basic Display and Graph API products
- Configure OAuth redirect URIs
- Obtain App ID and App Secret

### 2. Update API Routes

**Replace demo responses with real implementations:**

`src/app/api/social/instagram/auth/route.ts`:
- Initiate actual OAuth flow to Instagram
- Use `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET`

`src/app/api/social/facebook/auth/route.ts`:
- Initiate actual OAuth flow to Facebook
- Use `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`

`src/app/api/social/post/route.ts`:
- Make actual API calls to Instagram Graph API
- Make actual API calls to Facebook Graph API
- Store real post IDs in database

### 3. Database

Migration `004_add_social_accounts.sql` is already in place for storing:
- OAuth tokens
- Account information
- Post tracking data

### 4. Environment Variables

Add to `.env.local`:
```bash
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/api/social/instagram/callback

FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_REDIRECT_URI=https://yourdomain.com/api/social/facebook/callback

NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 5. Update Frontend Labels

Change button text:
- "Simulate Post" → "Post Now"
- Update toast messages to reflect real posting

## Requirements for Real Integration

### Instagram
- Business or Creator account (personal accounts don't work)
- Facebook Page connection
- `instagram_content_publish` permission (requires app review)
- Meta Business Verification

### Facebook
- Facebook Page admin/editor access
- `pages_manage_posts` permission
- `pages_read_engagement` permission

## Files to Modify for Real Integration

| File | Change |
|------|--------|
| `src/app/api/social/instagram/auth/route.ts` | Add OAuth flow |
| `src/app/api/social/instagram/callback/route.ts` | Handle token exchange |
| `src/app/api/social/facebook/auth/route.ts` | Add OAuth flow |
| `src/app/api/social/facebook/callback/route.ts` | Handle token exchange |
| `src/app/api/social/accounts/route.ts` | Query real database data |
| `src/app/api/social/post/route.ts` | Make actual API calls |
| `src/components/social/social-accounts-manager.tsx` | Remove "Demo Mode" badge |
| `src/lib/social.ts` | Handle real OAuth redirects |
| `src/app/(dashboard)/create/[id]/page.tsx` | Change "Simulate" to "Post Now" |

## API Response Formats

Current demo response:
```json
{
  "success": true,
  "simulated": true,
  "results": [
    {
      "platform": "instagram",
      "success": true,
      "post_id": "instagram_1234567890_abc123",
      "simulated": true
    }
  ],
  "platform_post_ids": {
    "instagram": "instagram_1234567890_abc123"
  },
  "message": "This was a simulated post. In production, this would publish to your connected social media accounts."
}
```

## Notes

- The simulation adds a realistic 1.5 second delay to mimic API latency
- Post IDs are generated with timestamps to appear unique
- The database schema is ready for real integration
- All security considerations (RLS, token storage) are already implemented
- OAuth state verification is ready to be enabled

## Future Enhancements (When Going Live)

- [ ] Add rate limiting
- [ ] Implement token refresh logic
- [ ] Add error retry mechanisms
- [ ] Image upload functionality
- [ ] Scheduled posting via cron
- [ ] Analytics data pull
- [ ] Multiple account support
