# Research: AI Reliability and Curriculum Baseline

## Decision 1: Use route-aware policy execution as the backend AI control plane

- **Decision**: Introduce `openrouterPolicy` helpers and move retry/fallback
  orchestration into a single `executeOpenRouterPolicy` path that returns both
  response and structured execution metadata.
- **Rationale**: Centralized policy execution removes route divergence,
  simplifies testing, and enables consistent provenance payloads.
- **Alternatives considered**:
  - Keep per-route retry logic duplicated in each route file.
  - Keep current simple retry in `openrouter.ts` and do not expose metadata.

## Decision 2: Keep OpenRouter-first, add Lovable fallback for all Express learner routes

- **Decision**: Preserve OpenRouter as default provider, then fallback to
  Lovable when OpenRouter fails for `/api/ai-chat`, `/api/gcse-chat`,
  `/api/mark-answer` if `LOVABLE_API_KEY` is present.
- **Rationale**: Matches user requirement for continuity while minimizing
  architectural change.
- **Alternatives considered**:
  - Lovable-first routing.
  - Chat-only Lovable fallback.
  - No Lovable fallback in Express (status quo).

## Decision 3: Enforce content governance with metadata-first schema

- **Decision**: Add required metadata fields to content items:
  `board`, `spec_code`, `spec_version`, `source_url`, `last_reviewed_at`.
- **Rationale**: Enables objective validation, review freshness tracking, and
  board-specific trust signaling.
- **Alternatives considered**:
  - Free-form notes without structured metadata.
  - Global source metadata only (not item-level).

## Decision 4: Implement board-specific freshness windows

- **Decision**: OCR/AQA freshness threshold = 90 days; other supported boards =
  120 days.
- **Rationale**: Reflects current operational focus while allowing slightly
  longer lead time for newly onboarded board content.
- **Alternatives considered**:
  - Single 90-day window for all boards.
  - Single 180-day or 365-day window.

## Decision 5: Deliver specialist tools at MVP level in this feature

- **Decision**: Each specialist tool (logic gates, trace tables, flowcharts,
  pseudocode practice) must provide at least one independent learner practice
  flow with basic correctness feedback.
- **Rationale**: Keeps scope feasible while providing concrete learner value.
- **Alternatives considered**:
  - Full-featured toolset in one release.
  - Partial tool delivery (two tools only).
  - Interface stubs only.

## Decision 6: Use script-first validation and watch automation

- **Decision**: Add CI-usable scripts for metadata/rubric validation and a
  monthly curriculum watch job that records source-change events.
- **Rationale**: Fast to implement in current repo and compatible with existing
  `scripts/` model.
- **Alternatives considered**:
  - Manual review checklist only.
  - New persistent service for curriculum monitoring.

## Decision 7: Keep printable packs out of this feature scope

- **Decision**: Explicitly defer printable board-filtered revision packs to a
  follow-up feature.
- **Rationale**: Avoids diluting reliability and governance baseline goals.
- **Alternatives considered**:
  - Include printable packs in baseline.
  - Include printable packs for OCR/AQA only.
