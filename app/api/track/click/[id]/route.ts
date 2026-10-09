import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ScheduledEmail from "@/models/ScheduledEmail";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const target = new URL(req.url).searchParams.get("u");
  const fallback = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  let destination = fallback;
  if (target && /^https?:\/\//i.test(target)) {
    destination = target;
  }

  await connectDB();
  await ScheduledEmail.updateOne({ _id: id }, { $inc: { clicks: 1 } }).catch((err) =>
    console.error("Click-tracking update failed:", err)
  );

  return NextResponse.redirect(destination);
}
