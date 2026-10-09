import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { retryScheduledEmail, processDueEmails } from "@/lib/scheduler";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  const scheduled = await retryScheduledEmail(id);
  if (!scheduled) return NextResponse.json({ error: "Scheduled email not found" }, { status: 404 });

  // Attempt the resend immediately rather than waiting for the next cron tick.
  await processDueEmails({ leadId: scheduled.leadId.toString() });

  return NextResponse.json({ ok: true });
}
