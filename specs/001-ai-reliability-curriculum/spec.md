# Feature Specification: AI Reliability and Curriculum Baseline

**Feature Branch**: `001-ai-reliability-curriculum`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "Create baseline specification from project diff, preserve Lovable fallback behavior, merge best AI reliability features, and establish curriculum validation and learner-first benchmark improvements."

## Clarifications

### Session 2026-04-14

- Q: Which Express API routes must implement Lovable fallback in this feature? -> A: Implement Lovable fallback for all learner-facing Express AI routes: `/api/ai-chat`, `/api/gcse-chat`, and `/api/mark-answer`.
- Q: What maximum age should `last_reviewed_at` allow before content fails validation? -> A: Board-specific window (OCR/AQA 90 days, others 120 days).
- Q: Are printable revision packs part of this feature's committed scope? -> A: Out of scope now; explicitly defer printable packs to a follow-up feature.
- Q: What minimum specialist tool delivery level is required in this feature? -> A: MVP tools now; each of the four tools supports one independent learner practice flow with basic correctness feedback.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reliable AI Help Under Failure (Priority: P1)

As a GCSE learner using tutor chat, topic helper, and AI-marked activities, I
need AI responses to remain available even when the primary model path fails, so
my revision session is not blocked.

**Why this priority**: AI reliability is a direct blocker for core learner
value. If AI assistance fails, key study flows fail.

**Independent Test**: Trigger provider failure conditions and verify learner
flows still complete with fallback behavior and clear status messaging.

**Acceptance Scenarios**:

1. **Given** a learner sends a tutor request and the primary AI model is rate
   limited, **When** fallback models are available, **Then** the platform
   returns a completed answer using fallback without requiring learner retry
   loops.
2. **Given** a learner request requires retries, **When** fallback is used,
   **Then** the response includes learner-visible model provenance indicating
   final answering model and whether fallback occurred.
3. **Given** OpenRouter requests fail and Lovable fallback credentials are
   available, **When** the learner submits an AI request through `/api/ai-chat`,
   `/api/gcse-chat`, or `/api/mark-answer`, **Then** the system completes the
   request through Lovable fallback rather than returning a hard failure.

---

### User Story 2 - Trusted, Source-Validated GCSE Content (Priority: P2)

As a learner preparing for OCR/AQA and future board expansion, I need theory
and question content to be traceable to current specifications so I can trust
what I study.

**Why this priority**: Content trust is core product value and directly affects
 exam performance outcomes.

**Independent Test**: Run content validation checks and confirm all published
items include required curriculum metadata and freshness state.

**Acceptance Scenarios**:

1. **Given** a content item is created or updated, **When** it is saved,
   **Then** it includes board, specification identity, source URL, and review
   date metadata.
2. **Given** content metadata is missing or stale beyond policy limits,
   **When** validation is executed, **Then** the validation fails with explicit
   item-level errors.
3. **Given** curriculum source updates are detected, **When** watch checks run,
   **Then** the system raises a follow-up item for content review.

---

### User Story 3 - Learner-Focused Benchmark Parity Improvements (Priority: P3)

As a learner comparing study tools, I need stronger curriculum breadth and key
exam-practice interactions so I can stay in one platform for revision.

**Why this priority**: This raises product competitiveness for learner outcomes
without expanding into excluded teacher workflows.

**Independent Test**: Verify expanded coverage and targeted tools are usable in
standalone learner flows.

**Acceptance Scenarios**:

1. **Given** a learner filters by exam board, **When** board-specific content is
   selected, **Then** the learner sees board-appropriate coverage and references.
2. **Given** a learner practices exam techniques, **When** they open specialist
   tools, **Then** logic-gate, trace-table, flowchart, and pseudocode practice
   flows are available and independently usable.
3. **Given** a learner wants offline revision material, **When** this feature is
   delivered, **Then** printable board-filtered revision packs are explicitly
   deferred to a follow-up feature and do not block baseline release.

---

### Edge Cases

- What happens when all configured OpenRouter fallback models fail and Lovable
  fallback is unavailable?
- How does the platform behave when AI returns malformed metadata or no content
  after successful transport?
- What happens when content items have conflicting board/spec metadata values?
- How does the platform handle benchmark claims that exceed validated repository
  content state?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement route-aware AI fallback policies for
  learner-facing AI routes with deterministic model candidate ordering.
- **FR-002**: The system MUST return response metadata for AI requests including
  route key, attempts, selected models, final model, and fallback usage state.
- **FR-003**: The system MUST display final-model provenance in learner-facing
  AI interfaces when provenance display is enabled.
- **FR-004**: The system MUST provide configurable per-route fallback policy
  settings, including primary model, fallback models, attempts, and retry
  behavior.
- **FR-005**: The system MUST support Lovable fallback when OpenRouter fails for
  all learner-facing Express AI routes in scope: `/api/ai-chat`,
  `/api/gcse-chat`, and `/api/mark-answer`, when Lovable credentials are
  configured.
- **FR-006**: The system MUST persist and validate required curriculum metadata
  fields for theory and question content: board, spec code, spec version,
  source URL, and last reviewed date.
- **FR-007**: The system MUST fail content validation when required metadata is
  missing or review dates exceed board-specific freshness windows: OCR and AQA
  at 90 days, other supported boards at 120 days.
- **FR-008**: The system MUST provide board-specific rubric checks for command
  words, mark-point style, and prerequisite rules for supported exam boards.
- **FR-009**: The system MUST provide a scheduled curriculum watch process for
  OCR, AQA, Pearson, and relevant UK policy pages and record actionable update
  events.
- **FR-010**: The system MUST normalize content model structures to support OCR
  and AQA now, with extensible support for Edexcel and EDUQAS.
- **FR-011**: The system MUST provide learner-facing specialist exam-practice
  capabilities for logic gates, trace tables, flowcharts, and pseudocode
  practice at MVP level, where each tool supports at least one independent
  learner practice flow with basic correctness feedback.
- **FR-012**: The system MUST exclude teacher/classroom workflow capabilities
  from this feature scope.
- **FR-013**: The system MUST ensure public coverage claims are generated from
  validated content counts, not hard-coded marketing values.
- **FR-014**: The system MUST add automated tests covering fallback policy
  normalization, execution retry behavior, and response provenance rendering.
- **FR-015**: Printable board-filtered revision packs MUST be excluded from this
  feature scope and captured as follow-up backlog, without impacting baseline
  acceptance of this feature.

### Key Entities *(include if feature involves data)*

- **RouteFallbackPolicy**: Learner route-level AI configuration defining
  preferred model, fallback chain, retry behavior, and degradation thresholds.
- **AiResponseMeta**: Structured metadata returned with AI responses describing
  selected policy candidates, attempts, final model, fallback use, and elapsed
  timing.
- **CurriculumSourceRecord**: Metadata object linking a theory/question item to
  board, spec identity, source URL, and review date.
- **ContentValidationResult**: Validation output describing pass/fail state and
  item-level errors against metadata and rubric requirements.
- **CurriculumWatchEvent**: Recorded change detection event from monitored exam
  board or policy sources requiring content review.

## Curriculum and Validation Impact *(mandatory for learner content, question bank, theory, or AI teaching changes)*

- **Target learner outcome**: Reliable AI-assisted revision and trustable,
  up-to-date GCSE Computer Science content with exam-authentic practice.
- **Exam board scope**: OCR and AQA baseline; architecture extended for
  Edexcel and EDUQAS normalization.
- **Primary validation sources**: OCR J277 specification pages, AQA 8525
  specification documents, Pearson qualification updates, and UK DfE/Ofqual
  policy publications.
- **Content provenance plan**: Add required metadata fields to every
  learner-facing content item and enforce completeness through validation gates.
- **Validation method**: Automated metadata checks, rubric checks, scheduled
  curriculum watch, and periodic benchmark sampling against past-paper style
  material.

## AI and Reliability Considerations *(mandatory for AI-assisted features)*

- **Fallback expectation**: Route-specific policy retries across configured
  models and Lovable fallback where available before learner-facing failure.
- **User transparency**: Learner UI displays final answering model and fallback
  usage state when enabled.
- **Failure mode**: Graceful degraded errors with actionable status context
  instead of silent failure or ambiguous responses.
- **Verification plan**: Add server and client tests for policy ordering, retry
  outcomes, fallback usage, and provenance rendering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 99% of learner AI requests complete successfully under
  normal operating conditions across tutor/helper/validation flows.
- **SC-002**: At least 95% of induced primary-provider failure test cases still
  complete via configured fallback paths without manual learner intervention.
- **SC-003**: 100% of published theory and question items include required
  curriculum metadata fields and pass freshness validation checks under
  board-specific windows (OCR/AQA 90 days, others 120 days).
- **SC-004**: Curriculum watch detects and records source changes within one
  monthly run cycle with zero silent failures.
- **SC-005**: Learner-facing provenance indicators appear for at least 95% of AI
  responses that complete with metadata payloads.
- **SC-006**: Supported board filtering exposes only validated content mappings,
  with no cross-board mislabeling in acceptance testing.
- **SC-007**: Core specialist exam-practice tools (logic gates, trace tables,
  flowcharts, pseudocode practice) provide at least one independently
  completable learner practice flow each, with basic correctness feedback in
  usability checks.
- **SC-008**: Feature acceptance is achieved without printable pack delivery,
  and printable packs are recorded as a separately scoped follow-up feature.

## Assumptions

- The platform will remain learner-first and will not include teacher workflow
  features in this feature cycle.
- Existing OpenRouter and Supabase AI integrations are available as baseline
  integration points for fallback and metadata propagation.
- Source metadata can be attached directly to existing content structures
  without requiring immediate full backend migration.
- Monthly curriculum watch cadence is acceptable for baseline governance, with
  content freshness enforcement at 90 days for OCR/AQA and 120 days for other
  supported boards.
- Printable board-filtered revision packs are out of scope for this feature and
  are planned as a follow-up feature after reliability and validation baseline
  milestones.
