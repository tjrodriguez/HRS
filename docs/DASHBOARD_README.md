# Holiday Marketing Reminder System - Dashboard

A modern, full-featured dashboard for managing holiday-based marketing campaigns with AI-powered content generation.

![Dashboard Preview](./dashboard-preview.png)

## 🎯 What It Does

The dashboard helps small business owners:
- **Discover** upcoming holidays relevant to their business
- **Generate** AI-powered marketing content (Instagram + Email)
- **Track** campaign performance and engagement metrics
- **Plan** holiday marketing strategies in advance
- **Organize** all marketing in one centralized place

## ✨ Key Features

### 1. **Dashboard Homepage** 📱
- Quick overview of upcoming holidays
- Key performance metrics at a glance
- Action alerts for holidays needing attention
- One-click access to content creation

### 2. **Holiday Calendar** 📅
- Browse 100+ holidays throughout the year
- Filter by type (international, local, cultural, seasonal)
- Search for specific holidays
- View countdown timer for each holiday
- See which holidays need marketing content

### 3. **AI Content Generator** ✨
- **Instagram captions** with hashtags and emojis
- **Email marketing copy** with subject lines
- Personalized based on your business type
- One-click regenerate for variations
- Easy copy-to-clipboard functionality

### 4. **Analytics Dashboard** 📊
- Real-time engagement metrics (likes, comments, shares)
- Reach statistics and engagement rates
- Performance charts and visualizations
- Platform breakdown analysis
- Best performing campaign highlights

### 5. **Business Profile** 👔
- Manage business information
- Customize AI personalization
- Select active social media platforms
- Store target audience details

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Groq API key (free at https://console.groq.com/)
- Supabase project

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd juswa

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### First Time Setup

1. **Authenticate**: Go to `/login` and sign in with Supabase
2. **Setup Profile**: Go to `/business` and fill in your details
3. **Explore Holidays**: Check out `/holidays` to see upcoming dates
4. **Generate Content**: Pick a holiday and click "Create Post"
5. **Check Analytics**: View `/analytics` to track performance

## 📁 Project Structure

```
src/app/(dashboard)/
├── layout.tsx                    # Dashboard layout with sidebar
├── page.tsx                      # Main dashboard page
├── dashboard.tsx                 # Dashboard component
├── analytics.tsx                 # Analytics component
├── holiday-calendar.tsx          # Holiday calendar component
├── business-profile.tsx          # Business profile component
├── analytics/page.tsx            # Analytics page
├── holidays/page.tsx             # Holiday calendar page
├── business/page.tsx             # Business profile page
└── create/[id]/page.tsx         # Content generator page

src/app/api/
└── generate-content/route.ts    # AI content generation API
```

## 🔌 API Integration

### Groq API
- **Purpose**: AI-powered content generation
- **Model**: Mixtral-8x7b-32768
- **Features**: Marketing expertise, personalization, tone matching
- **Free Tier**: 30 requests per minute

### Supabase
- **Purpose**: Authentication and data storage
- **Services**: Auth, PostgreSQL, Row-level security
- **Features**: User profiles, holidays, engagement data

## 🎨 UI Components

Built with:
- **React**: UI library
- **Next.js**: App Router, server components
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Recharts**: Data visualization

## 🧠 State Management

Uses React Context API (`BusinessContext`) for:
- User profile data
- Holiday list
- Engagement metrics
- Global app state

No Redux or complex state needed - perfect for medium-sized apps!

## 📊 Data Models

### Holiday
```typescript
{
  id: string;
  name: string;
  date: string;                    // ISO format
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
  type: string;                    // Business type
  description: string;
  location: string;
  targetAudience: string;
  socialPlatforms: string[];
}
```

### Engagement
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

## 🔐 Security

- ✅ Row-level security (RLS) with Supabase
- ✅ Environment variables for sensitive keys
- ✅ Input validation on all forms
- ✅ Secure API routes
- ✅ No client-side secrets exposed

## 📱 Responsive Design

- ✅ Desktop optimized
- ✅ Tablet friendly
- ✅ Mobile responsive with hamburger menu
- ✅ Touch-friendly buttons
- ✅ Readable text sizes

## ⚡ Performance

- Page load: < 2s
- Content generation: < 10s
- Analytics rendering: < 2s
- Optimized images with Next.js Image
- Lazy loading for charts
- Code splitting per route

## 🎓 Learning Resources

- **Architecture**: See `docs/dashboard-architecture.md`
- **Setup Guide**: See `docs/dashboard-setup-guide.md`
- **Features**: See `docs/dashboard-features-guide.md`
- **Code Comments**: Check source files for inline documentation

## 🛠️ Development

### Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint and fix code
npm run lint
npm run lint:fix

# Type check
npm run type-check
```

### Code Structure

- **Client Components**: `"use client"` directive for interactivity
- **Server Components**: Default for data fetching
- **Route Handlers**: `/api/*` for backend logic
- **Context**: `BusinessContext` for global state

### Adding New Features

1. Create new component in appropriate folder
2. Mark as `"use client"` if interactive
3. Use `useBusiness()` hook for context
4. Add route in `(dashboard)` folder structure
5. Update sidebar navigation

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Environment Variables

Add to your hosting platform:
```
GROQ_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### Database

Ensure these tables exist in Supabase:
- `profiles` - User business info
- `holidays` - Holiday master data
- `engagement_data` - Campaign metrics

## 📈 Future Enhancements

- [ ] Direct social media posting
- [ ] Email campaign scheduler
- [ ] Advanced A/B testing
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics (ML insights)
- [ ] Content library/templates

## 🐛 Troubleshooting

### Content generation not working?
1. Check `GROQ_API_KEY` in `.env.local`
2. Verify Groq API quota at console.groq.com
3. Check network tab in DevTools (F12)

### Data not loading?
1. Verify Supabase connection
2. Check browser console for errors
3. Ensure you're authenticated
4. Check Supabase project has data

### Layout broken?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Run `npm run build` to check errors
3. Restart dev server
4. Check all imports are correct

## 📞 Support

- **Documentation**: Check `docs/` folder
- **Issues**: Check GitHub issues
- **Email**: support@example.com

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq](https://groq.com/)
- [Supabase](https://supabase.com/)

## 📞 Contact

For questions or feedback, please reach out at support@example.com

---

**Happy Holiday Marketing! 🎉**

*Start creating amazing content for every holiday of the year.*
