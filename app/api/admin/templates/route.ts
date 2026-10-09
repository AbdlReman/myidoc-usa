import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();
  const templates = await EmailTemplate.find().sort({ updatedAt: -1 });
  return NextResponse.json(templates);
}

export async function POST(req: Request) {
  const { error, auth } = requireAdmin(req);
  if (error) return error;

  const { name, subject, previewText, htmlBody, plainTextBody } = await req.json();
  if (!name || !subject) {
    return NextResponse.json({ error: "Name and subject are required" }, { status: 400 });
  }

  await connectDB();
  const admin = await User.findById(auth.userId, "name");

  const template = await EmailTemplate.create({
    name,
    subject,
    previewText: previewText || "",
    htmlBody: htmlBody || "",
    plainTextBody: plainTextBody || "",
    updatedBy: admin?.name || "Admin",
  });

  return NextResponse.json(template, { status: 201 });
}
