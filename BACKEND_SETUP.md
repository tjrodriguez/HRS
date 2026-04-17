# Backend Infrastructure Complete ✅

## API Endpoints

### Campaigns
- **GET** `/api/campaigns` - Fetch all campaigns
- **POST** `/api/campaigns` - Create a new campaign
- **GET** `/api/campaigns/[id]` - Fetch specific campaign
- **PATCH** `/api/campaigns/[id]` - Update campaign (including edited content)
- **DELETE** `/api/campaigns/[id]` - Delete campaign

### Profile
- **GET** `/api/profile` - Fetch user profile
- **PATCH** `/api/profile` - Update profile

### Analytics
- **POST** `/api/analytics` - Log an analytics event
- **GET** `/api/analytics` - Fetch analytics summary

### Scheduling
- **POST** `/api/schedule` - Schedule a campaign
- **GET** `/api/schedule` - Fetch scheduled campaigns

## Database Schema Setup

Create these tables in Supabase:

### 1. Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  type TEXT,
  location TEXT,
  description TEXT,
  target_audience TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Campaigns Table
```sql
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  holiday_id TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{"instagram":"","email":"","hashtags":[]}',
  platforms JSONB DEFAULT '{"instagram":true,"facebook":false,"twitter":false}',
  status TEXT DEFAULT 'draft', -- draft, scheduled, posted, archived
  scheduled_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON campaigns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON campaigns
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON campaigns
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Analytics Table
```sql
CREATE TABLE analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  event_type TEXT NOT NULL, -- view, click, share, engagement
  platform TEXT,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics" ON analytics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. Holidays Table (if not exists)
```sql
CREATE TABLE holidays (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  category TEXT
);
```

## Frontend Integration

### Import Database Helpers

```typescript
// For campaigns
import { 
  fetchCampaigns, 
  createCampaign, 
  updateCampaign, 
  scheduleCampaign 
} from '@/lib/campaigns';

// For profile
import { fetchProfile, updateProfile } from '@/lib/profile';

// For analytics
import { logAnalyticsEvent, fetchAnalytics } from '@/lib/analytics';
```

### Usage Example

```typescript
// Save edited campaign
const updatedCampaign = await updateCampaign(campaignId, {
  content: {
    instagram: editedCaption,
    email: emailContent,
    hashtags
  }
});

// Schedule campaign
const scheduled = await scheduleCampaign(campaignId, scheduledDate, platforms);

// Log engagement
await logAnalyticsEvent(campaignId, 'engagement', 'instagram', {
  reach: 3500,
  engagement: 250
});
```

## What's Backend-Enabled

✅ Caption editing - persists to database
✅ Campaign creation - saves to campaigns table
✅ Campaign scheduling - updates scheduled_date + status
✅ Profile management - stored in profiles table
✅ Analytics tracking - logs events + metrics
✅ Real-time updates - all changes immediately stored
✅ Row Level Security - users only see their own data

## Next Steps

1. Run the SQL schema creation in Supabase
2. Import the database helper functions in your frontend pages
3. Call the helper functions instead of just updating local state
4. Data will now persist and be queryable for analytics
