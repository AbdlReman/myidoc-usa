"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main">
        <section className="auth-section">
          <div className="auth-card card">
            <h1>Create your account</h1>
            <p className="lead muted">Sign up to book and manage your MYiDocUSA consultations.</p>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <input
                  id="name"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
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
                  minLength={8}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="auth-links auth-links--center">
              <span className="muted">Already have an account?</span>
              <Link href="/login">Sign in</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
