# Features & Recommendations

> **Last Updated:** 2026-04-27  
> **Project:** Smart Holiday Marketing Reminder System (HolidayBoost)  
> **Purpose:** Living document that catalogs the system's current capabilities and outlines recommended enhancements for upcoming development iterations.

---

## Table of Contents

1. [Current Features & Implemented Functionality](#1-current-features--implemented-functionality)
   - [1.1 Tech Stack & Architecture](#11-tech-stack--architecture)
   - [1.2 Authentication & Authorization](#12-authentication--authorization)
   - [1.3 Dashboard Homepage](#13-dashboard-homepage)
   - [1.4 Holiday Calendar](#14-holiday-calendar)
   - [1.5 AI Content Generator](#15-ai-content-generator)
   - [1.6 Analytics Dashboard](#16-analytics-dashboard)
   - [1.7 Business Profile](#17-business-profile)
   - [1.8 API Layer](#18-api-layer)
   - [1.9 AI / Caption Generation System](#19-ai--caption-generation-system)
   - [1.10 Data Layer & Persistence](#110-data-layer--persistence)
   - [1.11 Design System & UI Components](#111-design-system--ui-components)
   - [1.12 Quality, Observability & Safeguards](#112-quality-observability--safeguards)
2. [Recommendations for Future Development](#2-recommendations-for-future-development)
   - [2.1 Product & UX Enhancements](#21-product--ux-enhancements)
   - [2.2 Platform Integrations](#22-platform-integrations)
   - [2.3 AI & Content Enhancements](#23-ai--content-enhancements)
   - [2.4 Analytics & Insights](#24-analytics--insights)
   - [2.5 Infrastructure & DevOps](#25-infrastructure--devops)
   - [2.6 Quality Assurance & Testing](#26-quality-assurance--testing)

---

## 1. Current Features & Implemented Functionality

### 1.1 Tech Stack & Architecture

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | Server Components by default; Route Handlers for API logic |
| Language | TypeScript 5.x | Strict mode; `ts-node` for scripts |
| Styling | Tailwind CSS v4 | PostCSS integration; `tailwindcss-animate`, `tw-animate-css` |
| UI Library | React 19.2.4 | Client Components marked with `"use client"` |
| Component Kit | shadcn/ui + `@base-ui/react` | 20+ primitives (Button, Card, Dialog, Calendar, Sidebar, etc.) |
| Icons | Lucide React | 50+ icons across the app |
| Charts | Recharts | Bar, Line, Pie charts with responsive containers |
| State Management | React Context API | `BusinessContext` for global profile/holidays/engagement state |
| Notifications | Sonner | Toast notifications for user feedback |
| Date Utilities | date-fns | Holiday calculations, calendar grids, formatting |
| Carousel | Embla Carousel | For any carousel needs |
| OTP Input | input-otp | Authentication flows |
| Themes | next-themes | Dark/light mode support |

**Architecture Patterns:**
- `(dashboard)` route group with persistent `layout.tsx` (sidebar + header)
- Server Actions for data mutations where applicable
- Route Handlers (`/app/api/*`) for external API integrations
- Proxy middleware pattern (`src/proxy.ts`) for auth session refresh and route protection

---

### 1.2 Authentication & Authorization

**Implemented:**
- **Supabase Auth** integration with `@supabase/ssr` and `@supabase/supabase-js`
- **Login page** (`/login`) with Server Actions for Sign In / Sign Up
- **Signup page** (`/signup`) with account creation flow
- **Middleware-level protection** via `src/proxy.ts` — unauthenticated users are redirected to `/login`
- **Row-Level Security (RLS)** on all Supabase tables (`profiles`, `campaigns`, `analytics`, `content_generation_cache`)
- **Session refresh** handled automatically in middleware
- **Logout** functionality in dashboard sidebar

**Files:**
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/proxy.ts`
- `src/utils/supabase/middleware.ts`
- `src/utils/supabase/client.ts`
- `src/utils/supabase/server.ts`

---

### 1.3 Dashboard Homepage

**Route:** `/` (within `(dashboard)` group)

**Features:**
- **Welcome hero** with business name and current date
- **3 key metric cards:**
  - Upcoming holidays (next 60 days)
  - Pending reminders (holidays within 7 days needing content)
  - Total engagement (aggregated likes + comments + shares)
- **Interactive mini-calendar** with month navigation, holiday indicators, and reminder-day markers
- **Action-required alert section** — prominently displays holidays coming within 7 days with "Create Now" CTAs
- **Top 5 upcoming holidays** list with days-until counters, urgency badges, and quick-create links
- **Responsive design** — collapses gracefully to mobile with hamburger menu

**Files:**
- `src/app/(dashboard)/page.tsx`
- `src/components/dashboard/dashboard.tsx`

---

### 1.4 Holiday Calendar

**Route:** `/holidays`

**Features:**
- **Full holiday browser** grouped by month/year
- **Real-time search** by holiday name and description
- **Type filter:** International, Local, Cultural, Seasonal
- **Status filter:** All, Upcoming Only, Past Only
- **Color-coded holiday types** with badge styling
- **Days-until counter** for each holiday ("Today!", "Tomorrow", "X days away")
- **Visual status indicators:** Past holidays dimmed, upcoming highlighted, within-week marked urgent
- **Quick "Create Post" buttons** on every upcoming holiday
- **Results counter** showing filtered count
- **Empty state** with helpful messaging when no holidays match filters

**Files:**
- `src/app/(dashboard)/holidays/page.tsx`
- `src/components/holidays/holiday-calendar.tsx`
- `src/components/holidays/holiday-list.tsx`

---

### 1.5 AI Content Generator

**Route:** `/create/[id]` (dynamic holiday-specific route)

**Features:**
- **Holiday context display** — name, date, and description in a gradient header
- **AI-powered Instagram caption generation** via Groq API
- **Caption regeneration** with uniqueness enforcement (no duplicates across session)
- **Caption history accumulation** — last 10 captions tracked to prevent repetition
- **Editable caption textarea** — users can modify AI output before using
- **Auto-generated hashtags** — tailored to holiday + business type
- **Copy-to-clipboard** — copies caption + hashtags together
- **Platform selection** — Instagram and Facebook (multi-select with visual toggle)
- **Post preview** — Instagram-style mockup showing how the post will look
- **Schedule post button** — placeholder scheduling with toast confirmation
- **Best practices panel** — contextual tips for the specific holiday
- **Graceful fallbacks** — if API fails, shows template captions instead of crashing

**Files:**
- `src/app/(dashboard)/create/[id]/page.tsx`
- `src/components/campaigns/post-creator.tsx`
- `src/hooks/use-groq-caption-generator.ts`

---

### 1.6 Analytics Dashboard

**Route:** `/analytics`

**Features:**
- **5 key metric cards:** Total Likes, Comments, Shares, Reach, Average Engagement Rate
- **Best performing campaign highlight** — trophy card with top post metrics
- **Bar chart:** Engagement breakdown by holiday (likes, comments, shares)
- **Line chart:** Reach trend over time
- **Pie chart:** Platform distribution (Instagram, Facebook, etc.)
- **Campaign details table** — scrollable list of individual posts with per-metric breakdown and engagement rate
- **Responsive chart rendering** — Recharts with custom tooltips and theme-aware colors
- **Real-time calculations** — all metrics computed from engagement data in context

**Files:**
- `src/app/(dashboard)/analytics/page.tsx`
- `src/components/analytics/analytics.tsx`

---

### 1.7 Business Profile

**Route:** `/business` (also accessible via `/profile`)

**Features:**
- **Business name** input (required)
- **Business type** dropdown — 10+ presets (Coffee Shop, Restaurant, Retail Store, Bakery, Boutique, Salon & Spa, Fitness Studio, Bookstore, Florist, Other)
- **Business description** textarea (required)
- **Location** input (required)
- **Target audience** input (required)
- **Form validation** — required fields enforced before save
- **Save with loading state** — spinner feedback during API call
- **Success/error toasts** — Sonner notifications for user feedback
- **Info card** explaining why profile data improves AI suggestions
- **Auto-sync** — form state syncs with context when profile loads from database

**Files:**
- `src/app/(dashboard)/business/page.tsx`
- `src/app/(dashboard)/profile/page.tsx`
- `src/components/profile/business-profile.tsx`

---

### 1.8 API Layer

#### 1.8.1 Content Generation API
**Route:** `POST /api/generate-content`

**Modes:**
- `mode=full` — Returns deterministic fallback payload (Instagram caption, email copy, engagement estimates, platform tips) without AI call to reduce API usage
- `mode=caption` — AI-powered single caption generation with strict validation

**Key Behaviors:**
- Streaming support for initial generation (`stream: true`)
- JSON-only responses for regeneration (`stream: false`)
- Input validation with detailed error messages for missing/invalid fields
- Platform validation (only `Instagram` and `Facebook` accepted)

**File:** `src/app/api/generate-content/route.ts`

#### 1.8.2 Campaigns API
**Route:** `/api/campaigns`
- `GET` — Fetch all campaigns for authenticated user (with holiday join)
- `POST` — Create new campaign (requires `holiday_id`, `content`, `platforms`)

**File:** `src/app/api/campaigns/route.ts`

#### 1.8.3 Campaign Detail API
**Route:** `/api/campaigns/[id]`
- `GET` — Fetch specific campaign
- `PATCH` — Update campaign
- `DELETE` — Delete campaign

**File:** `src/app/api/campaigns/[id]/route.ts`

#### 1.8.4 Analytics API
**Route:** `/api/analytics`
- `POST` — Log engagement event (`view`, `click`, `share`, `engagement`)
- `GET` — Get analytics summary for user's campaigns (aggregated totals + recent events)

**File:** `src/app/api/analytics/route.ts`

#### 1.8.5 Profile API
**Route:** `/api/profile`
- `GET` — Fetch authenticated user's profile
- `PATCH` — Update profile fields (partial updates supported)

**File:** `src/app/api/profile/route.ts`

#### 1.8.6 Schedule API
**Route:** `/api/schedule`
- `POST` — Schedule a campaign (updates `scheduled_date` and `status` to `scheduled`)
- `GET` — Fetch all scheduled campaigns for user, ordered by date

**File:** `src/app/api/schedule/route.ts`

---

### 1.9 AI / Caption Generation System

The caption generation subsystem is the most sophisticated part of the application, with multiple layers of reliability and quality safeguards.

#### Core AI Integration
- **Provider:** Groq API
- **Default Model:** `llama-3.3-70b-versatile` (configurable via `GROQ_MODEL`)
- **Temperature:** 0.7–1.0 (increases with retry attempts)
- **Max Tokens:** 512 (configurable via `GROQ_MAX_COMPLETION_TOKENS`)

#### Caption Generation Flow (`mode=caption`)
1. **Request validation** — Ensures `holidayName`, `businessName`, `businessType`, `tone` are present
2. **Platform normalization** — Validates against supported platforms (`Instagram`, `Facebook`)
3. **Cache check** — Skipped for regeneration requests (`previousCaptions` present)
4. **AI prompt construction:**
   - System prompt: Enforces JSON-array output, strict length limit (~150 chars), uniqueness instructions
   - User prompt: Includes holiday, business, tone, audience, platform, and previous captions to avoid
5. **Response parsing** — Strips markdown code fences, parses JSON array, validates non-empty result
6. **Uniqueness check** — Jaccard similarity ≥ 72% triggers retry
7. **Retry loop** — Up to `GROQ_CAPTION_RETRY_LIMIT` attempts (default 3, max 5), with progressively stronger variation instructions
8. **Fallback selection** — If all retries fail, selects from 4 varied templates, avoiding similarity with previous captions
9. **Cache storage** — Successful non-regeneration responses cached in memory (15 min TTL) and Supabase (`content_generation_cache` table)

#### Anti-Duplication Mechanisms
| Mechanism | Description |
|-----------|-------------|
| **Session History** | Frontend accumulates last 10 captions in `captionHistory` state |
| **Previous Captions Payload** | All prior captions sent to AI in prompt with "do not repeat" instruction |
| **Jaccard Similarity** | Token-based comparison; ≥72% similarity rejects candidate |
| **Exact Match Guard** | Normalized string comparison blocks identical captions |
| **Retry Prompt Hardening** | Each retry adds stronger variation guidance (different hook, emoji, structure) |
| **Distinct Fallbacks** | 4 template variations; timestamp suffix as last resort |
| **Cache Bypass** | Regeneration requests never read from or write to cache |

#### Observability
- Attempt-level logging of raw model responses
- Parse failure counting and logging
- Duplicate/similarity rejection logging
- Fallback activation warnings with context (attempt count, failure reasons)

**Files:**
- `src/app/api/generate-content/route.ts`
- `src/hooks/use-groq-caption-generator.ts`
- `src/components/campaigns/post-creator.tsx`

---

### 1.10 Data Layer & Persistence

#### Database: Supabase (PostgreSQL)

**Tables:**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `profiles` | User business info | `id`, `name`, `type`, `description`, `location`, `target_audience`, `niche`, `tone`, `social_platforms` |
| `holidays` | Holiday master data | `id`, `name`, `date`, `type`, `category`, `description`, `reminder_sent` |
| `campaigns` | Marketing campaigns | `id`, `user_id`, `holiday_id`, `content`, `platforms`, `status`, `scheduled_date` |
| `analytics` | Engagement events | `id`, `user_id`, `campaign_id`, `event_type`, `platform`, `metrics` |
| `content_generation_cache` | AI response cache | `user_id`, `cache_key`, `mode`, `payload`, `expires_at` |

#### Migrations
- `001_create_schema.sql` — Initial schema (profiles, holidays, engagement_data, posts)
- `002_add_profile_fields.sql` — Extended profile fields (niche, tone, social_platforms)
- `003_add_generation_cache.sql` — Persistent AI cache table

#### Data Access Patterns
- **Server Components** — Use `createClient()` from `src/utils/supabase/server.ts`
- **Client Components** — Use `createClient()` from `src/utils/supabase/client.ts`
- **Middleware** — Session refresh and auth checks via `src/utils/supabase/middleware.ts`

**Files:**
- `supabase/migrations/*.sql`
- `src/utils/supabase/*.ts`
- `src/context/BusinessContext.tsx`
- `src/lib/*.ts`

---

### 1.11 Design System & UI Components

**shadcn/ui Components Installed:**
Alert, Badge, Button, Calendar, Card, Checkbox, Dialog, Dropdown Menu, Input, Label, Select, Separator, Sheet, Sidebar, Skeleton, Textarea, Tooltip

**Custom Components:**
- `AppSidebar` — Collapsible navigation with active state highlighting
- `Header` — Top bar with user menu and mobile toggle
- `Layout` — Dashboard shell wrapping sidebar + header + main content
- `PostCreator` — AI caption generation UI with preview
- `BusinessProfile` — Profile form with validation
- `Dashboard` — Homepage with stats, calendar, and alerts
- `Analytics` — Charts and metrics visualization
- `HolidayCalendar` — Holiday browser with filters

**Design Tokens:**
- Primary gradient: Blue (#3b82f6) to Purple (#8b5cf6)
- Consistent 6px grid spacing
- Rounded corners (rounded-xl, rounded-2xl, rounded-3xl)
- Shadow hierarchy (shadow-md → shadow-xl)
- Dark/light theme compatible via CSS variables

**Files:**
- `src/components/ui/*.tsx`
- `src/components/layout/*.tsx`
- `src/components/*/index.ts`

---

### 1.12 Quality, Observability & Safeguards

#### Code Quality
- **TypeScript strict mode** — No `any` types in production code
- **ESLint 9** with `eslint-config-next` — Zero lint errors in CI
- **Component-based architecture** — Reusable, single-responsibility components
- **Consistent naming** — PascalCase components, camelCase utilities

#### Error Handling
- API routes return structured error responses with HTTP status codes
- Frontend catches API errors and shows user-friendly toast messages
- Fallback content generation when AI is unavailable
- Graceful degradation when profile data is incomplete

#### Performance
- In-memory response cache (15 min TTL) for AI generation
- Persistent database cache for cross-session deduplication
- Lazy loading for charts
- Code splitting per route (Next.js App Router default)

#### Security
- Environment variables for all secrets (`GROQ_API_KEY`, Supabase keys)
- No secrets exposed in client-side code
- RLS policies on all user data tables
- Input validation on all API endpoints
- Auth middleware protecting all dashboard routes

#### Monitoring
- Comprehensive console logging in AI generation flow
- Error logging with context (payload, attempt number, failure reason)
- Cache hit/miss tracking

---

## 2. Recommendations for Future Development

The following recommendations are organized by category and prioritized by a combination of user value, technical feasibility, and strategic alignment. Each item includes a **Priority** (P0 = critical, P1 = high, P2 = medium, P3 = nice-to-have) and **Rationale**.

---

### 2.1 Product & UX Enhancements

| # | Feature | Priority | Description | Rationale |
|---|---------|----------|-------------|-----------|
| 1.1 | **True Post Scheduling** | P0 | Replace the placeholder schedule button with actual cron-based publishing. Store scheduled posts and execute them via a background job (Vercel Cron, Inngest, or similar). | The current "Schedule" button only shows a toast. Real scheduling is core to the product promise. |
| 1.2 | **Email Campaign Manager** | P1 | Build a dedicated email composer with template selection, preview, and scheduling. Extend the existing email copy generation from the AI API. | Email is already generated but not actionable. A campaign manager would unlock a major marketing channel. |
| 1.3 | **Content Library / Templates** | P1 | Allow users to save, favorite, and reuse past captions and emails. Add a "Templates" page with search and categorization. | Users currently lose generated content after navigating away. A library increases retention and reduces AI costs. |
| 1.4 | **Team Collaboration** | P2 | Multi-user support with role-based access (Owner, Editor, Viewer). Share campaigns and analytics across team members. | Natural evolution for small businesses that grow into teams. |
| 1.5 | **Notification System** | P2 | In-app and email reminders for upcoming holidays (7 days, 3 days, 1 day before). Configurable per user. | The dashboard shows reminders but doesn't proactively notify. This would drive engagement. |
| 1.6 | **Mobile App (PWA)** | P2 | Convert the dashboard to a Progressive Web App with offline support, push notifications, and home-screen installation. | Small business owners are often mobile-first. A PWA is cheaper than React Native but delivers 80% of the value. |
| 1.7 | **Onboarding Flow** | P2 | Guided first-time setup wizard — connect profile, select platforms, pick first holiday, generate first post. | Reduces time-to-value and improves activation rates. |

---

### 2.2 Platform Integrations

| # | Feature | Priority | Description | Rationale |
|---|---------|----------|-------------|-----------|
| 2.1 | **Instagram Basic Display API** | P1 | OAuth connection to Instagram for direct post publishing (single image + caption). | The #1 requested platform. Direct posting eliminates copy-paste friction. |
| 2.2 | **Facebook Graph API** | P1 | Cross-post to Facebook Pages via the Graph API. Reuse Instagram content or create platform-specific variants. | High overlap with Instagram audience; Meta APIs are closely related. |
| 2.3 | **Google Calendar Sync** | P2 | Export holiday reminders and campaign schedules to Google Calendar. Two-way sync optional. | Helps users integrate marketing into their existing workflow. |
| 2.4 | **Twitter/X API** | P3 | Post to Twitter/X with thread support for longer campaigns. | Lower priority due to API costs and changing platform stability. |
| 2.5 | **LinkedIn API** | P3 | Professional audience targeting for B2B businesses. | Valuable for specific business types (consulting, SaaS, professional services). |
| 2.6 | **TikTok API** | P3 | Video-first content suggestions and posting. | Growing platform but requires video assets; higher complexity. |
| 2.7 | **Zapier / Make Integration** | P3 | Webhook-based integration to connect with 5000+ apps (Mailchimp, HubSpot, Slack, etc.). | Power-user feature that unlocks infinite workflows without custom development. |

---

### 2.3 AI & Content Enhancements

| # | Feature | Priority | Description | Rationale |
|---|---------|----------|-------------|-----------|
| 3.1 | **Image Generation / Suggestions** | P1 | Integrate DALL-E, Midjourney API, or Stable Diffusion to generate holiday-themed images matching the caption. Or suggest Unsplash/Pexels images. | Visual content is essential for social media; text-only posts underperform. |
| 3.2 | **A/B Testing for Captions** | P2 | Generate 2–3 caption variants per post, track performance, and auto-suggest the best-performing style for future holidays. | Data-driven optimization that improves engagement over time. |
| 3.3 | **Multi-Language Support** | P2 | Generate captions in Spanish, French, etc. based on business location or audience preference. | Expands addressable market and serves diverse communities. |
| 3.4 | **Tone Presets & Custom Tones** | P2 | Pre-built tone profiles ("Playful", "Professional", "Edgy", "Warm") plus custom tone training from user's past posts. | More personalization without requiring users to describe tone manually. |
| 3.5 | **Hashtag Performance Tracking** | P2 | Track which hashtags drive the most reach/engagement and auto-suggest high-performing ones. | Hashtags are currently static; dynamic optimization would improve results. |
| 3.6 | **Long-Form Content** | P3 | Blog post generation, newsletter copy, and landing page text for holiday campaigns. | Extends AI utility beyond social/email into full-funnel marketing. |
| 3.7 | **AI Model Fallback Chain** | P3 | If Groq fails or rate-limits, automatically fall back to OpenAI, Anthropic, or local models. | Increases reliability for paid users who depend on the service. |

---

### 2.4 Analytics & Insights

| # | Feature | Priority | Description | Rationale |
|---|---------|----------|-------------|-----------|
| 4.1 | **Real Engagement Data Ingestion** | P0 | Replace mock/demo engagement data with real data from connected social platforms (Instagram Insights, Facebook Analytics). | Current analytics use static/mock data. Real data is essential for product credibility. |
| 4.2 | **Predictive Analytics** | P1 | ML-powered predictions for optimal post timing, expected engagement, and audience growth based on historical data. | Differentiator from basic scheduling tools; leverages the "Smart" in the product name. |
| 4.3 | **Data Export** | P2 | CSV/PDF export of analytics dashboards and campaign reports for client presentations or internal reviews. | Frequently requested by business owners for reporting. |
| 4.4 | **Sentiment Analysis** | P2 | Analyze comments and mentions for sentiment (positive/negative/neutral) to gauge campaign reception. | Adds qualitative depth to quantitative metrics. |
| 4.5 | **Competitor Benchmarking** | P3 | Compare user's engagement rates against industry averages for their business type and holiday. | Contextualizes performance and sets realistic goals. |
| 4.6 | **Custom Date Range Filtering** | P3 | Allow users to filter analytics by custom date ranges, not just all-time. | Standard analytics expectation. |

---

### 2.5 Infrastructure & DevOps

| # | Feature | Priority | Description | Rationale |
|---|---------|----------|-------------|-----------|
| 5.1 | **Background Job Runner** | P0 | Implement a job queue (Inngest, BullMQ, or Vercel Cron) for scheduled post publishing, reminder emails, and cache cleanup. | Required for true scheduling and notifications. |
| 5.2 | **Rate Limiting & Quotas** | P1 | Per-user rate limits on AI generation to prevent abuse and control costs. Tiered limits for free vs. paid plans. | Essential before any monetization or public launch. |
| 5.3 | **Error Tracking (Sentry)** | P1 | Integrate Sentry or similar for production error monitoring, alerting, and stack traces. | Current errors only log to console; production needs proactive monitoring. |
| 5.4 | **Feature Flags** | P2 | LaunchDarkly or Unleash integration to roll out features gradually and A/B test UI changes. | Enables safer deployments and experimentation. |
| 5.5 | **CDN & Image Optimization** | P2 | Configure Cloudflare or Vercel Edge Network for asset delivery. Optimize uploaded images with Next.js Image. | Improves global load times, especially for image-heavy social previews. |
| 5.6 | **Database Connection Pooling** | P2 | Add PgBouncer or Supabase connection pooling for serverless environments to prevent connection exhaustion. | Next.js serverless functions can exhaust Postgres connections under load. |

---

### 2.6 Quality Assurance & Testing

| # | Feature | Priority | Description | Rationale |
|---|---------|----------|-------------|-----------|
| 6.1 | **Automated API Tests** | P0 | Jest/Vitest test suite for `/api/generate-content` covering: happy path, regeneration uniqueness, malformed response handling, fallback activation, and validation errors. | The caption API is the most complex and critical path; it needs automated regression protection. |
| 6.2 | **E2E Tests (Playwright)** | P1 | End-to-end tests for core user flows: signup → profile creation → holiday selection → caption generation → scheduling. | Catches integration issues between frontend and backend. |
| 6.3 | **Caption Uniqueness Evaluation Dataset** | P1 | A dataset of 50+ regeneration scenarios across niches and tones to benchmark duplicate rate. Run before each release. | Quantifies the quality of the anti-duplication system. |
| 6.4 | **Load Testing** | P2 | k6 or Artillery scripts to simulate concurrent users generating captions and browsing holidays. | Validates performance under realistic traffic. |
| 6.5 | **Visual Regression Testing** | P2 | Chromatic or Percy to catch unintended UI changes in components. | shadcn/ui upgrades and Tailwind changes can subtly break layouts. |
| 6.6 | **Accessibility Audit** | P2 | Automated a11y testing with axe-core; manual keyboard navigation testing; screen reader validation. | Ensures the app is usable by everyone and reduces legal risk. |

---

## Appendix: Related Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview, quick start, environment variables |
| `CHANGELOG.md` | Real-time development log with bug fixes and feature additions |
| `docs/IMPLEMENTATION_SUMMARY.md` | Detailed build checklist and file inventory |
| `docs/dashboard-features-guide.md` | User-facing feature reference and quick tips |
| `docs/dashboard-architecture.md` | Technical architecture deep dive |
| `docs/dashboard-setup-guide.md` | Installation and deployment instructions |
| `docs/backend-integration.md` | Backend setup, API contracts, and database schema |
| `docs/NEXT_PHASE_DEVELOPMENT_GUIDE.md` | Caption regeneration design, QA checklist, and sprint priorities |
| `docs/authentication.md` | Auth setup and Supabase configuration |
| `docs/supabase-setup.md` | Supabase project configuration and migrations |
| `docs/design-system.md` | UI component usage and styling guidelines |
| `docs/project-structure.md` | Directory structure and file organization |
| `docs/LAUNCH_CHECKLIST.md` | Pre-launch readiness verification |

---

*This document should be updated after each major release or sprint to reflect new capabilities and shifting priorities.*

