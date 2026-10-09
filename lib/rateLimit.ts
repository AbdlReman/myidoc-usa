import SubscribeAttempt from "@/models/SubscribeAttempt";

const MAX_ATTEMPTS_PER_HOUR = 5;

/** Returns true if `ip` is still allowed to submit the subscribe form, and records this attempt. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const count = await SubscribeAttempt.countDocuments({ ip, createdAt: { $gte: oneHourAgo } });
  if (count >= MAX_ATTEMPTS_PER_HOUR) return false;
  await SubscribeAttempt.create({ ip });
  return true;
}

/** A filled honeypot field means a bot filled in a field real visitors never see. */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
