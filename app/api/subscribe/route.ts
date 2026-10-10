import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import { checkRateLimit, getClientIp, isHoneypotTripped } from "@/lib/rateLimit";
import { enrollLeadInFlows, processDueEmails } from "@/lib/scheduler";

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
      status: LEAD_STATUS.ACTIVE,
    });
  }

  await enrollLeadInFlows(lead._id.toString());
  // Send the immediate (delay = 0) step right away instead of waiting for the next cron tick.
  await processDueEmails({ leadId: lead._id.toString() });

  return NextResponse.json({ ok: true });
}
