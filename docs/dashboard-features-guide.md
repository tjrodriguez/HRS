# Dashboard Features & Quick Reference

Comprehensive feature list and quick reference for the Holiday Marketing Reminder System dashboard.

## Core Features

### 🏠 Dashboard Homepage
**Location**: `/dashboard`

**What it does**:
- Shows welcome message with current date
- Displays 3 key stats cards:
  - Upcoming holidays (next 60 days)
  - Pending reminders (action needed)
  - Total engagement from recent posts
- Lists top 5 upcoming holidays with quick create buttons
- Highlights holidays needing attention (within 7 days)
- Action alert for holidays needing reminders
- Marketing pro tips section

**User Actions**:
- Click holiday to see details
- Click "Create Post" to generate content
- View upcoming events at a glance

### 📊 Analytics Dashboard
**Location**: `/analytics`

**What it does**:
- Shows key performance metrics:
  - Total likes, comments, shares
  - Total reach and engagement rate
- Displays best performing campaign highlight
- Bar chart: Engagement breakdown by holiday
- Line chart: Reach trend over time
- Pie chart: Platform distribution
- Campaign details table with individual metrics
- Key insights and recommendations

**User Actions**:
- View detailed engagement metrics
- Compare performance across holidays
- Understand platform effectiveness
- Sort/filter campaign results

### 📅 Holiday Calendar
**Location**: `/holidays`

**What it does**:
- Browse all holidays in a calendar view
- Holidays grouped by month/year
- Search holidays by name or description
- Filter by type (international, local, cultural, seasonal)
- Shows color-coded holiday types
- Displays days until each holiday
- Shows reminder status for each holiday
- Quick access to create content

**User Actions**:
- Search: Type holiday name to find specific days
- Filter: Select holiday type to view categories
- Browse: Scroll through all upcoming holidays
- Quick Create: Jump directly to content generation

### 👔 Business Profile
**Location**: `/business`

**What it does**:
- Manage business information
- Customize AI content generation
- Configure active social platforms
- Store business details for personalization

**Fields**:
- Business name
- Business type (dropdown with preset options)
- Business description
- Location
- Target audience description
- Active social media platforms (multi-select)

**User Actions**:
- Fill form with business details
- Select business type
- Toggle social platforms
- Save profile with one click

### ✨ Content Generator
**Location**: `/create/[holiday-id]`

**What it does**:
- Generates AI-powered marketing content
- Creates Instagram-ready captions with hashtags
- Generates professional email copy
- Shows content in organized tabs
- Copy-to-clipboard functionality
- Regenerate option for variations
- Marketing tips for better performance

**Generated Content Includes**:
- **Instagram**: Catchy captions, relevant hashtags, emojis
- **Email**: Subject line + body text with call-to-action

**User Actions**:
- View generated Instagram caption
- View generated email copy
- Switch between content types
- Copy content to clipboard
- Regenerate for different variations
- Read marketing tips

## Quick Reference Guide

### Navigation

```
Dashboard (/)
├── Dashboard (/dashboard) - Overview
├── Analytics (/analytics) - Performance metrics
├── Holidays (/holidays) - Holiday browser
├── Business Profile (/business) - Settings
└── Create Content (/create/[id]) - AI generation
```

### Keyboard Shortcuts

- `Esc`: Close dialogs/modals
- Click holiday name: View details
- Click "Create Post": Generate content
- Cmd/Ctrl + C: Copy to clipboard

### Status Indicators

| Indicator | Meaning | Color |
|-----------|---------|-------|
| "Today!" | Holiday is today | 🔴 Red |
| "Tomorrow" | Holiday is tomorrow | 🟠 Orange |
| "X days away" | Time until holiday | 🔵 Blue |
| "Post Created" | Content already generated | 🟢 Green |
| "Action Needed" | Within 7 days, no content | 🟠 Orange |

### Holiday Types

| Type | Description | Use Case |
|------|-------------|----------|
| International | Global holidays (Christmas, Diwali) | Worldwide reach |
| Local | Country-specific (Thanksgiving) | Regional campaigns |
| Cultural | Cultural celebrations (Pride Month) | Community engagement |
| Seasonal | Season-based (Back to School) | Trend-based marketing |

### Business Types

- Coffee Shop
- Restaurant
- Retail Store
- Bakery
- Boutique
- Salon & Spa
- Fitness Studio
- Bookstore
- Florist
- Other

### Social Platforms

- Instagram
- Facebook
- Twitter
- LinkedIn
- TikTok

## Content Generation Details

### AI Model Used
- **Provider**: Groq
- **Model**: Mixtral-8x7b-32768
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 2000 per request

### What Gets Generated

#### Instagram Captions
✅ Include emojis
✅ Add relevant hashtags
✅ Include call-to-action
✅ Personalized for business type
✅ Optimized for engagement
✅ 2-3 paragraphs max

#### Email Copy
✅ Compelling subject line
✅ 2-3 paragraph body
✅ Clear call-to-action
✅ Professional tone
✅ Business-specific messaging
✅ Personalization with business name

### Customization Tips
1. **Add Visuals**: Include high-quality images (2.3x better engagement)
2. **Best Time to Post**: 9-11 AM or 7-9 PM
3. **Use CTAs**: "Shop Now", "Learn More", "Join Us"
4. **Keep Authentic**: Customize AI content to match your voice
5. **Add Hashtags**: Include 5-10 relevant hashtags

## Data & Metrics

### Dashboard Stats

**Upcoming Holidays**
- Count within next 60 days
- Filtered from all available holidays
- Sorted by date

**Pending Reminders**
- Holidays within 7 days
- Without generated content
- Sorted by urgency

**Total Engagement**
- Sum of likes, comments, shares
- From last 3 posts
- Used to calculate engagement rate

### Analytics Metrics

| Metric | Description | Formula |
|--------|-------------|---------|
| Likes | Total thumbs up reactions | Sum of all likes |
| Comments | Total comments on posts | Sum of all comments |
| Shares | Number of shares/retweets | Sum of all shares |
| Reach | Total people who saw post | Sum of reach |
| Engagement Rate | Interaction rate percentage | (Likes+Comments+Shares)/Reach×100 |

### Platform Breakdown

Shows engagement distribution across:
- Instagram
- Facebook
- Twitter
- LinkedIn
- TikTok

## Performance Benchmarks

**Expected Engagement Rates**:
- Regular posts: 1-3%
- Holiday posts: 3-7%
- Well-optimized posts: 5-10%+

**Reach Comparison**:
- Standard content: Base reach
- Holiday content: +45% reach increase
- Time-optimized: Additional +30% increase

## Tips & Best Practices

### Before Publishing Content
- ✅ Customize AI-generated copy
- ✅ Add high-quality images/videos
- ✅ Double-check hashtags
- ✅ Verify links work
- ✅ Test on mobile view

### After Publishing
- ✅ Monitor engagement in real-time
- ✅ Respond to comments quickly
- ✅ Track metrics for insights
- ✅ Note what works best
- ✅ Plan next holiday content early

### Holiday Marketing Strategy
- Plan 1-2 weeks in advance
- Create multiple content variations
- Schedule posts for optimal times
- Engage with audience responses
- Track ROI and adjust strategy

## Common Questions

### Q: How often should I update my business profile?
**A**: Update annually or when:
- Business focus changes
- Target audience shifts
- New platforms added
- Business type evolves

### Q: Can I regenerate content multiple times?
**A**: Yes! Click "Regenerate" to get different variations. Each generates fresh content.

### Q: How far in advance does the dashboard show holidays?
**A**: Dashboard shows holidays up to 60 days away on homepage. Calendar shows all upcoming holidays.

### Q: Are the AI suggestions trademarked?
**A**: No. Content is generated specifically for your business and you own all rights to it.

### Q: Can I export analytics data?
**A**: Currently, you can copy metrics manually. Export feature coming soon.

### Q: What if I don't like the generated content?
**A**: Click "Regenerate" for new variations or manually edit the content to match your brand voice.

## Keyboard Navigation

- `Tab`: Move between fields/buttons
- `Enter`: Submit form or activate button
- `Space`: Toggle checkboxes/select options
- `Escape`: Close modals/alerts

## Mobile Responsiveness

Dashboard is fully responsive:
- Desktop: Full sidebar + full width content
- Tablet: Collapsible sidebar + medium width
- Mobile: Hidden sidebar (hamburger menu) + full width

## Data Privacy

- Business information stored securely
- Engagement data tracked anonymously
- No third-party data sharing
- GDPR compliant
- Data stored in Supabase with encryption

## Integrations

**Current**:
- ✅ Groq AI (content generation)
- ✅ Supabase (auth & database)

**Coming Soon**:
- 📅 Google Calendar sync
- 📧 Email platform integration
- 📱 Instagram API integration
- 📊 Advanced analytics
- 🔔 Notification system

## Support

For issues or questions:
1. Check this guide first
2. Review troubleshooting in setup guide
3. Check browser console for errors (F12)
4. Contact support with error details
