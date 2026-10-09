import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import ScheduledEmail, { SCHEDULED_EMAIL_STATUS } from "@/models/ScheduledEmail";

async function unsubscribeByToken(token: string | null) {
  if (!token) return { ok: false };
  await connectDB();
  const lead = await Lead.findOne({ unsubscribeToken: token });
  if (!lead) return { ok: false };

  if (lead.status !== LEAD_STATUS.UNSUBSCRIBED) {
    lead.status = LEAD_STATUS.UNSUBSCRIBED;
    lead.unsubscribedAt = new Date();
    await lead.save();
  }

  // Cancel any pending emails still in the queue for this lead.
  await ScheduledEmail.updateMany(
    { leadId: lead._id, status: SCHEDULED_EMAIL_STATUS.PENDING },
    { $set: { status: SCHEDULED_EMAIL_STATUS.SKIPPED } }
  );

  return { ok: true, email: lead.email };
}

// Human clicking the unsubscribe link in their mail client.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const result = await unsubscribeByToken(token);
  return NextResponse.json(result);
}

// RFC 8058 one-click unsubscribe (Gmail/Outlook "Unsubscribe" button posts here with no body).
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const result = await unsubscribeByToken(token);
  return NextResponse.json(result);
}
