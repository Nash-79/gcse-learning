# Tasks: AI Reliability and Curriculum Baseline

**Feature**: `001-ai-reliability-curriculum`  
**Inputs**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/*`, `quickstart.md`

## Phase 1: Setup

- [x] T001 Add route-aware OpenRouter policy module and wire imports in server routes (`server/routes/openrouterPolicy.ts`, `server/routes/openrouter.ts`).
- [x] T002 Align Vitest config to include server route specs (`vitest.config.ts`).
- [x] T003 Add curriculum governance scripts and package scripts (`scripts/curriculumValidate.ts`, `scripts/curriculumWatch.ts`, `package.json`).
- [x] T004 Ensure ignore coverage for env and generated artifacts (`.gitignore`).

## Phase 2: Tests First (Reliability + Policy)

- [x] T005 Add server retry/policy behavior tests (`server/routes/openrouter.spec.ts`).
- [x] T006 Add client policy normalization tests (`src/test/openrouterPolicy.spec.ts`).
- [x] T007 Run test suite and fix regressions (`npm run test`).

## Phase 3: Core Reliability Implementation

- [x] T008 Implement Express OpenRouter fallback policy execution and response metadata propagation (`server/routes/openrouter.ts`).
- [x] T009 Add Express-side Lovable fallback after OpenRouter exhaustion with explicit final-model provenance (`server/routes/openrouter.ts`).
- [x] T010 Update learner-facing AI routes to consume policy execution utility (`server/routes/aiChat.ts`, `server/routes/gcseChat.ts`, `server/routes/markAnswer.ts`).
- [x] T011 Validate runtime behavior for scoped routes: `/api/ai-chat`, `/api/gcse-chat`, `/api/mark-answer`.

## Phase 4: Curriculum Governance Baseline

- [x] T012 Extend question/theory types for curriculum source metadata (`src/data/questionBank/types.ts`, `src/data/questionBank/theoryTypes.ts`).
- [x] T013 Implement metadata/freshness/rubric checks and exit-code gating (`scripts/curriculumValidate.ts`).
- [x] T014 Implement monthly source watch checks for OCR/AQA/Pearson/DfE/Ofqual (`scripts/curriculumWatch.ts`).
- [x] T015 Run governance checks and resolve failures (`npm run curriculum:validate`, `npm run curriculum:watch`).

## Phase 5: Polish and Delivery

- [x] T016 Finalize Speckit implementation status with completed checklists and updated task ticks.
- [x] T017 Produce Lovable frontend implementation prompt that applies best-of-both UI upgrades without teacher workflow scope.
