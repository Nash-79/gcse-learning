# Backend Vercel Deployment (Monorepo)

Use this folder as a separate Vercel project root for the backend API.

## Vercel Project Settings

1. Create a new Vercel project from this same repository.
2. Set **Root Directory** to `server`.
3. Keep the default build settings (Vercel will use `server/vercel.json`).
4. Add backend environment variables (for example `OPENROUTER_API_KEY` if needed).
5. Deploy.

## Backend URL Check

After deploy, confirm:

- `https://<your-backend-project>.vercel.app/api/health`

Then set your frontend Vercel env var:

- `VITE_API_BASE_URL=https://<your-backend-project>.vercel.app`

