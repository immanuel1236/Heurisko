# Heurisko — Netlify deployment

This is the same app you tested as a Claude artifact, converted into a real
Vite + React project so it can run outside Claude. Two things changed
mechanically:

1. **Storage**: `window.storage` (Claude-only) → Supabase (`src/supabaseClient.js`, `src/App.jsx`'s `loadShared`/`saveShared`), plus a realtime subscription so changes show up live across open tabs, not just on refresh.
2. **Chatbot**: the AI version (free inside Claude, where the platform proxies the API call) → a **zero-cost, rule-based** chatbot (`CHAT_TOPICS` in `src/App.jsx`) for this deployment, since a real API call from your own key would cost real money on every message during testing. A ready-to-enable AI upgrade path is included but disabled — see the bottom of this file.

Nothing else in `src/App.jsx` changed — every feature, flow, and fix from testing carries over unchanged.

## Setup at a glance: what's free and what isn't

- **Netlify hosting** — free tier covers a small pilot easily.
- **Supabase** — free tier covers this easily too. One caveat: free Supabase projects pause after a week of no activity and need a manual "resume" click in the dashboard — not a cost, just a thing to know if the site looks broken after it's sat unused.
- **The chatbot, as shipped here** — genuinely $0. No API key required, no network call, no way to accidentally rack up a bill.

You do **not** need an Anthropic API key to deploy this as configured.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `supabase/schema.sql` — creates the `kv_store` table, sets RLS policies, enables realtime, and seeds the six keys the app expects.
3. From **Project Settings → API**, copy the **Project URL** and **anon public key**.

## 2. Local development

```bash
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env — that's all you need
npm install
npm run dev
```

## 3. Deploy to Netlify

**Via the Netlify dashboard (simplest):**
1. Push this project to a Git repo (GitHub/GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings are already set via `netlify.toml` — Netlify should detect them automatically.
4. Under **Site settings → Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Deploy.

**Via CLI:**
```bash
npm install -g netlify-cli
netlify init
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify deploy --prod
```

## What still isn't production-ready

This gets you a real, working, persistent, multi-tester pilot on a real URL — it does **not** by itself give you real authentication, real document verification, or real authorization. Those are exactly the gaps already documented in `HEURISKO_PRODUCTION_READINESS.md` and `HEURISKO_DISCOVERY_ARCHITECTURE.md`, and none of them are closed by this deployment step — this step only moves the *hosting*, not the security model. The `kv_store` RLS policy in `supabase/schema.sql` is intentionally wide open (anyone with the anon key can read/write everything) because the app itself has no real per-user authorization yet; tightening that without also building real auth would just break the app, not secure it.

## Turning the chatbot back into a real AI assistant

When you're past free testing and want the smarter, AI-powered version back:

1. Set `ANTHROPIC_API_KEY` in Netlify's environment variables (`netlify env:set ANTHROPIC_API_KEY "..."` or via the dashboard) — `netlify/functions/chat.js` already expects exactly this and needs no changes.
2. In `src/App.jsx`, swap `ChatbotWidget`'s `send()` function back to an async version that `fetch("/.netlify/functions/chat", ...)` instead of calling `matchChatTopic()` — the earlier AI version of this function (system prompt included) is worth keeping on hand if you want to paste it back in rather than rewrite it.
3. Every message will then cost real money against your Anthropic key — budget accordingly before flipping this on for a wider audience.

