import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import FlowStep from "@/models/FlowStep";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const template = await EmailTemplate.findById(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  return NextResponse.json(template);
}

export async function PUT(req: Request, { params }: Params) {
  const { error, auth } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  const { name, subject, previewText, htmlBody, plainTextBody } = await req.json();

  await connectDB();
  const template = await EmailTemplate.findById(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const admin = await User.findById(auth.userId, "name");

  if (name !== undefined) template.name = name;
  if (subject !== undefined) template.subject = subject;
  if (previewText !== undefined) template.previewText = previewText;
  if (htmlBody !== undefined) template.htmlBody = htmlBody;
  if (plainTextBody !== undefined) template.plainTextBody = plainTextBody;
  template.updatedBy = admin?.name || "Admin";

  await template.save();
  return NextResponse.json(template);
}

export async function DELETE(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const inUse = await FlowStep.countDocuments({ templateId: id });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "This template is used by a flow step. Remove it from the flow first." },
      { status: 400 }
    );
  }

  const template = await EmailTemplate.findByIdAndDelete(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  return NextResponse.json({ message: "Template deleted" });
}
