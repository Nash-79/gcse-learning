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

### Backend (Express API Server)
- **Framework**: Express.js (TypeScript via tsx)
- **Port**: 3001
- **Routes**:
  - `POST /api/ai-chat` — General AI chat (topic explanations, challenge generation, exam questions)
  - `POST /api/gcse-chat` — Streaming AI tutor chat (SSE stream)
  - `POST /api/mark-answer` — AI-powered exam answer marking
- **AI Provider**: OpenRouter (free tier models, default: meta-llama/llama-3.3-70b-instruct:free)

### Auth & Database
- **Provider**: Supabase (kept from original Lovable project)
- Supabase handles user auth, exam history, spaced repetition data, admin roles

### Vite Proxy
Vite proxies `/api/*` requests to the Express server at `localhost:3001`, so the frontend uses relative URLs like `/api/ai-chat`.

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

## Migration Notes (Lovable → Replit)
- Replaced all `supabase.functions.invoke()` calls with `fetch("/api/...")` calls
- AI Edge Functions (ai-chat, gcse-chat, mark-answer) moved to Express routes
- `OPENROUTER_API_KEY` now secured server-side (was exposed client-side via Supabase secrets)
- Supabase kept for auth and database — no data migration needed
