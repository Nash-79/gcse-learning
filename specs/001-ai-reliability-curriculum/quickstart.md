# Quickstart: AI Reliability and Curriculum Baseline

## Prerequisites

- Node.js 20+ and npm
- Feature branch: `001-ai-reliability-curriculum`
- Environment variables for local testing:
  - `OPENROUTER_API_KEY` (required for primary path tests)
  - `LOVABLE_API_KEY` (required to test fallback behavior)

## 1) Install and run

```bash
npm install
npm run dev
```

## 2) Validate route-aware fallback behavior

1. Open settings and configure model + API key.
2. Trigger chat requests from:
   - AI Tutor (`/api/gcse-chat`)
   - Topic AI helper (`/api/ai-chat`)
   - Exam marking (`/api/mark-answer`)
3. Simulate primary-provider failure (rate limit or invalid key) and confirm:
   - request eventually completes when fallback is available
   - response metadata includes final model and fallback usage

## 3) Run tests

```bash
npm run test
```

Expected baseline includes:

- openrouter policy normalization tests
- openrouter execution retry/fallback tests
- response provenance rendering tests

## 4) Run content governance checks

```bash
npm run content:check
npm run curriculum:validate
```

Validation must fail when:

- required metadata fields are missing
- freshness window exceeded (OCR/AQA > 90 days, others > 120 days)
- rubric consistency checks fail

## 5) Run curriculum watch

```bash
npm run curriculum:watch
```

Expected result:

- source checks execute for OCR/AQA/Pearson/DfE/Ofqual
- change events are emitted for review workflow

## 6) Scope sanity checks

- Confirm no teacher/classroom workflow changes in this feature.
- Confirm printable revision packs remain out of scope and tracked separately.
