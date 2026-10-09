"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

function UnsubscribeContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      return;
    }
    fetch(`/api/unsubscribe?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setEmail(data.email || "");
          setState("done");
        } else {
          setState("error");
        }
      })
      .catch(() => setState("error"));
  }, [token]);

  return (
    <div className="container post" style={{ textAlign: "center", maxWidth: 560 }}>
      {state === "loading" && <p>Processing your request…</p>}
      {state === "done" && (
        <>
          <p>
            <strong>{email || "You"}</strong> {email ? "have" : "You've"} been unsubscribed and won&apos;t receive
            any further emails from MyIDocUSA.
          </p>
          <p>If this was a mistake, you're welcome to subscribe again any time from our homepage.</p>
        </>
      )}
      {state === "error" && <p>We couldn't process that unsubscribe link. It may be invalid or already used.</p>}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eyebrow="Email Preferences" title="Unsubscribe" crumb="Unsubscribe" />
        <section className="section">
          <Suspense fallback={<div className="container post">Processing your request…</div>}>
            <UnsubscribeContent />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
