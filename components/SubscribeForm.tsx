"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "done" | "already" | "pending" | "error";

type Props = {
  source?: string;
  formClassName?: string;
  statusClassName?: string;
  onSuccess?: () => void;
};

export default function SubscribeForm({
  source,
  formClassName = "subscribe-form",
  statusClassName = "subscribe-form__status",
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = (data.get("email") as string)?.trim() ?? "";
    const firstName = (data.get("firstName") as string)?.trim() ?? "";
    const website = (data.get("website") as string) ?? "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          website,
          source: source || window.location.pathname,
          utmSource: params.get("utm_source") || "",
          utmMedium: params.get("utm_medium") || "",
          utmCampaign: params.get("utm_campaign") || "",
          utmTerm: params.get("utm_term") || "",
          utmContent: params.get("utm_content") || "",
        }),
      });
      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(result.error || "Something went wrong. Please try again.");
        return;
      }
      if (result.alreadySubscribed) {
        setStatus("already");
        setMessage("You're already subscribed — thank you!");
        return;
      }
      if (result.pendingConfirmation) {
        setStatus("pending");
        setMessage("Almost there — check your inbox to confirm your subscription.");
        form.reset();
        return;
      }

      setStatus("done");
      setMessage("Thank you for subscribing!");
      form.reset();
      onSuccess?.();
      window.location.href = "/thank-you";
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className={formClassName} onSubmit={onSubmit} noValidate>
      <label htmlFor="sf-name" className="sr-only">
        First name
      </label>
      <input id="sf-name" name="firstName" type="text" placeholder="First name" autoComplete="given-name" />

      <label htmlFor="sf-email" className="sr-only">
        Email address
      </label>
      <input id="sf-email" name="email" type="email" placeholder="Enter your email" autoComplete="email" required />

      {/* Honeypot: invisible to real visitors, bots tend to fill every field in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hp-field"
        aria-hidden="true"
      />

      <button type="submit" className="btn btn--primary" disabled={status === "loading"}>
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>

      <p className={statusClassName} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
