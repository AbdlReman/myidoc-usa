import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export type AuthPayload = { userId: string; role: number };

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
