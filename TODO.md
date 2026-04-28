# TODO: Campaign Intelligence & Holiday Insights Hub

## Plan: Replace Analytics Dashboard with Actionable Marketing Intelligence

### Step 1: Update Data Layer ✅
- [x] Edit `src/utils/data.ts` — Added joined data fetching for campaigns + analytics + holidays
- [x] Edit `src/lib/analytics.ts` — Added analytics helper functions for pattern analysis
- [x] Edit `src/context/BusinessContext.tsx` — Added campaigns to context state

### Step 2: Update API Layer ✅
- [x] Edit `src/app/api/analytics/route.ts` — Added joined analytics endpoint with campaign/holiday data

### Step 3: Create New Analytics Components ✅
- [x] Create `src/components/analytics/holiday-performance-scorecard.tsx`
- [x] Create `src/components/analytics/content-pattern-analyzer.tsx`
- [x] Create `src/components/analytics/opportunity-radar.tsx`
- [x] Create `src/components/analytics/campaign-timeline.tsx`
- [x] Create `src/components/analytics/smart-recommendations.tsx`
- [x] Create `src/components/analytics/insights-hub.tsx` — Main container

### Step 4: Replace Old Analytics ✅
- [x] Edit `src/components/analytics/analytics.tsx` — Replaced with `InsightsHub` delegate

### Step 5: Cleanup
- [ ] Remove temp scripts: write-files.js, generate-analytics-components.js, etc.
- [ ] Run `npx tsc --noEmit` to verify zero errors
- [ ] Test page loads in browser

## Summary of Changes

**New Feature: Campaign Intelligence & Holiday Insights Hub**

Replaced the generic social-media-style analytics dashboard with a **marketing command center** aligned to the product's core purpose: helping small businesses win at holiday marketing through AI-generated content.

### What's New
1. **Tabbed Interface** — 5 focused sections: Performance, Content Insights, Opportunities, Pipeline, Smart Tips
2. **Holiday Performance Scorecard** — Ranks holidays by engagement score for your business
3. **Content Pattern Analyzer** — Identifies which platforms, tones, and content styles drive results
4. **Opportunity Radar** — Quick-action cards for upcoming holidays with direct "Create Post" links
5. **Campaign Timeline** — Visual pipeline of draft → scheduled → published campaigns
6. **Smart Recommendations** — Actionable next steps based on data patterns

### Technical Changes
- Extended `BusinessContext` with `campaigns` and `campaignAnalytics`
- Added `fetchCampaigns()` and `fetchCampaignAnalytics()` in `src/utils/data.ts`
- Created analytics computation utilities in `src/lib/analytics.ts`
- All new components use existing design system (Tailwind + shadcn/ui + Lucide icons)

---

## Content Library / Templates Feature (Bonus)

### Database
- [x] Create `supabase/migrations/004_add_templates_table.sql`

### API
- [x] Create `src/app/api/templates/route.ts`

### Data Layer
- [x] Edit `src/utils/data.ts` — Add Template types and fetchTemplates function
- [x] Edit `src/lib/templates.ts` — Add template CRUD operations
- [x] Edit `src/lib/index.ts` — Export templates

### Components
- [x] Create `src/components/templates/template-card.tsx`
- [x] Create `src/components/templates/template-library.tsx`
- [x] Create `src/components/templates/index.ts`

### Pages
- [x] Create `src/app/(dashboard)/templates/page.tsx`

### Navigation
- [x] Edit `src/components/layout/app-sidebar.tsx` — Add Templates link

### Integration
- [x] Edit `src/components/campaigns/post-creator.tsx` — Add "Save to Library" button
- [x] Edit `src/context/BusinessContext.tsx` — Add templates to context

### Testing
- [x] Run TypeScript build check
- [x] Verify template creation from post creator
- [x] Verify template library page loads

