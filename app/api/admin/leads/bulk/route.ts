import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import ScheduledEmail, { SCHEDULED_EMAIL_STATUS } from "@/models/ScheduledEmail";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { ids, action, tag } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No leads selected" }, { status: 400 });
  }

  await connectDB();

  if (action === "unsubscribe") {
    await Lead.updateMany(
      { _id: { $in: ids } },
      { $set: { status: LEAD_STATUS.UNSUBSCRIBED, unsubscribedAt: new Date() } }
    );
    await ScheduledEmail.updateMany(
      { leadId: { $in: ids }, status: SCHEDULED_EMAIL_STATUS.PENDING },
      { $set: { status: SCHEDULED_EMAIL_STATUS.SKIPPED } }
    );
  } else if (action === "delete") {
    await Lead.deleteMany({ _id: { $in: ids } });
    await ScheduledEmail.deleteMany({ leadId: { $in: ids } });
  } else if (action === "tag") {
    if (!tag) return NextResponse.json({ error: "Tag is required" }, { status: 400 });
    await Lead.updateMany({ _id: { $in: ids } }, { $addToSet: { tags: tag } });
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, count: ids.length });
}
