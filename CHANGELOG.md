# Development Changelog

This document tracks real-time changes, feature additions, and setups for the "Smart Holiday Marketing Reminder System".

## [Unreleased] - 2026-04-10

### Added
- **Debugging Skill**: Added `.github/skills/debugging/SKILL.md` to help Copilot and developers troubleshoot Next.js hydration issues, Supabase RLS policies, and Client vs. Server side errors natively.
- **Dashboard Shell UI**: Created `AppSidebar` and `Header` using `shadcn/ui` Sidebar and Dropdown components. Set up a `(dashboard)` route group with a global persistent layout.
- **Campaigns & Holidays UI**: Built out `holidays/page.tsx` (tracking upcoming retail events with a calendar widget) and `campaigns/page.tsx` (managing generated campaign content).
- **AI Generator Modal**: Added `CampaignGeneratorModal` with form inputs (Holiday Name, Promotion Details, Brand Voice) using the `shadcn/ui` `Dialog` component, preparing the UI for the Groq API integration.
- **Next.js Foundation**: Initialized Next.js 16 app with TypeScript, Tailwind CSS, and the App Router.
- **Supabase Integration**: Installed `@supabase/supabase-js` and `@supabase/ssr`.
  - Added `src/utils/supabase/client.ts` for Client Components.
  - Added `src/utils/supabase/server.ts` for Server Components/Actions.
  - Added `src/utils/supabase/middleware.ts` for session refreshing and route protection.
- **Proxy Middleware**: Configured `src/proxy.ts` (the Next.js 16 replacement for `middleware.ts`) to handle authenticated sessions and protected routes.
- **Authentication Flow**: 
  - Created Login page (`src/app/login/page.tsx`) with Server Actions for Sign Up and Sign In.
  - Updated Home page (`src/app/page.tsx`) to show user details and handle Sign Out.
- **Documentation**: 
  - Updated `README.md`.
  - Added `docs/supabase-setup.md` and `docs/authentication.md`.
- **Agent Guidelines**: 
  - Created specialized Copilot Agent Skills in `.github/skills/` (`front-end`, `back-end`, `ui-ux`, `architecture`, `debugging`).
  - Stored base rules and tech stack context in `.github/copilot-instructions.md` (Master Prompt Template) to ensure consistent AI generation.
- **UI Components**:
  - Initialized `shadcn/ui` with the default Tailwind CSS v4 styling.
  - Installed all available shadcn components natively into `src/components/ui`.
  - Wrapped `src/app/layout.tsx` with `<TooltipProvider>` to activate tooltip tooltips globally.

### Changed
- **Auth Page Polish**: Revamped `login/page.tsx` UX by swapping raw HTML for polished `shadcn/ui` components (`Card`, `Input`, `Label`, `Alert`), replacing generic errors with actual Supabase error messages.
- **Home to Dashboard**: Converted `src/app/page.tsx` into a high-level dashboard summary overview (`src/app/(dashboard)/page.tsx`) utilizing metric `Card` elements.

### Fixed
- Fixed shadcn/ui nested `<Button>` components suppressing server actions in `login/page.tsx` by using standard `<button>` tags with `buttonVariants`.
- Resolved TypeScript typing errors with the new shadcn `@base-ui` `render` prop (substituting deprecated `asChild` primitives inside headers, sidebars, and modals).
- Fixed Next.js 16 warning relating to `middleware` file conventions by replacing `src/middleware.ts` with `src/proxy.ts`.
