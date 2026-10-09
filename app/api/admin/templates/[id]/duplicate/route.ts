import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  await connectDB();

  const original = await EmailTemplate.findById(id);
  if (!original) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const copy = await EmailTemplate.create({
    name: `${original.name} (Copy)`,
    subject: original.subject,
    previewText: original.previewText,
    htmlBody: original.htmlBody,
    plainTextBody: original.plainTextBody,
    updatedBy: original.updatedBy,
  });

  return NextResponse.json(copy, { status: 201 });
}
