"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { saveAuth } from "@/lib/authClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      saveAuth({ token: data.token, role: data.role, name: data.name, email: data.email });
      router.push(data.role === 1 ? "/admin/dashboard" : "/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card card">
      <h1>Welcome back</h1>
      <p className="lead muted">Sign in to access your MYiDocUSA account.</p>

      {justRegistered && !error && (
        <div className="form-success">Account created successfully. Please sign in.</div>
      )}
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="auth-links">
        <Link href="/forgot-password">Forgot password?</Link>
      </div>
      <div className="auth-links auth-links--center">
        <span className="muted">Don&apos;t have an account?</span>
        <Link href="/register">Create one</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="auth-section">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
