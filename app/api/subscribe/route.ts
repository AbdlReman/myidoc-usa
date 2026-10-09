import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import { getSettings } from "@/models/Settings";
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit";
import { enrollLeadInFlows, processDueEmails } from "@/lib/scheduler";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    firstName,
    email,
    website, // honeypot — real visitors never fill this in
    audienceType,
    source,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  } = body as Record<string, string>;

  // Bots that fill the honeypot get a fake success so they don't learn to avoid it.
  if (isHoneypotTripped(website)) {
    return NextResponse.json({ ok: true });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  await connectDB();

  const ip = getClientIp(req);
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  let lead = await Lead.findOne({ email: normalizedEmail });

  if (lead && lead.status !== LEAD_STATUS.UNSUBSCRIBED) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  if (lead && lead.status === LEAD_STATUS.UNSUBSCRIBED) {
    lead.status = LEAD_STATUS.ACTIVE;
    lead.unsubscribedAt = null;
    if (firstName) lead.firstName = firstName.trim();
    await lead.save();
  } else {
    const settings = await getSettings();
    lead = await Lead.create({
      firstName: (firstName || "").trim(),
      email: normalizedEmail,
      audienceType: audienceType || "",
      source: source || "",
      utmSource: utmSource || "",
      utmMedium: utmMedium || "",
      utmCampaign: utmCampaign || "",
      utmTerm: utmTerm || "",
      utmContent: utmContent || "",
      status: settings.doubleOptIn ? LEAD_STATUS.PENDING_CONFIRMATION : LEAD_STATUS.ACTIVE,
    });
  }

  if (lead.status === LEAD_STATUS.ACTIVE) {
    await enrollLeadInFlows(lead._id.toString());
    // Send the immediate (delay = 0) step right away instead of waiting for the next cron tick.
    await processDueEmails({ leadId: lead._id.toString() });
  } else if (lead.status === LEAD_STATUS.PENDING_CONFIRMATION) {
    const url = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
    const confirmUrl = `${url}/api/subscribe/confirm?token=${lead.unsubscribeToken}`;
    await sendMail({
      to: lead.email,
      subject: "Please confirm your subscription to MyIDocUSA",
      html: `<p>Hi ${lead.firstName || "there"},</p>
        <p>Please confirm you'd like to receive emails from MyIDocUSA by clicking the link below:</p>
        <p><a href="${confirmUrl}">Confirm my subscription</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>`,
      text: `Please confirm your subscription: ${confirmUrl}`,
    }).catch((err) => console.error("Failed to send confirmation email:", err));
  }

  return NextResponse.json({ ok: true, pendingConfirmation: lead.status === LEAD_STATUS.PENDING_CONFIRMATION });
}
