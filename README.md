# Nutri AI — AI-Powered Nutrition Tracker

Production-ready full-stack nutrition app built with **Next.js 15 (App Router)**, **React 18**,
**TypeScript**, **TailwindCSS**, **Supabase** (Auth + Postgres + Storage), and the **OpenAI API**
(GPT-4o-mini for text & vision).

## Features

- Supabase email/password authentication with session-refreshing middleware
- Onboarding flow that computes BMR, TDEE, lean-bulk calorie target, and protein/carb/fat/water
  targets (Mifflin-St Jeor equation)
- Natural-language meal logging — type "2 eggs and toast with peanut butter" and GPT extracts
  foods, quantities, calories and macros
- Food photo recognition via GPT-4o-mini vision — upload a photo, get an estimated nutrition
  breakdown, stored in Supabase Storage
- Daily dashboard: consumed/remaining calories, protein/carb/fat progress bars, water target
- Weight tracking with a line chart (Recharts), weekly trend (linear regression), and goal-date
  prediction
- AI-generated meal recommendations based on remaining macros for the day
- Dark mode (class-based, persisted to localStorage, respects system preference)
- Mobile-first responsive layout with bottom tab navigation

## Project structure

```
src/
  app/
    api/
      profile/route.ts          # GET/POST profile + macro calculation
      meals/route.ts            # GET/POST/DELETE text-based meal logs
      meals/image/route.ts      # POST image upload + vision analysis
      recommendations/route.ts  # POST AI meal suggestions
      weight/route.ts           # GET/POST weight logs
      auth/callback/route.ts    # Supabase auth code exchange
    login/page.tsx
    onboarding/page.tsx
    dashboard/page.tsx
    meals/page.tsx
    weight/page.tsx
    recommendations/page.tsx
    layout.tsx, globals.css, page.tsx (root redirect)
  components/
    Dashboard/  (CalorieSummary, MacroProgress)
    MealTracker/ (MealInput, ImageUpload)
    Weight/ (WeightChart)
    Layout/ (BottomNav)
    ui/ (ProgressBar)
    ThemeToggle.tsx
  hooks/
    useProfile.ts, useDailyLog.ts, useWeightHistory.ts
  lib/
    calculations.ts   # BMR/TDEE/macro/water/trend/prediction math
    openai.ts          # GPT text & vision meal parsing + recommendations
    supabase/{client,server,admin}.ts
  context/ThemeProvider.tsx
  middleware.ts
supabase/schema.sql   # full DB schema, RLS policies, storage bucket
```

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Create a Supabase project

1. Go to https://supabase.com → New Project.
2. In the SQL Editor, paste and run the contents of `supabase/schema.sql`. This creates:
   - `profiles`, `weight_logs`, `meal_logs`, `meal_recommendations` tables
   - Row Level Security policies (each user only sees their own data)
   - A public `food-images` storage bucket with owner-scoped RLS
   - A `daily_summary` view and an `updated_at` trigger
3. In Project Settings → API, copy your **Project URL**, **anon public key**, and
   **service_role key**.
4. In Authentication → Providers, ensure **Email** is enabled. (Disable "Confirm email" while
   testing locally if you want instant sign-in, or use the magic link flow as-is.)

### 3. Get an OpenAI API key

Create a key at https://platform.openai.com/api-keys. The app uses `gpt-4o-mini` for both text
parsing and vision (cheap + fast + supports images). You can swap the model string in
`src/lib/openai.ts` if you prefer `gpt-4o` for higher accuracy.

### 4. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
```

### 5. Run locally

```bash
npm run dev
```

Visit http://localhost:3000 → sign up → complete onboarding → start tracking.

### 6. Deploy

Deploy to Vercel (recommended):

```bash
vercel
```

Add the same four environment variables in the Vercel project settings. Add your deployed domain
to Supabase Auth → URL Configuration → Redirect URLs (e.g.
`https://yourapp.vercel.app/auth/callback`).

## Key implementation notes

- **BMR**: Mifflin-St Jeor equation (`src/lib/calculations.ts`).
- **TDEE**: BMR × activity multiplier (1.2 – 1.9).
- **Lean bulk calories**: TDEE × 1.12 (~12% surplus) for `goal = weight_gain`.
- **Protein target**: 2.0 g/kg bodyweight on a bulk, 2.2 g/kg on a cut, 1.8 g/kg maintenance.
- **Fat target**: 25% of total calories.
- **Carb target**: remaining calories after protein & fat, converted to grams.
- **Water target**: 35 ml/kg bodyweight (+500 ml if activity level is active/very active).
- **Weight trend**: simple linear regression (kg/week) over logged weigh-ins.
- **Goal prediction**: extrapolates the current weekly trend to the goal weight and returns an
  estimated date — only shown when the trend direction matches the goal direction.
- All AI parsing prompts request strict JSON output and the API routes defensively strip markdown
  fences before `JSON.parse`.
- Every table has Row Level Security scoped to `auth.uid()`, so users can only ever read/write
  their own rows — verify this remains true if you extend the schema.

## Extending this app

- Add push notifications/reminders for meal logging via a cron + Supabase Edge Function.
- Add a `streak` calculation (consecutive days hitting calorie target within X%).
- Add barcode scanning (e.g. Open Food Facts API) as another meal-logging input alongside text
  and photo.
- Add social auth providers (Google/Apple) in Supabase Auth — the existing `/auth/callback` route
  already handles the code exchange for any OAuth provider.
