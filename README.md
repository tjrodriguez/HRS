# Smart Holiday Marketing Reminder System

This is a Next.js 16 App Router project for small businesses to plan holiday marketing faster. It integrates Supabase (auth + Postgres), Tailwind CSS, and Groq AI to generate campaign-ready captions and email copy.

## Key Features
- Dashboard with upcoming holidays, action-required alerts, and quick stats
- Holiday calendar with filtering (international, local, cultural, seasonal) and search
- AI post creator for business-specific caption and email generation
- Campaign creation flow with caption regeneration support
- Analytics dashboard with engagement charts and campaign performance trends
- Business profile customization for personalized generation context

## Caption Regeneration (Current Behavior)
- Caption generation and regeneration run through [src/app/api/generate-content/route.ts](src/app/api/generate-content/route.ts)
- Regeneration uses `previousCaptions` to prevent repeats
- Caption output is strictly validated as a JSON array for caption mode
- Invalid or duplicate/similar captions are retried (`GROQ_CAPTION_RETRY_LIMIT`, default `3`)
- Retry prompts become more variation-focused on each attempt
- Fallback captions are only used after retries fail and are selected from varied templates

## Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
# Optional: defaults to 3
GROQ_CAPTION_RETRY_LIMIT=3
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Authentication middleware protects dashboard routes, so you will be redirected to `/login` when not signed in.

## Documentation Index
- `docs/NEXT_PHASE_DEVELOPMENT_GUIDE.md` - consolidated implementation status, rollout plan, QA checklist, and next-sprint priorities
- `docs/backend-integration.md` - backend setup and integration details
- `docs/IMPLEMENTATION_SUMMARY.md` - implemented feature inventory
- `docs/LAUNCH_CHECKLIST.md` - launch-readiness checklist
