"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

type Settings = {
  fromName: string;
  fromEmail: string;
  replyTo: string;
  bookingLink: string;
  footerAddress: string;
  doubleOptIn: boolean;
};

export default function AdminSettingsPage() {
  const auth = useRequireAdmin();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!auth) return;
    try {
      const data = await adminFetch("/api/admin/settings", auth);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
    }
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!auth || !settings) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const updated = await adminFetch("/api/admin/settings", auth, { method: "PUT", body: JSON.stringify(settings) });
      setSettings(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (!auth) return null;

  return (
    <AdminShell active="settings">
      <div className="dash__header">
        <div>
          <h1>Settings</h1>
          <p className="muted" style={{ margin: 0 }}>
            From/reply-to address, booking link, and footer details used across every email.
          </p>
        </div>
        <button className="btn btn--primary" onClick={save} disabled={saving || !settings}>
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
      {saved && <div className="muted" style={{ marginBottom: 16 }}>Saved!</div>}

      {!settings && <div className="dash__empty">Loading settings…</div>}

      {settings && (
        <div className="dash__panel">
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="st-fromName">From name</label>
              <input
                id="st-fromName"
                className="form-input"
                value={settings.fromName}
                onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="st-fromEmail">From email</label>
              <input
                id="st-fromEmail"
                className="form-input"
                value={settings.fromEmail}
                onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
              />
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Gmail SMTP requires this to match (or be a verified alias of) the account in EMAIL_USER.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="st-replyTo">Reply-to email</label>
              <input
                id="st-replyTo"
                className="form-input"
                value={settings.replyTo}
                onChange={(e) => setSettings({ ...settings, replyTo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="st-booking">Booking link</label>
              <input
                id="st-booking"
                className="form-input"
                value={settings.bookingLink}
                onChange={(e) => setSettings({ ...settings, bookingLink: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="st-footer">Footer mailing address</label>
              <input
                id="st-footer"
                className="form-input"
                value={settings.footerAddress}
                onChange={(e) => setSettings({ ...settings, footerAddress: e.target.value })}
              />
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Required by CAN-SPAM — appears in the footer of every subscriber email.
              </p>
            </div>
            <div className="form-group">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.doubleOptIn}
                  onChange={(e) => setSettings({ ...settings, doubleOptIn: e.target.checked })}
                />
                <span className="toggle-switch__track" />
                <span>Require double opt-in confirmation</span>
              </label>
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                When on, new subscribers must click a confirmation link before entering the welcome flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
