"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SubscribeForm from "@/components/SubscribeForm";
import Icon from "@/components/Icon";

const DISMISSED_KEY = "myidocusa_popup_dismissed";
const SHOW_DELAY_MS = 8000;
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
      <div className="modal-card popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-card__close" aria-label="Close" onClick={dismiss}>
          <Icon name="close" size={18} />
        </button>
        <h2>Get Cancer Care Guidance in Your Inbox</h2>
        <p className="popup-card__text">
          Subscribe for compassionate guidance from a board-certified hematologist-oncologist — coaching tips,
          nutrition support, and how to get started with a virtual visit.
        </p>
        <SubscribeForm source="site-popup" onSuccess={dismiss} />
      </div>
    </div>
  );
}
