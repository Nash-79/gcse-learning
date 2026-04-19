
User wants admins to receive an email when a new user signs up requesting approval, so they don't have to manually check the admin panel. The email should ideally include a quick link to approve.

## Approach

Send a transactional email to all admin users whenever a new user signs up. Email contains the new user's name/email, signup time, and a link directly to the admin panel (Settings → User Roles section) where they can approve.

**No domain required to start the conversation, but**: sending branded emails from the user's domain requires email domain setup. The user previously chose to skip email setup. So step 1 of the plan is the domain setup dialog — once that's done, the rest happens automatically.

## What gets built

**1. Email domain + infrastructure** (one-time setup via dialog)
- User completes the email domain setup dialog
- Backend automatically provisions the queue, tables, dispatcher

**2. Transactional email template**
- New `new-user-approval-request.tsx` template in `_shared/transactional-email-templates/`
- Branded with PyLearn dark theme accents (white body required)
- Shows: new user's display name + email, signup timestamp, "Review in Admin Panel" button linking to `/settings` (admin section)
- Registered in `registry.ts`

**3. Trigger: notify admins on signup**
- New edge function `notify-admins-new-signup` (or extend the `handle_new_user` trigger via a database webhook)
- **Cleanest approach**: Add a Postgres trigger on `profiles` insert that calls a tiny edge function via `pg_net`, OR — simpler — fire from the client right after `signUp()` succeeds in `useAuth.signUp()`
- Recommended: client-side invoke from `useAuth.signUp()` after successful signup. It:
  1. Queries `user_roles` for all `admin` users (RLS-safe via a SECURITY DEFINER RPC `get_admin_emails()`)
  2. Loops admin emails and invokes `send-transactional-email` once per admin with unique `idempotencyKey: signup-notify-${newUserId}-${adminId}`
  3. Passes `templateData: { newUserName, newUserEmail, signupAt, adminPanelUrl }`

**4. Database helper**
- New SECURITY DEFINER function `get_admin_emails()` returning `{ id, email }[]` for all users with `admin` role
  - Joins `user_roles` → `auth.users` (allowed inside SECURITY DEFINER)
  - Callable only by authenticated users (it's safe — only returns admin emails, used post-signup)

**5. Optional polish (skip for now unless requested)**
- One-click approve link in the email (would require a signed-token approve endpoint — adds complexity). Plan keeps this OUT; admins click the link → land on `/settings` → approve with one click in the existing UI.

## Files to create / edit

- **Email domain setup** (user dialog → backend auto-provisions infra)
- **Migration**: create `get_admin_emails()` SECURITY DEFINER function
- **Create** `supabase/functions/_shared/transactional-email-templates/new-user-approval-request.tsx`
- **Edit** `supabase/functions/_shared/transactional-email-templates/registry.ts` — register new template
- **Edit** `src/hooks/useAuth.tsx` — after successful `signUp`, fetch admin list and invoke `send-transactional-email` for each
- **Deploy** `send-transactional-email` (auto-handled by scaffold)

## Notes

- Sending fails silently won't break signup (wrapped in try/catch)
- Each admin gets one email per signup (unique idempotency key per admin/signup pair)
- Approve flow stays in the admin panel — email is a notification + deep link, not a one-click approver (safer; no token leakage risk)
- One-click approve from the email itself can be added later if you want it
