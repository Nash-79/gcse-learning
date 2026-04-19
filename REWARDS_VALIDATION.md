# Rewards Validation

## What was implemented

- Added a reusable rewards system with XP, levels, streaks, badges, mastery tiers, and recent reward history.
- Integrated rewards into lesson completion, theory completion, first code run, coding challenge completion, quiz completion, quiz improvement, no-hint quiz passes, AI help questions, and playground challenge solving.
- Added student-facing rewards UI in the header, dashboard, topic pages, topic cards, and playground challenge list.
- Kept persistence in the existing local progress store with safe migration for legacy progress payloads.

## XP Rules

- `+5 XP` first meaningful code run in a topic
- `+10 XP` lesson complete
- `+15 XP` practice activity complete
- `+20 XP` quiz pass
- `+10 XP` beat previous best quiz score
- `+10 XP` quiz pass without hints
- `+8 XP` meaningful AI help/revision question
- `+12 XP` theory activity complete
- Streak bonuses: `+10 XP` at 3 days, `+15 XP` at 5 days, `+20 XP` at 7 days

## Mastery Rules

- Bronze: topic completed, lesson/theory/practice complete, or quiz pass at 60%+
- Silver: 80%+ best quiz score plus at least one meaningful completion signal
- Gold: 90%+ best quiz score, practice complete, and either a 90%+ no-hints score or theory complete

## Badge Rules

- `First Steps`: complete your first lesson, challenge, or passed topic
- `Curious Mind`: ask a meaningful AI question
- `Streak Starter`: reach a 3-day streak
- `Comeback Coder`: improve a quiz score by at least 30 percentage points
- `Gold Medallist`: reach Gold mastery in any topic

## Persistence

- Rewards data is stored inside the existing `pylearn-progress` localStorage record.
- Added safe normalization for old progress data with missing `rewards` fields.
- Reward events are deduped via `rewardEventLog` to prevent duplicate XP from rerenders or repeated one-time actions.

## Tests Added

- `src/test/rewards.logic.test.ts`
- `src/test/rewards.ui.test.tsx`

## Test Run Results

- `npm test`: passed (`8` files, `29` tests)
- `npm run build`: passed
- Build produced existing bundle-size and `"use client"` warnings from third-party packages, but no build failures

## Manual QA Checklist

- [ ] Complete a lesson and confirm XP toast appears
- [ ] Complete a stepped learning flow and confirm theory XP appears once
- [ ] Run code successfully in a topic and confirm first-run XP appears once
- [ ] Complete a coding challenge and confirm practice XP appears
- [ ] Pass a quiz and confirm quiz XP appears
- [ ] Improve a quiz score and confirm improvement XP/badge logic works
- [ ] Pass a quiz without hints and confirm bonus XP appears once
- [ ] Ask a meaningful AI question and confirm AI XP appears
- [ ] Solve a playground challenge and confirm solved state persists
- [ ] Refresh the page and confirm rewards persist
- [ ] Verify duplicate XP is not granted on repeated rerenders or same one-time events
- [ ] Verify legacy users with old progress payloads still see the dashboard without errors

## Known Limitations

- Rewards persistence currently uses local progress storage rather than a remote synced profile.
- Playground reward checks are based on deterministic output matching for the bundled starter challenges.
