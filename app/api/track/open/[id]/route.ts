import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ScheduledEmail from "@/models/ScheduledEmail";

// 1x1 transparent GIF, served regardless of whether the update below succeeds.
const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7", "base64");

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  connectDB()
    .then(() =>
      ScheduledEmail.updateOne(
        { _id: id },
        { $inc: { opens: 1 }, $set: { openedAt: new Date() } }
      )
    )
    .catch((err) => console.error("Open-tracking update failed:", err));

  return new NextResponse(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
