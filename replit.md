# PyLearn — GCSE Computer Science Revision App

## Overview
A full-stack GCSE Computer Science revision app for students studying OCR J277 and AQA 8525. Features AI-powered tutoring, coding challenges, exam question banks, spaced repetition, and exam history tracking.

## Architecture

### Frontend
- **Framework**: React + Vite (TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State**: React Query (@tanstack/react-query)
- **Port**: 5000 (Vite dev server)

### Backend (FastAPI Python Server)
- **Framework**: FastAPI (Python) via uvicorn
- **Port**: 8000 (dev) / PORT env var (production)
- **Entry point**: `server/main.py`
- **Routes**:
  - `POST /api/ai-chat` — General AI chat (topic explanations, challenge generation, exam questions)
  - `POST /api/gcse-chat` — Streaming AI tutor chat (SSE stream via `StreamingResponse`)
  - `POST /api/mark-answer` — AI-powered exam answer marking
  - `GET /api/health` — Health check
- **AI Provider**: OpenRouter (free tier models, default: meta-llama/llama-3.3-70b-instruct:free)
- **Rate limiting**: Exponential backoff (up to 4 retries, 2^attempt seconds wait) on HTTP 429
- **Headers**: `HTTP-Referer: https://pylearn-gcse.replit.app`, `X-Title: PyLearn GCSE CS`
- **User API key**: Reads `X-User-Api-Key` header first (from user's Settings page), falls back to `OPENROUTER_API_KEY` env var
- **Static files**: In production, serves `dist/public/` as static files with SPA fallback

### Auth & Database
- **Provider**: Supabase (kept from original Lovable project)
- Supabase handles user auth, exam history, spaced repetition data, admin roles

### Vite Proxy
Vite proxies `/api/*` requests to the FastAPI server at `localhost:8000`, so the frontend uses relative URLs like `/api/ai-chat`.

### API Client (`src/lib/apiFetch.ts`)
All frontend API calls use `apiFetch()` which automatically injects the `X-User-Api-Key` header from localStorage when the user has configured a personal OpenRouter key in Settings.

## Key Files
- `server/index.ts` — Express server entry point
- `server/routes/aiChat.ts` — AI chat route
- `server/routes/gcseChat.ts` — Streaming GCSE tutor route
- `server/routes/markAnswer.ts` — Exam marking route
- `src/integrations/supabase/client.ts` — Supabase client (auth + DB)
- `vite.config.ts` — Vite config with API proxy
- `package.json` — `npm run dev` runs both servers concurrently

## Running the App
```bash
npm run dev
```
This starts:
1. Express API server on port 3001 (`tsx server/index.ts`)
2. Vite dev server on port 5000 (`vite`)

## Environment Variables / Secrets Required
- `OPENROUTER_API_KEY` — OpenRouter API key (server-side only, never exposed to browser)
- `VITE_SUPABASE_URL` — Supabase project URL (optional, fallback hardcoded)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key (optional, fallback hardcoded)

## UI Modernization
- Collapsible left sidebar on desktop via SidebarTrigger (no more md:hidden)
- Mobile slide-in drawer (shadcn Sidebar handles via Sheet component)
- Collapsible topic category groups in sidebar with localStorage state persistence
- Route-aware breadcrumb bar in Header (Home > Category > Topic)
- Back button on TopicPage with browser history navigation (`navigate(-1)`)
- Active topic highlighted in sidebar via SidebarMenuButton isActive
- Signed-in user email shown in sidebar footer
- Keyboard shortcut: Ctrl/Cmd+B to toggle sidebar

## Key Layout Files
- `src/components/layout/AppSidebar.tsx` — Sidebar with collapsible categories
- `src/components/layout/Header.tsx` — Top bar with sidebar trigger and breadcrumbs
- `src/components/layout/PageBreadcrumb.tsx` — Route-aware breadcrumb component

## Deployment (Production)

The app uses **autoscale** deployment on Replit. The build process:

1. **`npm run build`** — Vite compiles the React frontend to `dist/`
2. **`node build-server.mjs`** — esbuild bundles the Express server to `dist/index.cjs`, then copies frontend assets to `dist/public/`

In production, the single Express server (port 5000):
- Serves static frontend files from `dist/public/`
- Handles all `/api/*` routes
- Returns `dist/public/index.html` for all other routes (SPA fallback)

`NODE_ENV=production` switches the server from dev mode (port 3001, API only) to prod mode (port 5000, full-stack).

## Migration Notes (Lovable → Replit)
- Replaced all `supabase.functions.invoke()` calls with `fetch("/api/...")` calls
- AI Edge Functions (ai-chat, gcse-chat, mark-answer) moved to Express routes
- `OPENROUTER_API_KEY` now secured server-side (was exposed client-side via Supabase secrets)
- Supabase kept for auth and database — no data migration needed
