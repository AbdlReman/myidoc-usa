import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import { requireAdmin } from "@/lib/auth";
import { enrollLeadInFlows } from "@/lib/scheduler";

type Params = { params: Promise<{ id: string }> };

// Backfills missing ScheduledEmail rows for existing active leads, so edits to a
// flow (new/changed steps) also apply to leads already mid-sequence, not just new ones.
export async function POST(_req: Request, { params }: Params) {
  const { error } = requireAdmin(_req);
  if (error) return error;

  await params; // flow id isn't needed directly — enrollLeadInFlows re-checks all active flows per lead.
  await connectDB();

  const activeLeads = await Lead.find({ status: LEAD_STATUS.ACTIVE }, "_id");
  for (const lead of activeLeads) {
    await enrollLeadInFlows(lead._id.toString());
  }

  return NextResponse.json({ ok: true, leadsProcessed: activeLeads.length });
}
