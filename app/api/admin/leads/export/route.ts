import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();

  const status = new URL(req.url).searchParams.get("status");
  const filter = status && status !== "all" ? { status } : {};

  const leads = await Lead.find(filter).sort({ createdAt: -1 });

  const rows = leads.map((lead) => ({
    firstName: lead.firstName,
    email: lead.email,
    status: lead.status,
    audienceType: lead.audienceType,
    source: lead.source,
    tags: lead.tags.join("; "),
    createdAt: lead.createdAt.toISOString(),
    unsubscribedAt: lead.unsubscribedAt ? lead.unsubscribedAt.toISOString() : "",
  }));

  const csv = toCsv(rows, ["firstName", "email", "status", "audienceType", "source", "tags", "createdAt", "unsubscribedAt"]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
