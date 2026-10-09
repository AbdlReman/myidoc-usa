"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import Icon from "@/components/Icon";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

type Lead = {
  _id: string;
  firstName: string;
  email: string;
  status: string;
  audienceType: string;
  source: string;
  tags: string[];
  createdAt: string;
  unsubscribedAt: string | null;
};

type EmailHistoryItem = {
  _id: string;
  status: string;
  scheduledFor: string;
  sentAt: string | null;
  opens: number;
  clicks: number;
  error: string;
  template: { name: string; subject: string } | null;
};

export default function AdminLeadDetailPage() {
  const auth = useRequireAdmin();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [lead, setLead] = useState<Lead | null>(null);
  const [history, setHistory] = useState<EmailHistoryItem[]>([]);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const load = useCallback(async () => {
    if (!auth) return;
    try {
      const data = await adminFetch(`/api/admin/leads/${params.id}`, auth);
      setLead(data.lead);
      setHistory(data.emailHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lead");
    }
  }, [auth, params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveField(patch: Partial<Lead>) {
    if (!auth) return;
    const updated = await adminFetch(`/api/admin/leads/${params.id}`, auth, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    setLead(updated);
  }

  async function addTag() {
    if (!lead || !tagInput.trim()) return;
    await saveField({ tags: [...lead.tags, tagInput.trim()] });
    setTagInput("");
  }

  async function removeTag(tag: string) {
    if (!lead) return;
    await saveField({ tags: lead.tags.filter((t) => t !== tag) });
  }

  async function unsubscribe() {
    if (!auth || !confirm("Unsubscribe this lead? Pending emails will be cancelled.")) return;
    await adminFetch(`/api/admin/leads/${params.id}/unsubscribe`, auth, { method: "POST" });
    load();
  }

  async function deleteLead() {
    if (!auth || !confirm("Delete this lead permanently?")) return;
    await adminFetch(`/api/admin/leads/${params.id}`, auth, { method: "DELETE" });
    router.push("/admin/leads");
  }

  if (!auth) return null;

  return (
    <AdminShell active="leads">
      <div className="dash__header">
        <div>
          <Link href="/admin/leads" className="muted">
            ← Back to Leads
          </Link>
          <h1 style={{ marginTop: 6 }}>{lead?.firstName || "Lead"}</h1>
        </div>
        {lead && lead.status !== "unsubscribed" && (
          <button className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={unsubscribe}>
            Unsubscribe
          </button>
        )}
      </div>

      {error && <div className="dash__empty">{error}</div>}

      {lead && (
        <>
          <div className="dash__panel" style={{ marginBottom: 24 }}>
            <div className="dash__panel-head">
              <h2>Details</h2>
              <button className="dash__icon-btn dash__icon-btn--danger" aria-label="Delete lead" onClick={deleteLead}>
                <Icon name="trash" size={15} />
              </button>
            </div>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div className="dash__stat-label">Email</div>
                <div>{lead.email}</div>
              </div>
              <div>
                <div className="dash__stat-label">Status</div>
                <select
                  className="form-input form-select"
                  value={lead.status}
                  onChange={(e) => saveField({ status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="bounced">Bounced</option>
                  <option value="completed">Completed</option>
                  <option value="pending_confirmation">Pending confirmation</option>
                </select>
              </div>
              <div>
                <div className="dash__stat-label">First name</div>
                <input
                  className="form-input"
                  defaultValue={lead.firstName}
                  onBlur={(e) => saveField({ firstName: e.target.value })}
                />
              </div>
              <div>
                <div className="dash__stat-label">Audience type</div>
                <input
                  className="form-input"
                  defaultValue={lead.audienceType}
                  onBlur={(e) => saveField({ audienceType: e.target.value })}
                />
              </div>
              <div>
                <div className="dash__stat-label">Source</div>
                <div>{lead.source || "—"}</div>
              </div>
              <div>
                <div className="dash__stat-label">Subscribed</div>
                <div>{new Date(lead.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div style={{ padding: "0 24px 24px" }}>
              <div className="dash__stat-label" style={{ marginBottom: 8 }}>
                Tags
              </div>
              <div className="tag-list">
                {lead.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>
                      <Icon name="x" size={11} />
                    </button>
                  </span>
                ))}
                <input
                  className="form-input"
                  style={{ maxWidth: 160, display: "inline-block" }}
                  placeholder="Add tag…"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
              </div>
            </div>
          </div>

          <div className="dash__panel">
            <div className="dash__panel-head">
              <h2>Email History</h2>
            </div>
            {history.length === 0 && <div className="dash__empty">No emails scheduled yet.</div>}
            {history.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table className="dash__table">
                  <thead>
                    <tr>
                      <th>Template</th>
                      <th>Scheduled For</th>
                      <th>Status</th>
                      <th>Sent At</th>
                      <th>Opens</th>
                      <th>Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h._id}>
                        <td>{h.template?.name || "(deleted template)"}</td>
                        <td>{new Date(h.scheduledFor).toLocaleString()}</td>
                        <td>{h.status}</td>
                        <td>{h.sentAt ? new Date(h.sentAt).toLocaleString() : "—"}</td>
                        <td>{h.opens}</td>
                        <td>{h.clicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
