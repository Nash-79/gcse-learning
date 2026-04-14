<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. Curriculum Before Cleverness
  - Template Principle 2 -> II. Spec-Tagged and Source-Validated Content
  - Template Principle 3 -> III. GCSE-Appropriate Python and Exam Authenticity
  - Template Principle 4 -> IV. Resilient, Transparent AI Assistance
  - Template Principle 5 -> V. Learner-First Scope and Simplicity
- Added sections:
  - Platform Constraints
  - Delivery Workflow and Quality Gates
- Removed sections:
  - None
- Templates requiring updates:
  - Updated .specify/templates/plan-template.md
  - Updated .specify/templates/spec-template.md
  - Updated .specify/templates/tasks-template.md
  - Pending .specify/templates/commands/*.md (directory not present in this repo)
  - Updated README.md
- Follow-up TODOs:
  - Define a repeatable curriculum review cadence script and source registry in implementation docs.
-->
# PyLearn Constitution

## Core Principles

### I. Curriculum Before Cleverness
PyLearn MUST optimize for helping learners master Python programming for GCSE
Computer Science before adding adjacent product features. Work that materially
improves curriculum coverage, exam practice, revision quality, or learner
feedback takes priority over teacher workflow, pricing, school administration,
or marketing features. Any proposed feature MUST state which GCSE programming
or Computer Science learning outcome it improves and how that improvement will
be verified.

### II. Spec-Tagged and Source-Validated Content
All curriculum content, question banks, theory notes, model answers, and
generated practice materials MUST be traceable to exam-board specifications or
other primary curriculum sources. New or revised content MUST record the target
exam board, specification reference where applicable, and the source used for
validation. Content changes are incomplete unless they include a validation
method, such as manual source review, golden-question review, or automated
content checks. Unsupported coverage claims are prohibited.

### III. GCSE-Appropriate Python and Exam Authenticity
Student-facing Python examples, model answers, and AI-generated code MUST stay
within the level, syntax, and style expected of GCSE learners unless a feature
explicitly teaches beyond-spec extension material. Default examples MUST prefer
clear variables, simple control flow, readable comments where needed, and
exam-familiar constructs. The platform MUST favor exam-authentic responses over
clever or compressed code and MUST preserve explicit distinctions between
Python, pseudocode, and theory answers.

### IV. Resilient, Transparent AI Assistance
AI features MUST fail gracefully, disclose important execution context, and
never become the sole authority for correctness. OpenRouter-based flows MUST
retain a working fallback path when available, including Lovable fallback where
supported by the deployment path. User-visible AI outputs SHOULD expose the
answering model or fallback status when helpful, and backend changes to AI
routing MUST include tests for retry, fallback, and failure behavior. Human- or
source-validated curriculum content remains the canonical truth over model
output.

### V. Learner-First Scope and Simplicity
The product scope is a learner-facing GCSE Python and Computer Science study
platform. The project MUST avoid expanding into teacher operations, school
commercial features, or compliance messaging unless those directly unblock the
learner experience. When choosing between multiple implementations, the team
MUST prefer the simpler option that preserves content quality, AI resilience,
and maintainability. Benchmark competitors may inform priorities, but PyLearn
MUST only copy features that support the learner mission.

## Platform Constraints

PyLearn is governed by the following delivery constraints:

- Supported curriculum priority is GCSE Computer Science with Python
  programming, with OCR and AQA already represented in the codebase and future
  expansion to Edexcel or EDUQAS requiring explicit content validation.
- Competitive differentiation SHOULD focus on learner value: stronger AI help,
  reliable fallback behavior, exam-style practice, theory revision, code
  execution, and dedicated exam tools such as trace tables, logic gates,
  flowcharts, and pseudocode where justified.
- Content breadth MUST grow only with validation discipline. Quantity alone is
  not an acceptable success metric.
- Public claims about coverage, question counts, or exam-board support MUST
  match the repository state or a validated content source of record.

## Delivery Workflow and Quality Gates

Every feature plan, specification, and task list MUST satisfy these checks:

- Specifications MUST identify target learner outcome, target exam board or
  board scope, content/source impact, and any AI reliability implications.
- Plans MUST reject work that does not improve learner-facing curriculum value
  or core platform reliability.
- Tasks for curriculum or question changes MUST include explicit validation
  work, not just authoring work.
- Tasks for AI routing or model-selection changes MUST include retry/fallback
  verification and user-visible provenance behavior where relevant.
- Tasks for learner-facing programming content MUST verify GCSE-appropriate
  Python and exam authenticity.
- Release-ready work MUST leave no unresolved placeholder governance items and
  no contradictory curriculum claims.

## Governance

This constitution supersedes ad hoc project preferences for this repository.
All specifications, plans, tasks, and reviews MUST check compliance against
these principles.

Amendment rules:

- MAJOR version: remove a principle, redefine project scope, or change a
  non-negotiable rule in a backward-incompatible way.
- MINOR version: add a principle, add a new mandatory governance section, or
  materially expand project obligations.
- PATCH version: clarify wording without changing required behavior.

Compliance review expectations:

- Every substantial feature proposal MUST include a constitution check.
- Every curriculum/content change MUST document validation evidence.
- Every AI infrastructure change MUST document failure behavior and fallback
  expectations.
- If a change violates the constitution, the plan MUST record the violation,
  explain why it is necessary, and state why a compliant alternative was
  rejected.

The runtime guidance entry point for contributors is `README.md`, and Spec Kit
templates MUST remain aligned with this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
