"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SubscribeForm from "@/components/SubscribeForm";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { site } from "@/lib/content";

const DISMISSED_KEY = "myidocusa_popup_dismissed";
const SHOW_DELAY_MS = 3000;
const EXCLUDED_PREFIXES = ["/admin", "/unsubscribe", "/login", "/register"];

export default function SubscribePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // localStorage unavailable (private mode, blocked storage) — just show the popup.
    }
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Best-effort only — not having this just means the popup may reappear.
    }
  }

  if (!open) return null;

  return (
    <div className="modal-overlay popup-overlay" onClick={dismiss}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-card__close" aria-label="Close" onClick={dismiss}>
          <Icon name="close" size={16} />
        </button>

        <div className="popup-card__header">
          <span className="popup-card__ring popup-card__ring--lg" aria-hidden="true" />
          <span className="popup-card__ring popup-card__ring--sm" aria-hidden="true" />
          <div className="popup-card__logo">
            <Logo light />
          </div>
          <p className="popup-card__eyebrow">Subscribe to Receive</p>
          <h2 className="popup-card__heading">Cancer Care Guidance</h2>
        </div>

        <div className="popup-card__body">
          <p className="popup-card__text">
            Compassionate coaching tips, nutrition support, and updates from a board-certified
            hematologist-oncologist — straight to your inbox.
          </p>

          <SubscribeForm source="site-popup" formClassName="popup-form" onSuccess={dismiss} />

          <p className="popup-card__disclaimer">
            By subscribing, you agree to receive email updates from {site.name}. You may unsubscribe at any time.
            These emails are for general information only and are not a substitute for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
