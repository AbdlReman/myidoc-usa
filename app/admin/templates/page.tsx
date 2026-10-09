"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import Icon from "@/components/Icon";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

type Template = {
  _id: string;
  name: string;
  subject: string;
  updatedAt: string;
  updatedBy: string;
};

export default function AdminTemplatesPage() {
  const auth = useRequireAdmin();
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!auth) return;
    try {
      const data = await adminFetch("/api/admin/templates", auth);
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  async function duplicate(id: string) {
    if (!auth) return;
    const copy = await adminFetch(`/api/admin/templates/${id}/duplicate`, auth, { method: "POST" });
    router.push(`/admin/templates/${copy._id}`);
  }

  async function remove(id: string) {
    if (!auth || !confirm("Delete this template?")) return;
    try {
      await adminFetch(`/api/admin/templates/${id}`, auth, { method: "DELETE" });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete template");
    }
  }

  if (!auth) return null;

  return (
    <AdminShell active="templates">
      <div className="dash__header">
        <div>
          <h1>Email Templates</h1>
          <p className="muted" style={{ margin: 0 }}>
            Edit copy, subject lines, and images without touching code.
          </p>
        </div>
        <Link href="/admin/templates/new" className="btn btn--primary">
          <Icon name="plus" size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
          New Template
        </Link>
      </div>

      <div className="dash__panel">
        {error && <div className="dash__empty">{error}</div>}
        {!error && loading && <div className="dash__empty">Loading templates…</div>}
        {!error && !loading && templates.length === 0 && <div className="dash__empty">No templates yet.</div>}
        {!error && !loading && templates.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="dash__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Last updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <Link href={`/admin/templates/${t._id}`}>{t.name}</Link>
                    </td>
                    <td>{t.subject}</td>
                    <td>
                      {new Date(t.updatedAt).toLocaleDateString()} {t.updatedBy && `by ${t.updatedBy}`}
                    </td>
                    <td>
                      <div className="dash__row-actions">
                        <button className="dash__icon-btn" aria-label="Duplicate" onClick={() => duplicate(t._id)}>
                          <Icon name="template" size={15} />
                        </button>
                        <button className="dash__icon-btn dash__icon-btn--danger" aria-label="Delete" onClick={() => remove(t._id)}>
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
