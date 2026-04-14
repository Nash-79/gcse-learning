# Implementation Plan: AI Reliability and Curriculum Baseline

**Branch**: `001-ai-reliability-curriculum` | **Date**: 2026-04-14 | **Spec**: [spec.md](/c:/repos/gcse-pylearn/specs/001-ai-reliability-curriculum/spec.md)
**Input**: Feature specification from `/specs/001-ai-reliability-curriculum/spec.md`

## Summary

Deliver a learner-first baseline that merges route-aware AI fallback and
response provenance into the current Express + React stack, restores Lovable
fallback across all learner-facing Express AI routes, and introduces curriculum
governance primitives (metadata schema, validation gates, rubric checks, and
monthly source watch). In the same feature, define MVP specialist exam tools
for logic gates, trace tables, flowcharts, and pseudocode practice without
expanding into teacher workflow.

## Technical Context

**Language/Version**: TypeScript (frontend + Express backend), Python 3.13 runtime present for utility scripts  
**Primary Dependencies**: React 18, Vite 5, Express 5, Supabase JS 2, Vitest 3, tsx  
**Storage**: Browser localStorage for AI settings/progress; Supabase Postgres for app logs and model cache table  
**Testing**: Vitest (client + node tests), Testing Library; content validation script via `npm run content:check` + new governance checks  
**Target Platform**: Web app (desktop/mobile browsers) with Node.js backend API routes  
**Project Type**: Web application (frontend + backend in single repo)  
**Performance Goals**: AI fallback failover should complete without user retry loops; metadata validation runs in CI under 2 minutes  
**Constraints**: Learner-first scope only; teacher workflow excluded; Lovable fallback required for `/api/ai-chat`, `/api/gcse-chat`, `/api/mark-answer`; OCR/AQA freshness 90 days, other boards 120 days  
**Scale/Scope**: Existing corpus (~118 exam questions + theory topics) with forward-compatible board expansion and MVP specialist tools

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Learner outcome is explicit and materially improves GCSE Python or Computer
  Science learning.  
  **Pass**: Reliability, trustable content, and exam-practice tooling are learner-facing.
- Curriculum/content changes identify target exam board scope and validation
  sources.  
  **Pass**: OCR/AQA baseline with Edexcel/EDUQAS extension model and explicit source watch.
- Student-facing programming output remains GCSE-appropriate and exam-authentic.  
  **Pass**: Rubric checks and content governance enforce exam authenticity.
- AI changes preserve fallback behavior, failure handling, and provenance where
  relevant.  
  **Pass**: Route policy execution, Lovable fallback, and meta propagation are core deliverables.
- Scope excludes teacher workflow, pricing, school administration, and other
  non-learner features unless explicitly justified.  
  **Pass**: Explicitly out of scope in spec and plan.
- Public coverage or quantity claims are backed by repository state or a
  validated source of record.  
  **Pass**: Add claim-generation constraint and validation gate.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-reliability-curriculum/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- ai-reliability-and-content-contracts.md
`-- tasks.md
```

### Source Code (repository root)

```text
server/
|-- routes/
|   |-- aiChat.ts
|   |-- gcseChat.ts
|   |-- markAnswer.ts
|   |-- openrouter.ts
|   |-- openrouterModels.ts
|   |-- openrouterStore.ts
|   |-- openrouterPolicy.ts            # new
|   `-- openrouter.spec.ts             # new
`-- index.ts

src/
|-- components/
|   |-- chat/ChatMessage.tsx
|   |-- ai/AiHelper.tsx
|   |-- challenges/AiExamValidator.tsx
|   |-- challenges/CodingChallengePanel.tsx
|   `-- quiz/ExamQuestionBank.tsx
|-- lib/
|   |-- apiFetch.ts
|   |-- appLogger.ts
|   |-- useAiSettings.ts
|   `-- useOpenRouterModels.ts
|-- pages/
|   |-- AiTutor.tsx
|   |-- Settings.tsx
|   `-- TopicPage.tsx
`-- test/
    |-- openrouterPolicy.spec.ts       # new
    |-- aiSettings.spec.ts             # new
    `-- responseProvenance.spec.tsx    # new

scripts/
|-- contentCheck.ts
|-- curriculumValidate.ts              # new
`-- curriculumWatch.ts                 # new
```

**Structure Decision**: Use existing monorepo layout with targeted backend,
frontend, and scripts updates. Avoid introducing additional services.

## Phase 0: Research Outcomes

Research decisions captured in [research.md](/c:/repos/gcse-pylearn/specs/001-ai-reliability-curriculum/research.md):

1. Adopt route-aware OpenRouter policy execution abstraction with structured
   attempt metadata.
2. Implement Express-level Lovable fallback for all learner-facing AI routes,
   preserving existing OpenRouter-first behavior.
3. Introduce curriculum metadata schema with board-specific freshness windows.
4. Add rubric + curriculum watch automation as script-first tooling for CI and
   scheduled execution.
5. Deliver specialist exam tools at MVP level in this feature.

## Phase 1: Design Outputs

- Data model specification: [data-model.md](/c:/repos/gcse-pylearn/specs/001-ai-reliability-curriculum/data-model.md)
- API and interface contracts: [ai-reliability-and-content-contracts.md](/c:/repos/gcse-pylearn/specs/001-ai-reliability-curriculum/contracts/ai-reliability-and-content-contracts.md)
- Validation and runbook flow: [quickstart.md](/c:/repos/gcse-pylearn/specs/001-ai-reliability-curriculum/quickstart.md)

## Post-Design Constitution Re-Check

- Learner-first scope remains intact.  
  **Pass**: No teacher/admin workflow added.
- Content validation is explicit and enforceable.  
  **Pass**: Metadata model + validation scripts + freshness windows are designed.
- AI reliability and transparency are explicit and testable.  
  **Pass**: Contracts include fallback/provenance payloads and retry outcomes.
- Public claim discipline is enforceable.  
  **Pass**: Validation scripts include claim-to-data consistency checks.

## Complexity Tracking

No constitution violations require exception handling in this plan.
