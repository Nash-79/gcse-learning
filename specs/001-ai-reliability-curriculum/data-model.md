# Data Model: AI Reliability and Curriculum Baseline

## 1) RouteFallbackPolicy

Represents per-route AI retry and model selection behavior.

### Fields

- `routeKey` (string, required)
- `selectionIntent` (enum: `python_gcse`, `reasoning_first`, `fastest`, `balanced`)
- `primaryModel` (string, required)
- `fallbackModelIds` (string[], max 3, unique, excludes primary)
- `maxAttempts` (integer, min 1, max 4)
- `slowThresholdMs` (integer, min 1000)
- `retryOn` (enum[]: `rate_limit`, `timeout`, `provider_error`, `empty_response`)
- `enabled` (boolean, default true)
- `configuredByUser` (boolean)

### Validation Rules

- Candidate list = `primaryModel` + `fallbackModelIds` (deduplicated).
- `maxAttempts` cannot exceed available candidates.
- Policy defaults are route-dependent but deterministic.

## 2) AiResponseMeta

Describes final execution outcome returned with AI response payloads.

### Fields

- `routeKey` (string)
- `selectionIntent` (string)
- `policySource` (enum: `settings_saved`, `request_override`, `settings_generated`)
- `selectedPolicyModelIds` (string[])
- `attemptCount` (integer)
- `attempts` (AttemptMetadata[])
- `usedFallback` (boolean)
- `degraded` (boolean)
- `elapsedMs` (integer)
- `finalModelId` (string)
- `finalModelLabel` (string)
- `state` (optional enum for streaming: `connecting`, `retrying`, `completed`)

### AttemptMetadata (child entity)

- `attemptIndex` (integer)
- `modelId` (string)
- `elapsedMs` (integer)
- `outcome` (enum: `success`, `rate_limit`, `timeout`, `provider_error`, `empty_response`)
- `statusCode` (optional integer)

## 3) CurriculumSourceRecord

Required provenance metadata for every question/theory item.

### Fields

- `board` (enum: `ocr`, `aqa`, `edexcel`, `eduqas`)
- `spec_code` (string, required)
- `spec_version` (string, required)
- `source_url` (https URL, required)
- `last_reviewed_at` (date string, `YYYY-MM-DD`, required)

### Validation Rules

- OCR/AQA items fail freshness check when age > 90 days.
- Other boards fail freshness check when age > 120 days.
- Invalid URLs or malformed dates fail validation.

## 4) ContentValidationResult

Result set from validation scripts.

### Fields

- `valid` (boolean)
- `errors` (ValidationError[])
- `warnings` (ValidationWarning[])
- `checkedAt` (ISO datetime)
- `summary` (counts by type)

### ValidationError

- `itemId` (string)
- `scope` (enum: `metadata`, `freshness`, `rubric`, `claim_consistency`)
- `message` (string)

## 5) CurriculumWatchEvent

Change detection event from scheduled source checks.

### Fields

- `sourceName` (string)
- `sourceUrl` (string)
- `detectedAt` (ISO datetime)
- `changeFingerprint` (string/hash)
- `severity` (enum: `info`, `review_required`, `high`)
- `status` (enum: `new`, `acknowledged`, `resolved`)

## State Notes

- `AiResponseMeta` progresses through `connecting` -> `retrying` (optional) ->
  `completed` for stream routes.
- `CurriculumWatchEvent` lifecycle: `new` -> `acknowledged` -> `resolved`.
