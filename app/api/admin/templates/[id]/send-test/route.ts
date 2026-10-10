import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EmailTemplate from "@/models/EmailTemplate";
import { requireAdmin } from "@/lib/auth";
import { renderMergeTags } from "@/lib/mergeTags";
import { sendMail } from "@/lib/mailer";
import { site } from "@/lib/content";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const { id } = await params;
  const { to } = await req.json();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "A valid test email address is required" }, { status: 400 });
  }

  await connectDB();
  const template = await EmailTemplate.findById(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const mergeData = {
    first_name: "there",
    email: to,
    booking_link: site.bookingUrl,
    unsubscribe_link: `${baseUrl}/unsubscribe?token=test`,
    site_url: baseUrl,
  };

  const subject = `[TEST] ${renderMergeTags(template.subject, mergeData)}`;
  const html = renderMergeTags(template.htmlBody, mergeData);
  const text = template.plainTextBody ? renderMergeTags(template.plainTextBody, mergeData) : undefined;

  try {
    await sendMail({ to, subject, html, text });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send test email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
