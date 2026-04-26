# Project Structure & Architecture

This document provides a systematic overview of the **Smart Holiday Marketing Reminder System** codebase, including directory paths, their intended purposes, and the overall architecture.

---

## 1. Project Overview

The Smart Holiday Marketing Reminder System is a Next.js 16 dashboard application designed for small businesses to plan and execute holiday marketing campaigns efficiently. It combines AI-powered content generation, holiday tracking, campaign analytics, and business profile management into a single cohesive platform.

### Key Features
- **Dashboard Overview**: Upcoming holidays, action-required alerts, and quick stats
- **Holiday Calendar**: Browse, search, and filter holidays by type (international, local, cultural, seasonal)
- **AI Content Generator**: Generate Instagram captions and email copy using Groq AI
- **Campaign Management**: Create, track, and regenerate marketing campaigns
- **Analytics Dashboard**: Engagement charts and campaign performance trends
- **Business Profile**: Customization for personalized AI generation context

---

## 2. Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16.2.3** | React framework with App Router |
| **React 19.2.4** | UI library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Supabase** | Authentication, PostgreSQL database, SSR helpers |
| **Groq SDK** | AI-powered content generation |
| **Recharts** | Data visualization and analytics charts |
| **Lucide React** | Icon library |
| **shadcn/ui** | UI component primitives |
| **date-fns** | Date manipulation and formatting |

---

## 3. Root Directory Structure

```
juswa/
├── docs/                          # Project documentation
├── public/                        # Static assets served by Next.js
├── src/                           # Application source code
├── supabase/                      # Database migrations
├── .env.local                     # Environment variables (not in repo)
├── .gitignore                     # Git ignore rules
├── AGENTS.md                      # AI agent guidelines
├── BACKEND_SETUP.md               # Backend configuration guide
├── CHANGELOG.md                   # Version history
├── README.md                      # Project overview and quick start
├── components.json                # shadcn/ui configuration
├── eslint.config.mjs              # ESLint configuration
├── next.config.ts                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── test-api.js                    # API testing script
├── tsconfig.json                  # TypeScript configuration
└── skills-lock.json               # Skills tracking
```

---

## 4. Source Code Organization (`src/`)

The `src/` directory contains all application code, organized by responsibility:

```
src/
├── app/                           # Next.js App Router pages and API routes
├── components/                    # React components organized by feature
├── context/                       # React Context providers
├── hooks/                         # Custom React hooks
├── lib/                           # Utility libraries and helpers
├── utils/                         # General utilities and Supabase clients
└── proxy.ts                       # Proxy configuration
```

---

## 5. App Router Structure (`src/app/`)

The application uses the Next.js App Router with a protected dashboard route group.

### 5.1 Root Layout & Global Styles

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout wrapping all pages |
| `src/app/globals.css` | Global CSS styles and Tailwind directives |
| `src/app/favicon.ico` | Site favicon |

### 5.2 Authentication Pages

| File | Purpose |
|------|---------|
| `src/app/login/page.tsx` | User login page |
| `src/app/signup/page.tsx` | User registration page |

### 5.3 Dashboard Route Group (`src/app/(dashboard)/`)

The `(dashboard)` route group encapsulates all protected dashboard pages. It uses a shared layout with sidebar navigation.

| File | Purpose |
|------|---------|
| `src/app/(dashboard)/layout.tsx` | Dashboard layout with sidebar and header |
| `src/app/(dashboard)/page.tsx` | Dashboard homepage |
| `src/app/(dashboard)/dashboard.tsx` | Main dashboard component (stats, alerts, upcoming holidays) |
| `src/app/(dashboard)/analytics.tsx` | Analytics component (charts, metrics) |
| `src/app/(dashboard)/analytics/page.tsx` | Analytics page wrapper |
| `src/app/(dashboard)/holiday-calendar.tsx` | Holiday calendar component |
| `src/app/(dashboard)/holidays/page.tsx` | Holidays page wrapper |
| `src/app/(dashboard)/business-profile.tsx` | Business profile form component |
| `src/app/(dashboard)/business/page.tsx` | Business profile page wrapper |
| `src/app/(dashboard)/create/[id]/page.tsx` | Dynamic content generation page for specific holidays |

### 5.4 API Routes (`src/app/api/`)

API routes handle server-side logic, AI integration, and data operations.

| File | Purpose |
|------|---------|
| `src/app/api/analytics/route.ts` | Analytics data endpoints |
| `src/app/api/campaigns/route.ts` | Campaign CRUD operations |
| `src/app/api/campaigns/[id]/route.ts` | Individual campaign operations |
| `src/app/api/generate-content/route.ts` | Groq AI content generation endpoint |
| `src/app/api/profile/route.ts` | Business profile data endpoints |
| `src/app/api/schedule/route.ts` | Campaign scheduling endpoints |

---

## 6. Components Architecture (`src/components/`)

Components are organized by feature domain for maintainability and discoverability.

### 6.1 Feature Components

| Directory | Purpose |
|-----------|---------|
| `src/components/analytics/` | Analytics dashboard components |
| `src/components/auth/` | Authentication forms (login, signup) |
| `src/components/campaigns/` | Campaign creation and management |
| `src/components/dashboard/` | Main dashboard view components |
| `src/components/holidays/` | Holiday calendar and list components |
| `src/components/layout/` | Layout components (sidebar, header) |
| `src/components/profile/` | Business profile components |

### 6.2 UI Primitives (`src/components/ui/`)

Reusable shadcn/ui-based components used across the application:

| Component | Purpose |
|-----------|---------|
| `alert.tsx` | Alert notifications |
| `badge.tsx` | Status badges |
| `button.tsx` | Button variants |
| `calendar.tsx` | Date picker calendar |
| `card.tsx` | Content cards |
| `checkbox.tsx` | Form checkboxes |
| `dialog.tsx` | Modal dialogs |
| `dropdown-menu.tsx` | Dropdown menus |
| `index.ts` | Component exports |
| `input.tsx` | Form inputs |
| `label.tsx` | Form labels |
| `select.tsx` | Select dropdowns |
| `separator.tsx` | Visual separators |
| `sheet.tsx` | Slide-out panels |
| `sidebar.tsx` | Sidebar navigation |
| `skeleton.tsx` | Loading skeletons |
| `textarea.tsx` | Text areas |
| `tooltip.tsx` | Tooltips |

---

## 7. State Management (`src/context/`)

| File | Purpose |
|------|---------|
| `src/context/BusinessContext.tsx` | Global context for profile, holidays, and engagement data |
| `src/context/index.ts` | Context exports |

The `BusinessContext` provides:
- `profile`: User's business information
- `holidays`: Available holidays data
- `engagementData`: Campaign performance metrics
- Setter functions for state updates

---

## 8. Custom Hooks (`src/hooks/`)

| File | Purpose |
|------|---------|
| `src/hooks/use-groq-caption-generator.ts` | Hook for AI caption generation with retry logic |
| `src/hooks/use-mobile.ts` | Hook for responsive/mobile detection |

---

## 9. Utilities & Libraries

### 9.1 Library Utilities (`src/lib/`)

| File | Purpose |
|------|---------|
| `src/lib/analytics.ts` | Analytics data processing helpers |
| `src/lib/campaigns.ts` | Campaign management utilities |
| `src/lib/profile.ts` | Profile data helpers |
| `src/lib/utils.ts` | General utility functions (cn helper, etc.) |
| `src/lib/index.ts` | Library exports |

### 9.2 General Utilities (`src/utils/`)

| File | Purpose |
|------|---------|
| `src/utils/data.ts` | Static data and constants |
| `src/utils/index.ts` | Utility exports |

### 9.3 Supabase Clients (`src/utils/supabase/`)

| File | Purpose |
|------|---------|
| `src/utils/supabase/client.ts` | Browser-side Supabase client |
| `src/utils/supabase/middleware.ts` | Next.js middleware for auth |
| `src/utils/supabase/server.ts` | Server-side Supabase client |

---

## 10. Database (`supabase/`)

Database schema and migrations managed through Supabase.

| File | Purpose |
|------|---------|
| `supabase/migrations/001_create_schema.sql` | Initial schema creation |
| `supabase/migrations/002_add_profile_fields.sql` | Profile table extensions |
| `supabase/migrations/003_add_generation_cache.sql` | Content generation caching |

---

## 11. Static Assets (`public/`)

| File | Purpose |
|------|---------|
| `public/globe.svg` | Static SVG asset |

---

## 12. Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (images, redirects, etc.) |
| `tailwind.config.ts` | Tailwind CSS theme and plugin configuration |
| `tsconfig.json` | TypeScript compiler options |
| `eslint.config.mjs` | ESLint rules and configuration |
| `postcss.config.mjs` | PostCSS plugins configuration |
| `components.json` | shadcn/ui component registry configuration |

---

## 13. Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
GROQ_CAPTION_RETRY_LIMIT=3  # Optional, defaults to 3
```

---

## 14. Key Patterns & Conventions

### 14.1 Route Groups
The `(dashboard)` route group is used to:
- Share a common layout across all dashboard pages
- Apply authentication middleware to protected routes
- Keep URLs clean (the group name is omitted from the URL)

### 14.2 Component Organization
- **Feature-based folders**: Components are grouped by domain (analytics, campaigns, holidays)
- **UI primitives**: Generic components live in `src/components/ui/`
- **Co-location**: Page-specific components are kept close to their pages

### 14.3 API Patterns
- RESTful endpoints under `src/app/api/`
- Server-side validation before processing
- Graceful error handling with fallback responses
- Environment variable validation at runtime

### 14.4 State Management Pattern
- React Context for global state (BusinessContext)
- Local state with `useState` for component-level state
- Server state managed through API routes and Supabase

### 14.5 Styling Conventions
- Tailwind CSS utility classes
- Consistent color scheme: Blue to Purple gradient primary colors
- Responsive design with mobile-first approach
- Lucide React icons for consistent iconography

---

## 15. Related Documentation

| Document | Description |
|----------|-------------|
| `README.md` | Project overview and quick start guide |
| `docs/dashboard-architecture.md` | Detailed dashboard system architecture |
| `docs/IMPLEMENTATION_SUMMARY.md` | Feature inventory and implementation status |
| `docs/dashboard-features-guide.md` | Feature reference and quick tips |
| `docs/dashboard-setup-guide.md` | Installation and deployment guide |
| `docs/DASHBOARD_README.md` | Main dashboard guide |
| `docs/authentication.md` | Authentication setup and flows |
| `docs/backend-integration.md` | Backend integration details |
| `docs/supabase-setup.md` | Supabase configuration guide |
| `docs/design-system.md` | Design system documentation |
| `docs/LAUNCH_CHECKLIST.md` | Launch-readiness checklist |
| `docs/NEXT_PHASE_DEVELOPMENT_GUIDE.md` | Roadmap and next priorities |

---

## 16. Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│                   (App Router + React 19)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   (dashboard)│  │   login/    │  │       api/          │ │
│  │   Route Group│  │   signup/   │  │   (API Routes)      │ │
│  │              │  │             │  │                     │ │
│  │ • Dashboard  │  │ • Auth Pages│  │ • generate-content  │ │
│  │ • Analytics  │  │             │  │ • campaigns         │ │
│  │ • Holidays   │  │             │  │ • analytics         │ │
│  │ • Business   │  │             │  │ • profile           │ │
│  │ • Create     │  │             │  │ • schedule          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Components  │  │   Context   │  │   Hooks & Utils     │ │
│  │             │  │             │  │                     │ │
│  │ • Feature   │  │ • Business  │  │ • use-groq-caption  │ │
│  │   folders   │  │   Context   │  │ • use-mobile        │ │
│  │ • UI        │  │             │  │ • Supabase clients  │ │
│  │   primitives│  │             │  │ • Data helpers      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     Supabase (Auth + DB)                    │
│              PostgreSQL + Auth + Row Level Security         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Groq AI API                            │
│              AI Content Generation (mixtral)                │
└─────────────────────────────────────────────────────────────┘
```

---

*This document should be updated when significant structural changes are made to the project.*
