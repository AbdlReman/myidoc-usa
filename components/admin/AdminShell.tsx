"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { clearAuth } from "@/lib/authClient";
import type { IconName } from "@/lib/content";

export type AdminNavKey = "overview" | "leads" | "templates" | "flows" | "logs" | "settings" | "users";

const NAV_ITEMS: { key: AdminNavKey; label: string; href: string; icon: IconName }[] = [
  { key: "overview", label: "Overview", href: "/admin", icon: "dashboard" },
  { key: "leads", label: "Leads", href: "/admin/leads", icon: "mail" },
  { key: "templates", label: "Templates", href: "/admin/templates", icon: "template" },
  { key: "flows", label: "Flows", href: "/admin/flows", icon: "flow" },
  { key: "logs", label: "Logs", href: "/admin/logs", icon: "log" },
  { key: "settings", label: "Settings", href: "/admin/settings", icon: "settings" },
  { key: "users", label: "Admin Users", href: "/admin/dashboard", icon: "users" },
];

type Props = { active: AdminNavKey; children: React.ReactNode };

export default function AdminShell({ active, children }: Props) {
  const router = useRouter();

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  return (
    <div className="dash">
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <Logo />
        </div>
        <nav className="dash__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`dash__nav-item${item.key === active ? " is-active" : ""}`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="dash__logout" onClick={handleLogout}>
          <Icon name="logout" size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} />
          Log out
        </button>
      </aside>

      <div className="dash__main">{children}</div>
    </div>
  );
}
