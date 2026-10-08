type Props = { light?: boolean };

/** Placeholder brand mark — replace with your real logo (e.g. next/image with /public/logo.svg). */
export default function Logo({ light = false }: Props) {
  const ink = light ? "#FFFFFF" : "var(--primary)";
  return (
    <span className={`logo ${light ? "logo--light" : ""}`}>
      <svg width="32" height="38" viewBox="0 0 34 40" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="6" r="4" fill="var(--lavender)" />
        <path d="M5 14c6 3 12 3 24-2" stroke={ink} strokeWidth="3" />
        <path d="M18 14c-2 8-1 14 4 22" stroke="var(--lavender)" strokeWidth="3.4" />
        <path d="M17 24c-4 3-7 8-8 13" stroke={ink} strokeWidth="3" />
      </svg>
      <span className="logo__text">
        MYiDoc<span className="logo__accent">USA</span>
      </span>
    </span>
  );
}
