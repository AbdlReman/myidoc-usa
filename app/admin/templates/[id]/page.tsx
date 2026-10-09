"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import TemplateEditor from "@/components/admin/TemplateEditor";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

export default function AdminTemplateEditPage() {
  const auth = useRequireAdmin();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [htmlBody, setHtmlBody] = useState("<p>Hi {{first_name|there}},</p><p>Write your email here.</p>");
  const [plainTextBody, setPlainTextBody] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!auth || isNew) return;
    try {
      const data = await adminFetch(`/api/admin/templates/${params.id}`, auth);
      setName(data.name);
      setSubject(data.subject);
      setPreviewText(data.previewText);
      setHtmlBody(data.htmlBody);
      setPlainTextBody(data.plainTextBody);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load template");
    } finally {
      setLoading(false);
    }
  }, [auth, isNew, params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!auth) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const body = JSON.stringify({ name, subject, previewText, htmlBody, plainTextBody });
      if (isNew) {
        const created = await adminFetch("/api/admin/templates", auth, { method: "POST", body });
        router.replace(`/admin/templates/${created._id}`);
      } else {
        await adminFetch(`/api/admin/templates/${params.id}`, auth, { method: "PUT", body });
        setSaved(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest(to: string) {
    if (!auth) return;
    if (isNew) throw new Error("Save the template before sending a test.");
    await adminFetch(`/api/admin/templates/${params.id}/send-test`, auth, {
      method: "POST",
      body: JSON.stringify({ to }),
    });
  }

  if (!auth) return null;

  return (
    <AdminShell active="templates">
      <div className="dash__header">
        <div>
          <Link href="/admin/templates" className="muted">
            ← Back to Templates
          </Link>
          <h1 style={{ marginTop: 6 }}>{isNew ? "New Template" : "Edit Template"}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saved && <span className="muted">Saved!</span>}
          <button className="btn btn--primary" onClick={save} disabled={saving || loading}>
            {saving ? "Saving…" : "Save Template"}
          </button>
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div className="dash__empty">Loading template…</div>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label" htmlFor="tpl-name">Template name (internal, not shown to subscribers)</label>
            <input id="tpl-name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <TemplateEditor
            auth={auth}
            subject={subject}
            onSubjectChange={setSubject}
            previewText={previewText}
            onPreviewTextChange={setPreviewText}
            htmlBody={htmlBody}
            onHtmlBodyChange={setHtmlBody}
            plainTextBody={plainTextBody}
            onPlainTextBodyChange={setPlainTextBody}
            onSendTest={sendTest}
          />
        </>
      )}
    </AdminShell>
  );
}
