import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import EmailFlow from "@/models/EmailFlow";
import FlowStep, { delayToMs, type DelayUnit } from "@/models/FlowStep";
import EmailTemplate from "@/models/EmailTemplate";
import ScheduledEmail, { SCHEDULED_EMAIL_STATUS } from "@/models/ScheduledEmail";
import { renderMergeTags } from "@/lib/mergeTags";
import { injectTracking } from "@/lib/track";
import { sendMail } from "@/lib/mailer";
import { site } from "@/lib/content";

const MAX_ATTEMPTS = 3;
const RETRY_BACKOFF_MINUTES = 15;
const FOOTER_ADDRESS = `MyIDocUSA, ${site.address.join(", ")}`;

function baseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Enrolls a lead into every active flow for `trigger`, creating one ScheduledEmail
 * per active step. Safe to call more than once for the same lead — the
 * (leadId, stepId) unique index on ScheduledEmail makes this idempotent.
 */
export async function enrollLeadInFlows(leadId: string, trigger = "on_subscribe") {
  await connectDB();
  const lead = await Lead.findById(leadId);
  if (!lead) return;

  const flows = await EmailFlow.find({ isActive: true, trigger });
  for (const flow of flows) {
    const steps = await FlowStep.find({ flowId: flow._id, isActive: true }).sort({ order: 1 });
    const now = Date.now();
    for (const step of steps) {
      const scheduledFor = new Date(now + delayToMs(step.delayValue, step.delayUnit as DelayUnit));
      try {
        await ScheduledEmail.create({
          leadId: lead._id,
          flowId: flow._id,
          stepId: step._id,
          templateId: step.templateId,
          scheduledFor,
          status: SCHEDULED_EMAIL_STATUS.PENDING,
        });
      } catch (err: unknown) {
        // Duplicate key (already enrolled in this step) — fine, skip.
        if (!(err instanceof Error) || !err.message.includes("E11000")) throw err;
      }
    }
  }
}

/** Builds the fully rendered, tracked HTML + merge-tag data for one scheduled email. */
async function renderScheduledEmail(scheduled: InstanceType<typeof ScheduledEmail>) {
  const [lead, template] = await Promise.all([
    Lead.findById(scheduled.leadId),
    EmailTemplate.findById(scheduled.templateId),
  ]);
  if (!lead || !template) return null;

  const url = baseUrl();
  const unsubscribeUrl = `${url}/unsubscribe?token=${lead.unsubscribeToken}`;
  const mergeData = {
    first_name: lead.firstName || "",
    email: lead.email,
    booking_link: site.bookingUrl,
    unsubscribe_link: unsubscribeUrl,
    site_url: url,
  };

  const subject = renderMergeTags(template.subject, mergeData);
  let html = renderMergeTags(template.htmlBody, mergeData);

  // Always append a compliance footer (physical address + unsubscribe), even if
  // an admin's template copy forgets one — CAN-SPAM requires both on every send.
  html += `
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e3e3e3;font-family:Arial,sans-serif;font-size:12px;color:#8a8a8a;text-align:center;">
      <p style="margin:0 0 6px;">${FOOTER_ADDRESS}</p>
      <p style="margin:0;">
        <a href="${unsubscribeUrl}" style="color:#8a8a8a;text-decoration:underline;">Unsubscribe</a>
        from these emails at any time.
      </p>
    </div>`;

  html = injectTracking(html, scheduled._id.toString(), url);

  const text = template.plainTextBody
    ? renderMergeTags(template.plainTextBody, mergeData)
    : html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return { lead, subject, html, text, unsubscribeUrl };
}

/**
 * Finds due, pending ScheduledEmails and sends them. Called by the cron endpoint
 * (no leadId) and immediately after a new subscribe (leadId = the new lead, so
 * the welcome email fires right away instead of waiting for the next cron tick).
 */
export async function processDueEmails(options: { limit?: number; leadId?: string } = {}) {
  await connectDB();
  const { limit = 50, leadId } = options;

  const query: Record<string, unknown> = {
    status: SCHEDULED_EMAIL_STATUS.PENDING,
    scheduledFor: { $lte: new Date() },
  };
  if (leadId) query.leadId = leadId;

  const due = await ScheduledEmail.find(query).sort({ scheduledFor: 1 }).limit(limit);

  const results = { sent: 0, skipped: 0, failed: 0, rescheduled: 0 };

  for (const scheduled of due) {
    const lead = await Lead.findById(scheduled.leadId);
    const flow = await EmailFlow.findById(scheduled.flowId);
    const step = await FlowStep.findById(scheduled.stepId);

    if (!lead || lead.status !== LEAD_STATUS.ACTIVE || !flow?.isActive || !step?.isActive) {
      scheduled.status = SCHEDULED_EMAIL_STATUS.SKIPPED;
      await scheduled.save();
      results.skipped++;
      continue;
    }

    try {
      const rendered = await renderScheduledEmail(scheduled);
      if (!rendered) {
        scheduled.status = SCHEDULED_EMAIL_STATUS.SKIPPED;
        scheduled.error = "Lead or template no longer exists";
        await scheduled.save();
        results.skipped++;
        continue;
      }

      const sendResult = await sendMail({
        to: rendered.lead.email,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        unsubscribeUrl: rendered.unsubscribeUrl,
      });

      scheduled.status = SCHEDULED_EMAIL_STATUS.SENT;
      scheduled.sentAt = new Date();
      scheduled.providerMessageId = sendResult.messageId;
      scheduled.error = "";
      await scheduled.save();
      results.sent++;
    } catch (err) {
      scheduled.attempts += 1;
      scheduled.error = err instanceof Error ? err.message : String(err);
      if (scheduled.attempts >= MAX_ATTEMPTS) {
        scheduled.status = SCHEDULED_EMAIL_STATUS.FAILED;
        results.failed++;
      } else {
        scheduled.scheduledFor = new Date(Date.now() + RETRY_BACKOFF_MINUTES * scheduled.attempts * 60 * 1000);
        results.rescheduled++;
      }
      await scheduled.save();
    }
  }

  return results;
}

/** Resets a failed ScheduledEmail so the next cron tick retries it immediately. */
export async function retryScheduledEmail(id: string) {
  await connectDB();
  const scheduled = await ScheduledEmail.findById(id);
  if (!scheduled) return null;
  scheduled.status = SCHEDULED_EMAIL_STATUS.PENDING;
  scheduled.attempts = 0;
  scheduled.error = "";
  scheduled.scheduledFor = new Date();
  await scheduled.save();
  return scheduled;
}
