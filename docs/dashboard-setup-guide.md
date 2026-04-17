# Dashboard Setup Guide

Complete guide for setting up and running the Holiday Marketing Reminder System Dashboard.

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Groq API account with API key
- Supabase project (for authentication)
- Environment variables configured

## Environment Setup

### 1. Groq API Configuration

Create a `.env.local` file in the project root:

```env
# Groq API - for content generation
GROQ_API_KEY=your_groq_api_key_here

# Supabase - for auth and database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Other optional settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Groq API Key

1. Visit https://console.groq.com/
2. Sign up/login to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local`

## Installation & Running

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Server will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Dashboard Routes

Once authenticated, access these dashboard pages:

| Route | Purpose | Component |
|-------|---------|-----------|
| `/dashboard` | Main dashboard overview | Dashboard |
| `/analytics` | Performance analytics | Analytics |
| `/holidays` | Browse all holidays | HolidayCalendar |
| `/business` | Manage business profile | BusinessProfile |
| `/create/[id]` | Generate content for holiday | CreatePage |

## Initial Setup Steps

### 1. Authentication

Navigate to `/login` and authenticate with your Supabase credentials.

### 2. Complete Business Profile

1. Go to `/business`
2. Fill in your business details:
   - Business name
   - Business type (Coffee Shop, Restaurant, etc.)
   - Business description
   - Location
   - Target audience
   - Active social media platforms
3. Click "Save Profile"

### 3. View Upcoming Holidays

1. Go to `/holidays`
2. Browse the calendar
3. Search or filter by type (international, local, cultural, seasonal)

### 4. Generate Content

1. Click "Create Post" on any holiday
2. Wait for AI content generation
3. Review generated Instagram captions and email copy
4. Copy content to clipboard
5. Customize and publish on your platforms

### 5. Track Analytics

1. Go to `/analytics`
2. View performance metrics:
   - Total likes, comments, shares
   - Reach statistics
   - Engagement rates
   - Platform distribution
   - Best performing campaigns

## Data Structures

### Profile Object

```typescript
{
  name: string;                    // Business name
  type: string;                    // Business type
  description: string;             // Business description
  location: string;                // Business location
  targetAudience: string;          // Target audience description
  socialPlatforms: string[];       // Active platforms
}
```

### Holiday Object

```typescript
{
  id: string;                      // Unique identifier
  name: string;                    // Holiday name
  date: string;                    // ISO format date
  type: string;                    // international, local, cultural, seasonal
  description: string;             // Holiday description
  category: string;                // Holiday category
  reminderSent: boolean;           // If reminder sent
}
```

### Engagement Data Object

```typescript
{
  id: string;
  holidayId: string;               // Related holiday
  holidayName: string;             // Holiday name
  platform: string;                // Social platform
  likes: number;                   // Number of likes
  comments: number;                // Number of comments
  shares: number;                  // Number of shares
  reach: number;                   // Reach count
}
```

## API Endpoints

### POST `/api/generate-content`

Generates AI-powered marketing content.

**Request**:
```bash
curl -X POST http://localhost:3000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "holiday": "Valentine's Day",
    "holidayDescription": "Celebration of love",
    "businessType": "Coffee Shop",
    "businessName": "Brew & Bean",
    "businessDescription": "Specialty coffee",
    "targetAudience": "Coffee lovers",
    "location": "San Francisco"
  }'
```

**Response**:
```json
{
  "instagram": "Caption with hashtags...",
  "email": "Subject line\n\nEmail body..."
}
```

## Customization

### Adding New Business Types

Edit the `businessTypes` array in [BusinessProfile component](./src/app/(dashboard)/business-profile.tsx):

```typescript
const businessTypes = [
  'Coffee Shop',
  'Restaurant',
  'Retail Store',
  // ... add more types here
];
```

### Modifying AI Prompt

Edit the system prompt in [`/api/generate-content/route.ts`](./src/app/api/generate-content/route.ts):

```typescript
const systemPrompt = `You are an expert social media copywriter...`; // Modify here
```

### Changing Color Scheme

Dashboard uses Tailwind CSS utility classes. Modify colors in:
- Component files: Update `from-blue-600`, `bg-blue-100` classes
- `tailwind.config.ts`: Define custom color palette

## Troubleshooting

### Content Generation Not Working

**Problem**: "Failed to generate content" error

**Solutions**:
1. Verify `GROQ_API_KEY` is set correctly in `.env.local`
2. Check Groq API quota: https://console.groq.com/
3. Ensure network connectivity
4. Check browser console (F12) for detailed error message

### Data Not Loading

**Problem**: Dashboard shows empty or fallback data

**Solutions**:
1. Check if authenticated (should redirect to `/login` if not)
2. Verify Supabase connection: `NEXT_PUBLIC_SUPABASE_URL` and key
3. Check Supabase project has data populated
4. Review network tab in DevTools for failed requests

### Layout Issues

**Problem**: Sidebar not showing or layout broken

**Solutions**:
1. Clear browser cache and reload
2. Run `npm run build` to check for build errors
3. Verify all component imports are correct
4. Check that `BusinessProvider` wraps the dashboard layout

### Profile Not Saving

**Problem**: Business profile changes not persisting

**Solutions**:
1. Check browser console for errors
2. Verify you're authenticated
3. Confirm Supabase database has write permissions
4. Check network tab for failed requests

## Performance Tips

1. **Reduce Chart Data**: Analytics loads all engagement data; paginate for large datasets
2. **Lazy Load Images**: Add Next.js Image optimization
3. **Cache API Responses**: Implement SWR or React Query for data fetching
4. **Optimize Bundle**: Run `npm run build` and check for large dependencies

## Security Best Practices

1. **Never commit `.env.local`**: Add to `.gitignore`
2. **Rotate API Keys**: Periodically update Groq API key
3. **Secure Supabase RLS**: Set up row-level security policies
4. **Validate Input**: All form inputs are validated
5. **CORS Headers**: API routes include proper security headers

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

1. Select your project
2. Set environment variables in Vercel dashboard
3. Deploy with `vercel --prod`

### Environment Variables for Production

Add to Vercel project settings:
- `GROQ_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Database Migrations

For production database setup:

```bash
# Create schema in Supabase
supabase migration new create_initial_schema
```

Ensure these tables exist:
- `profiles` - User business profiles
- `holidays` - Holiday master data
- `engagement_data` - Campaign performance metrics

## Support & Resources

- **Groq API Docs**: https://console.groq.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Next Steps

1. Complete the business profile setup
2. Test content generation with a sample holiday
3. Track analytics for your first campaign
4. Customize prompts and styling to match your brand
5. Integrate with your social media platforms
