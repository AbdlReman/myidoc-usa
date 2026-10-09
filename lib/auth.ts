import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export type AuthPayload = { userId: string; role: number };

const ADMIN_ROLE = 1;

export function signToken(payload: AuthPayload) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in the environment");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): AuthPayload {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in the environment");
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

/** Pulls and verifies the Bearer token from a Request's Authorization header. */
export function getAuth(req: Request): AuthPayload | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    return verifyToken(header.slice(7));
  } catch {
    return null;
  }
}

/** Shared guard for /api/admin/* routes: returns { auth } or a ready-to-return { error } response. */
export function requireAdmin(req: Request): { auth: AuthPayload; error?: undefined } | { auth?: undefined; error: NextResponse } {
  const auth = getAuth(req);
  if (!auth) return { error: NextResponse.json({ error: "No authorization token provided" }, { status: 401 }) };
  if (auth.role !== ADMIN_ROLE) return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
  return { auth };
}
