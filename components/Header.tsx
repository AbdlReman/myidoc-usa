"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <span>Online cancer &amp; hematology consultations across the USA</span>
          <span className="topbar__right">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>Medical emergency? Call 911</span>
          </span>
        </div>
      </div>

      <header className="header">
        <div className="container header__inner">
          <a href="#top" aria-label={`${site.name} home`}>
            <Logo />
          </a>

          <nav className="header__nav" aria-label="Main">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <a href="#" className="header__login">
              Patient Login
            </a>
            <a href={site.bookingUrl} className="btn btn--gold">
              Schedule a Consultation
            </a>
          </div>

          <button
            type="button"
            className="header__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={26} strokeWidth={2} />
          </button>
        </div>

        <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} hidden={!open}>
          <nav className="container mobile-menu__inner" aria-label="Mobile">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#" onClick={() => setOpen(false)}>
              Patient Login
            </a>
            <a href={site.bookingUrl} className="btn btn--gold btn--block">
              Schedule a Consultation
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
