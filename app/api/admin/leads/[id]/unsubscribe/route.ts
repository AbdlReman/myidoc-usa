import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import ScheduledEmail, { SCHEDULED_EMAIL_STATUS } from "@/models/ScheduledEmail";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  lead.status = LEAD_STATUS.UNSUBSCRIBED;
  lead.unsubscribedAt = new Date();
  await lead.save();

  await ScheduledEmail.updateMany(
    { leadId: id, status: SCHEDULED_EMAIL_STATUS.PENDING },
    { $set: { status: SCHEDULED_EMAIL_STATUS.SKIPPED } }
  );

  return NextResponse.json(lead);
}
