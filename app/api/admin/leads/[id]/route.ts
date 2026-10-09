import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import ScheduledEmail from "@/models/ScheduledEmail";
import EmailTemplate from "@/models/EmailTemplate";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const scheduledEmails = await ScheduledEmail.find({ leadId: id }).sort({ scheduledFor: 1 });
  const templateIds = scheduledEmails.map((s) => s.templateId);
  const templates = await EmailTemplate.find({ _id: { $in: templateIds } }, "name subject");
  const templateMap = new Map(templates.map((t) => [t._id.toString(), t]));

  const emailHistory = scheduledEmails.map((s) => ({
    ...s.toObject(),
    template: templateMap.get(s.templateId.toString()) || null,
  }));

  return NextResponse.json({ lead, emailHistory });
}

export async function PUT(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  await connectDB();

  const lead = await Lead.findById(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const { firstName, audienceType, source, status, tags } = body;
  if (firstName !== undefined) lead.firstName = firstName;
  if (audienceType !== undefined) lead.audienceType = audienceType;
  if (source !== undefined) lead.source = source;
  if (tags !== undefined) lead.tags = tags;
  if (status !== undefined && status !== lead.status) {
    lead.status = status;
    lead.unsubscribedAt = status === "unsubscribed" ? new Date() : null;
  }

  await lead.save();
  return NextResponse.json(lead);
}

export async function DELETE(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  await ScheduledEmail.deleteMany({ leadId: id });
  return NextResponse.json({ message: "Lead deleted" });
}
