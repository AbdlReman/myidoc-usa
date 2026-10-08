"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email")?.toString().trim() ?? "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: send `email` to your newsletter provider (Mailchimp, ConvertKit, etc.)
    setStatus("done");
    e.currentTarget.reset();
  };

  return (
    <section className="newsletter-wrap">
      <div className="container">
        <div className="newsletter">
          <div className="newsletter__copy">
            <h2 className="h2 h2--sm">Subscribe to Our Newsletter</h2>
            <p>Stay updated with our latest news, articles and offers.</p>
          </div>
          <form className="newsletter__form" onSubmit={onSubmit} noValidate>
            <label htmlFor="nl-email" className="sr-only">
              Email address
            </label>
            <input id="nl-email" name="email" type="email" placeholder="Enter your email" autoComplete="email" required />
            <button type="submit" className="btn btn--primary">
              Subscribe
            </button>
            <p className="newsletter__status" role="status" aria-live="polite">
              {status === "done" && "Thank you — you're subscribed."}
              {status === "error" && "Please enter a valid email address."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
