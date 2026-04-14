# Contracts: AI Reliability and Content Governance

## 1) `POST /api/ai-chat`

### Request (contract additions)

- `policy` (optional object)
  - `routeKey`
  - `selectionIntent`
  - `primaryModel`
  - `fallbackModelIds`
  - `maxAttempts`
  - `slowThresholdMs`
  - `retryOn`

### Response

- Success:
  - `content` (string)
  - `meta` (AiResponseMeta)
- Error:
  - `error` (string)
  - `meta` (AiResponseMeta when available)

## 2) `POST /api/gcse-chat` (stream)

### Stream events

- `event: meta` sent at connection and completion stages with `AiResponseMeta`
  plus `state`.
- Data events remain model-stream chunks.

### Failure behavior

- Non-2xx should include JSON error and `meta` when available.

## 3) `POST /api/mark-answer`

### Request (contract additions)

- Accept optional `policy` object with same structure as chat routes.

### Response

- Existing marking payload plus:
  - `meta` (AiResponseMeta) for provenance and fallback observability.

## 4) Content Metadata Contract (static data objects)

All learner-facing question/theory records must include:

- `board`
- `spec_code`
- `spec_version`
- `source_url`
- `last_reviewed_at`

Validation must fail if any required field is missing, invalid, or stale per
board freshness policy.

## 5) Validation Script Contracts

### `npm run content:check`

- Existing structural content checks.

### `npm run curriculum:validate` (new)

- Returns non-zero exit code on validation failure.
- Prints itemized errors grouped by `metadata`, `freshness`, `rubric`,
  `claim_consistency`.

### `npm run curriculum:watch` (new)

- Runs source change detection for OCR/AQA/Pearson/DfE/Ofqual pages.
- Emits machine-readable event output for CI/scheduled jobs.

## Compatibility Notes

- OpenRouter remains primary provider.
- Lovable fallback is only attempted when `LOVABLE_API_KEY` is configured.
- Fallback scope in this feature: `/api/ai-chat`, `/api/gcse-chat`,
  `/api/mark-answer`.
