import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ScheduledEmail from "@/models/ScheduledEmail";
import Lead from "@/models/Lead";
import EmailTemplate from "@/models/EmailTemplate";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const leadId = url.searchParams.get("leadId");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize")) || 25));

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;
  if (leadId) filter.leadId = leadId;

  const [logs, total] = await Promise.all([
    ScheduledEmail.find(filter)
      .sort({ scheduledFor: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    ScheduledEmail.countDocuments(filter),
  ]);

  const leadIds = logs.map((l) => l.leadId);
  const templateIds = logs.map((l) => l.templateId);
  const [leads, templates] = await Promise.all([
    Lead.find({ _id: { $in: leadIds } }, "email firstName"),
    EmailTemplate.find({ _id: { $in: templateIds } }, "name subject"),
  ]);
  const leadMap = new Map(leads.map((l) => [l._id.toString(), l]));
  const templateMap = new Map(templates.map((t) => [t._id.toString(), t]));

  const enriched = logs.map((l) => ({
    ...l.toObject(),
    lead: leadMap.get(l.leadId.toString()) || null,
    template: templateMap.get(l.templateId.toString()) || null,
  }));

  return NextResponse.json({ logs: enriched, total, page, pageSize });
}
