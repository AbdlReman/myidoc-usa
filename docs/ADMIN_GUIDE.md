# MyIDocUSA — Subscriber Email Automation: Admin Guide

This covers the day-to-day tasks a non-technical admin needs. Everything here is done from `/admin` — no code changes required.

## Signing in

Go to `/login` and sign in with an admin account. Admin accounts are managed under **Admin Users** in the sidebar (existing feature, unchanged).

## Editing a template

1. Go to **Templates** in the sidebar.
2. Click a template name to open it (or **New Template** to create one).
3. Edit the **Subject line**, **Preview text**, and the email body in the rich-text editor.
4. Use the **Insert** buttons above the editor to drop in merge tags like First name, Booking link, or Unsubscribe link — don't delete the unsubscribe link, it's required by law (CAN-SPAM) on every marketing email.
5. Check the **Live Preview** panel (Desktop/Mobile toggle) to see how it will render.
6. Use **Send Test** to email yourself a copy before trusting it to subscribers.
7. Click **Save Template**.

Changes apply to the *next* email sent from that template — emails already sent are not retroactively changed.

## Changing the flow (timing, order, on/off)

Go to **Flows** in the sidebar. You'll see the "Subscriber Welcome Series" with its steps (Welcome, Day 2, Day 5, Day 9 by default).

- **Change timing**: edit the number + unit (minutes/hours/days) next to a step. This is how long after the *previous trigger* that step fires.
- **Change which email a step sends**: use the template dropdown on that step.
- **Turn a single step on/off**: use the small toggle on the right of that step's row.
- **Reorder steps**: drag a step by its handle (the dots on the left) and drop it where you want.
- **Add a step**: click **Add Step** at the bottom, then configure it.
- **Remove a step**: click the trash icon on that step.
- **Pause the whole flow**: use the **Active/Paused** toggle at the top of the flow. While paused, no new emails go out from it, but leads keep their place.
- **Apply changes to leads already in progress**: click **Apply to Existing Leads**. New leads always get the current flow automatically; existing leads only get *newly added* steps added to their queue when you click this (it never re-sends something already sent).

## Managing leads

Go to **Leads**.

- **Search/filter**: by name/email, status, or sort order.
- **View a lead**: click their name to see their details and full email history (sent/opened/clicked per step).
- **Manually unsubscribe**: from the lead detail page, or select multiple leads on the list and use the bulk unsubscribe action.
- **Tag leads**: open a lead and add tags in the Details panel.
- **Export to CSV**: click **Export CSV** on the Leads page (respects the current status filter).

## Email Logs

Go to **Logs** to see every scheduled/sent/failed email. Failed emails show a **Retry** button — it resets the attempt counter and resends on the next check.

## Settings

Go to **Settings** to change:
- From name / From email / Reply-to
- Booking link (defaults to the Jane App link)
- Footer mailing address (required by CAN-SPAM, shown on every email)
- Double opt-in toggle (require subscribers to confirm their email before entering the welcome series)

**Note on From email**: sending goes through Gmail SMTP (`EMAIL_USER` in the server's environment variables). Gmail will override the "From" address unless the email you set here matches that account or is a verified alias of it — ask your developer if you want to change the sending account itself.

## Deliverability notes (for your developer/host)

To land in inboxes reliably at `myidocusa.com`, set these DNS records at your domain registrar:

- **SPF**: a `TXT` record at `myidocusa.com` authorizing Gmail to send on your behalf, e.g. `v=spf1 include:_spf.google.com ~all` (merge with any existing SPF record — a domain can only have one).
- **DKIM**: enable DKIM signing in Google Workspace admin (Apps → Google Workspace → Gmail → Authenticate email) and publish the generated `TXT` record it gives you.
- **DMARC**: a `TXT` record at `_dmarc.myidocusa.com`, e.g. `v=DMARC1; p=quarantine; rua=mailto:admin@myidocusa.com`.

## How opens/clicks are tracked

Gmail SMTP (used here via `nodemailer`) has no delivery/open/click webhooks the way a dedicated transactional provider (SendGrid, Postmark, SES) does. Instead, this system tracks opens via an invisible 1×1 image and tracks clicks by routing links through a short redirect — both counts show up in **Logs** and the lead detail page. This undercounts opens slightly (some mail clients block remote images by default), which is normal and expected with pixel-based tracking.

## Scheduled sending

Emails are sent by a scheduled job (`/api/cron/run`, triggered every 5 minutes by Vercel Cron — see `vercel.json`). The immediate "Welcome" step fires right when someone subscribes, without waiting for that job.
