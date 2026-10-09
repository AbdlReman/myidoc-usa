import { NextResponse } from "next/server";
import { processDueEmails } from "@/lib/scheduler";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = req.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;

  const queryParam = new URL(req.url).searchParams.get("secret");
  return queryParam === secret;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await processDueEmails();
  return NextResponse.json({ ok: true, ...results });
}
