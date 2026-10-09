import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

/** Redirects to /login unless a stored admin session exists. Returns it (or null while checking/redirecting). */
export function useRequireAdmin(): StoredAuth | null {
  const router = useRouter();
  const [auth, setAuth] = useState<StoredAuth | null>(null);

  useEffect(() => {
    const stored = getAuth();
    if (!stored || stored.role !== 1) {
      router.replace("/login");
      return;
    }
    setAuth(stored);
  }, [router]);

  return auth;
}

/** fetch() wrapper that attaches the admin Bearer token; throws on non-2xx with the server's error message. */
export async function adminFetch(url: string, auth: StoredAuth, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${auth.token}`,
      ...init.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}
