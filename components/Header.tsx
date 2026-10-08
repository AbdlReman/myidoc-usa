"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import Logo from "./Logo";
import { nav, site } from "@/lib/content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<string | null>(null);

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
          <Link href="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          <nav className="header__nav" aria-label="Main">
            {nav.map((item) =>
              "children" in item && item.children ? (
                <div key={item.href} className="nav-dropdown">
                  <Link href={item.href} className="nav-dropdown__trigger">
                    {item.label}
                    <Icon name="chevronDown" size={14} strokeWidth={2.4} />
                  </Link>
                  <div className="nav-dropdown__menu">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              )
            )}
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
            {nav.map((item) =>
              "children" in item && item.children ? (
                <div key={item.href} className="mobile-menu__group">
                  <button
                    type="button"
                    className="mobile-menu__group-toggle"
                    aria-expanded={mobileGroupOpen === item.label}
                    onClick={() => setMobileGroupOpen((v) => (v === item.label ? null : item.label))}
                  >
                    {item.label}
                    <Icon name="chevronDown" size={16} strokeWidth={2.4} />
                  </button>
                  {mobileGroupOpen === item.label && (
                    <div className="mobile-menu__submenu">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setOpen(false)}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
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
