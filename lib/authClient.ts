export type StoredAuth = { token: string; role: number; name: string; email: string };

const KEY = "myidocusa_auth";

export function saveAuth(auth: StoredAuth) {
  localStorage.setItem(KEY, JSON.stringify(auth));
}

export function getAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export const ROLE_LABELS: Record<number, string> = { 1: "Admin", 2: "Doctor", 3: "Patient" };
