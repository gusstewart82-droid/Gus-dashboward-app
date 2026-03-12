# Gus Command Centre

Live dashboard: https://gus-dashboward-app1.vercel.app

## Tech stack
- Static HTML/CSS with vanilla JS
- Supabase (project `npxnficupvqsieritzzg`) for agents/projects data
- Vercel for hosting

## Local development
1. Install the Supabase CLI and login (`supabase login`).
2. Pull dependencies (none beyond the CLI; Supabase JS is loaded from CDN).
3. Start a static server (e.g. `npx serve`) or open `index.html` directly.
4. To apply database changes locally, use `supabase migration new <name>` and `supabase db push`.

Environment variables are defined inline for now (public anon key). For secure write flows we’ll move to Edge Functions + service role tokens.
