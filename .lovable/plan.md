
The user wants an admin approval gate for new signups: when someone registers, they shouldn't be able to access the app until an admin approves them.

**Approach**: Add an `approval_status` field to profiles ('pending' | 'approved' | 'rejected'), block app access for non-approved users via a new `ApprovalGate` wrapper, and add an admin UI to approve/reject pending users. Existing users (including the admin) get auto-approved via migration.

## What gets built

**1. Database**
- Add `approval_status text default 'pending'` and `approved_at timestamptz` columns to `profiles`
- Add `approved_by uuid` to track which admin approved
- Backfill: set all existing profiles to `'approved'` (so current admin keeps access)
- Update `handle_new_user()` trigger to set new signups as `'pending'`
- New RLS policy: admins can update `approval_status` on any profile

**2. Auth flow changes**
- New hook `useApprovalStatus()` — fetches the current user's status from `profiles`
- New `PendingApproval.tsx` page — shown to logged-in but unapproved users (friendly "Your account is awaiting admin approval" screen with sign-out button)
- Update `ProtectedRoute.tsx` — if user is logged in but `approval_status !== 'approved'`, render `<PendingApproval />` instead of children
- `Auth.tsx` signup success message updated: "Account created — an admin will approve your access shortly"

**3. Admin UI**
- Extend `AdminUserRoles.tsx` (or add a sibling `AdminPendingApprovals.tsx` section above it) showing pending users with **Approve** / **Reject** buttons
- Display approval badge (Pending / Approved / Rejected) next to each user in the list
- Approving sets `approval_status='approved'`, `approved_at=now()`, `approved_by=auth.uid()`

**4. Optional notification**
- Skip email notification for now (keeps it free, no edge function needed). User gets approved → next login works.

## Technical notes

- Rejected users stay logged in but blocked — same `PendingApproval` screen with a "rejected" variant message
- The check is client-side gating; data is still protected by existing RLS (so even bypassing the gate gives no data access)
- Admin-on-admin: admins are auto-approved by the migration backfill, so no lockout risk
- No changes to Supabase Auth settings — email confirmation behavior stays as-is

## Files to create / edit

- **Migration**: add columns, backfill, update trigger, add RLS policy
- **Create** `src/hooks/useApprovalStatus.tsx`
- **Create** `src/pages/PendingApproval.tsx`
- **Edit** `src/components/auth/ProtectedRoute.tsx` — add approval check
- **Edit** `src/components/admin/AdminUserRoles.tsx` — add approval badges + approve/reject actions, surface pending users at the top
- **Edit** `src/pages/Auth.tsx` — update signup success toast copy

## Open question

Do you want **email verification** to remain required before approval shows up in the admin queue, or should pending users appear immediately on signup (even before they've confirmed email)?
