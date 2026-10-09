import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import { enrollLeadInFlows, processDueEmails } from "@/lib/scheduler";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  if (!token) return NextResponse.redirect(`${baseUrl}/`);

  await connectDB();
  const lead = await Lead.findOne({ unsubscribeToken: token, status: LEAD_STATUS.PENDING_CONFIRMATION });
  if (lead) {
    lead.status = LEAD_STATUS.ACTIVE;
    await lead.save();
    await enrollLeadInFlows(lead._id.toString());
    await processDueEmails({ leadId: lead._id.toString() });
  }

  return NextResponse.redirect(`${baseUrl}/thank-you`);
}
