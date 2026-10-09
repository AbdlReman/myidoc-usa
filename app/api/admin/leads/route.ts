import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lead, { LEAD_STATUS } from "@/models/Lead";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  await connectDB();

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const status = url.searchParams.get("status");
  const audienceType = url.searchParams.get("audienceType");
  const source = url.searchParams.get("source");
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");
  const sort = url.searchParams.get("sort") || "createdAt:desc";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize")) || 20));

  const filter: Record<string, unknown> = {};
  if (q) {
    filter.$or = [
      { email: { $regex: q, $options: "i" } },
      { firstName: { $regex: q, $options: "i" } },
    ];
  }
  if (status && status !== "all") filter.status = status;
  if (audienceType) filter.audienceType = audienceType;
  if (source) filter.source = source;
  if (dateFrom || dateTo) {
    const range: Record<string, Date> = {};
    if (dateFrom) range.$gte = new Date(dateFrom);
    if (dateTo) range.$lte = new Date(dateTo);
    filter.createdAt = range;
  }

  const [field, dir] = sort.split(":");
  const sortSpec: Record<string, 1 | -1> = { [field || "createdAt"]: dir === "asc" ? 1 : -1 };

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Lead.countDocuments(filter),
  ]);

  return NextResponse.json({ leads, total, page, pageSize, statuses: Object.values(LEAD_STATUS) });
}

export async function POST(req: Request) {
  const { error } = requireAdmin(req);
  if (error) return error;

  const body = await req.json();
  const { firstName, email, audienceType, source, status, tags } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectDB();

  const existing = await Lead.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "A lead with this email already exists" }, { status: 400 });
  }

  const lead = await Lead.create({
    firstName: firstName || "",
    email: email.toLowerCase(),
    audienceType: audienceType || "",
    source: source || "Manually added",
    status: status || LEAD_STATUS.ACTIVE,
    tags: tags || [],
  });

  return NextResponse.json(lead, { status: 201 });
}
