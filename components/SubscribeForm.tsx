"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "done" | "already" | "error";

type Props = {
  source?: string;
  formClassName?: string;
  statusClassName?: string;
  showNameField?: boolean;
  onSuccess?: () => void;
};

export default function SubscribeForm({
  source,
  formClassName = "subscribe-form",
  statusClassName = "subscribe-form__status",
  showNameField = true,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  function showMessage(nextStatus: Status, text: string) {
    setStatus(nextStatus);
    setMessage(text);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => {
      setMessage("");
      setStatus("idle");
    }, 3000);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = (data.get("email") as string)?.trim() ?? "";
    const firstName = (data.get("firstName") as string)?.trim() ?? "";
    const website = (data.get("website") as string) ?? "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("error", "Please enter a valid email address.");
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
        showMessage("error", result.error || "Something went wrong. Please try again.");
        return;
      }
      if (result.alreadySubscribed) {
        showMessage("already", "You're already subscribed — thank you!");
        return;
      }

      showMessage("done", "Thanks for subscribing!");
      form.reset();
      onSuccess?.();
    } catch {
      showMessage("error", "Something went wrong. Please try again.");
    }
  }

  return (
    <form className={formClassName} onSubmit={onSubmit} noValidate>
      {showNameField && (
        <>
          <label htmlFor="sf-name" className="sr-only">
            First name
          </label>
          <input id="sf-name" name="firstName" type="text" placeholder="First name" autoComplete="given-name" />
        </>
      )}

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
