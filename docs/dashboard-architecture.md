# Dashboard System Architecture

This document outlines the architecture and implementation of the Holiday Marketing Reminder System dashboard.

## Overview

The dashboard is built with Next.js App Router and provides a comprehensive interface for small businesses to manage holiday-based marketing campaigns. It includes:

- **Dashboard**: Overview of upcoming holidays and key metrics
- **Analytics**: Detailed performance metrics for past campaigns
- **Holiday Calendar**: Browse and search upcoming holidays by type
- **Business Profile**: Manage business information for AI personalization
- **Content Generator**: AI-powered content creation for social media and email

## File Structure

```
src/app/(dashboard)/
├── layout.tsx                 # Main dashboard layout with sidebar
├── page.tsx                   # Dashboard homepage
├── dashboard.tsx              # Dashboard component (main view)
├── analytics.tsx              # Analytics component
├── analytics/
│   └── page.tsx              # Analytics page wrapper
├── holiday-calendar.tsx       # Holiday calendar component
├── holidays/
│   └── page.tsx              # Holidays page wrapper
├── business-profile.tsx       # Business profile component
├── business/
│   └── page.tsx              # Business profile page wrapper
└── create/
    └── [id]/
        └── page.tsx          # Dynamic content generation page

src/app/api/
└── generate-content/
    └── route.ts              # API route for Groq AI integration
```

## Component Details

### 1. Dashboard Component (`dashboard.tsx`)

**Purpose**: Main dashboard view showing:
- Welcome message with current date
- Key stats cards (upcoming holidays, pending reminders, engagement)
- Action required alerts for holidays needing content
- Upcoming holidays list with quick create buttons
- Marketing tips section

**State Management**: Uses `BusinessContext` for:
- `profile`: User's business profile
- `holidays`: All available holidays
- `engagementData`: Past campaign metrics

**Key Features**:
- Filters holidays within 60 days
- Highlights holidays within 7 days (action required)
- Shows reminder status
- Quick links to create content for each holiday

### 2. Analytics Component (`analytics.tsx`)

**Purpose**: Detailed performance analytics view showing:
- Key metrics cards (likes, comments, shares, reach, engagement rate)
- Best performing campaign highlight
- Bar chart: Engagement by holiday
- Line chart: Reach trend
- Pie chart: Platform distribution
- Campaign details table
- Key insights section

**Charts**: Uses Recharts for visualization
- BarChart: Engagement metrics per holiday
- LineChart: Reach trend over time
- PieChart: Platform distribution

### 3. Business Profile Component (`business-profile.tsx`)

**Purpose**: Manage business information for AI personalization:
- Business name and type
- Business description
- Location
- Target audience
- Active social media platforms

**Form Features**:
- Business type dropdown (Coffee Shop, Restaurant, Retail, etc.)
- Multi-select for social platforms
- Form validation
- Success toast notifications

### 4. Holiday Calendar Component (`holiday-calendar.tsx`)

**Purpose**: Browse and filter all available holidays:
- Search by holiday name or description
- Filter by type (international, local, cultural, seasonal)
- Group holidays by month and year
- Show days until holiday
- Quick action buttons for content creation

**Features**:
- Color-coded holiday types
- Visual day counter
- Pending reminder indicators
- Past holiday markers

### 5. Content Generation Page (`create/[id]/page.tsx`)

**Purpose**: AI-powered content generation for specific holidays:
- Display holiday details
- Generate Instagram captions
- Generate email marketing copy
- Tab-based view for content types
- Copy-to-clipboard functionality
- Regenerate content option
- Marketing tips

**API Integration**:
- Calls `/api/generate-content` endpoint
- Passes business info for personalization
- Handles loading/error states

## API Routes

### POST `/api/generate-content`

**Purpose**: Generate AI content using Groq API

**Request Body**:
```json
{
  "holiday": "Valentine's Day",
  "holidayDescription": "Celebration of love and romance",
  "businessType": "Coffee Shop",
  "businessName": "Brew & Bean",
  "businessDescription": "Specialty coffee shop",
  "targetAudience": "Coffee enthusiasts, remote workers",
  "location": "San Francisco, CA"
}
```

**Response**:
```json
{
  "instagram": "Caption text with hashtags...",
  "email": "Subject line\n\nEmail body content..."
}
```

**Implementation**:
- Uses Groq API (mixtral-8x7b-32768 model)
- Creates system prompt for marketing expertise
- Parses JSON response
- Includes fallback content generation

## State Management

### BusinessContext

Provides global state for:
- **profile**: User's business information
  - name, type, description, location, targetAudience, socialPlatforms
- **holidays**: Array of holiday objects
  - id, name, date, type, category, description, reminderSent
- **engagementData**: Array of campaign metrics
  - holidayId, holidayName, platform, likes, comments, shares, reach
- **setProfile**: Update business profile
- **setHolidays**: Update holidays list
- **setEngagementData**: Update engagement metrics

### Usage Pattern

```tsx
const { profile, holidays, engagementData } = useBusiness();
```

## Styling

- **Tailwind CSS**: Utility-first styling
- **Color Scheme**: Blue and purple gradient primary colors
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization

## Navigation

Dashboard layout includes sidebar with:
- Dashboard link
- Analytics link
- Holidays link
- Business Profile link
- Logout button

Mobile responsive with hamburger menu.

## Key Data Types

### Holiday
```typescript
{
  id: string;
  name: string;
  date: string; // ISO format
  type: 'international' | 'local' | 'cultural' | 'seasonal';
  category: string;
  description: string;
  reminderSent: boolean;
}
```

### Profile
```typescript
{
  name: string;
  type: string;
  description: string;
  location: string;
  targetAudience: string;
  socialPlatforms: string[];
}
```

### EngagementData
```typescript
{
  id: string;
  holidayId: string;
  holidayName: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}
```

## Security Considerations

1. **Environment Variables**: Groq API key stored in `GROQ_API_KEY`
2. **Client Components**: Use 'use client' for interactive features
3. **Server Actions**: API routes use proper HTTP methods
4. **Error Handling**: Graceful fallbacks for API failures

## Performance Optimizations

1. **Lazy Loading**: Components load only when needed
2. **Chart Optimization**: Recharts handles large datasets efficiently
3. **Image Optimization**: Next.js Image component for images
4. **Code Splitting**: Dynamic imports for heavy components

## Future Enhancements

1. **Social Media Integration**: Direct posting to platforms
2. **Email Campaign Manager**: Schedule and send campaigns
3. **Advanced Analytics**: More detailed performance metrics
4. **A/B Testing**: Test different content variations
5. **Team Collaboration**: Multi-user support with roles
6. **Mobile App**: React Native mobile version
7. **Webhook Support**: Real-time sync with social platforms
8. **Advanced Scheduling**: Queue posts for optimal times

## Troubleshooting

### Content Generation Fails
- Check `GROQ_API_KEY` environment variable
- Verify Groq API quota/credits
- Check network connectivity
- Review API response in browser console

### Business Context Not Updating
- Ensure component is wrapped in `BusinessProvider`
- Check browser console for errors
- Verify state updates with React DevTools

### Navigation Issues
- Check sidebar href attributes match route structure
- Verify (dashboard) route group is properly configured
- Check next.config.ts for any route restrictions
