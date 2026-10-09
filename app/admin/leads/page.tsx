"use client";

import { useCallback, useEffect, useState } from "react";
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
};

type AddForm = { firstName: string; email: string; audienceType: string; source: string };
const EMPTY_ADD: AddForm = { firstName: "", email: "", audienceType: "", source: "" };

const STATUS_BADGE: Record<string, string> = {
  active: "status-badge status-badge--active",
  unsubscribed: "status-badge status-badge--unsubscribed",
  bounced: "status-badge status-badge--bounced",
  completed: "status-badge status-badge--completed",
  pending_confirmation: "status-badge status-badge--pending",
};

export default function AdminLeadsPage() {
  const auth = useRequireAdmin();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("createdAt:desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddForm>(EMPTY_ADD);
  const [addError, setAddError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, status, sort, page: String(page), pageSize: String(pageSize) });
      const data = await adminFetch(`/api/admin/leads?${params}`, auth);
      setLeads(data.leads);
      setTotal(data.total);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [auth, q, status, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === leads.length ? new Set() : new Set(leads.map((l) => l._id))));
  }

  async function runBulkAction(action: "unsubscribe" | "delete") {
    if (!auth || selected.size === 0) return;
    if (action === "delete" && !confirm(`Delete ${selected.size} lead(s)? This can't be undone.`)) return;
    try {
      await adminFetch("/api/admin/leads/bulk", auth, {
        method: "POST",
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      setSelected(new Set());
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bulk action failed");
    }
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setAddError("");
    setSaving(true);
    try {
      await adminFetch("/api/admin/leads", auth, { method: "POST", body: JSON.stringify(addForm) });
      setAddOpen(false);
      setAddForm(EMPTY_ADD);
      load();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add lead");
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    if (!auth) return;
    const url = `/api/admin/leads/export?status=${status}`;
    fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      });
  }

  if (!auth) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell active="leads">
      <div className="dash__header">
        <div>
          <h1>Leads</h1>
          <p className="muted" style={{ margin: 0 }}>
            {total} total subscriber{total === 1 ? "" : "s"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={exportCsv}>
            <Icon name="download" size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
            Export CSV
          </button>
          <button className="btn btn--primary" onClick={() => setAddOpen(true)}>
            <Icon name="plus" size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="dash__filters">
        <input
          className="form-input"
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
        <select
          className="form-input form-select"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
          <option value="completed">Completed</option>
          <option value="pending_confirmation">Pending confirmation</option>
        </select>
        <select className="form-input form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="email:asc">Email A–Z</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="dash__bulkbar">
          <span>{selected.size} selected</span>
          <button className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={() => runBulkAction("unsubscribe")}>
            Unsubscribe
          </button>
          <button className="dash__icon-btn dash__icon-btn--danger" onClick={() => runBulkAction("delete")} aria-label="Delete selected">
            <Icon name="trash" size={15} />
          </button>
        </div>
      )}

      <div className="dash__panel">
        {error && <div className="dash__empty">{error}</div>}
        {!error && loading && <div className="dash__empty">Loading leads…</div>}
        {!error && !loading && leads.length === 0 && <div className="dash__empty">No leads match these filters.</div>}

        {!error && !loading && leads.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="dash__table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" checked={selected.size === leads.length} onChange={toggleSelectAll} />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <input type="checkbox" checked={selected.has(lead._id)} onChange={() => toggleSelected(lead._id)} />
                    </td>
                    <td>
                      <Link href={`/admin/leads/${lead._id}`}>{lead.firstName || "(no name)"}</Link>
                    </td>
                    <td>{lead.email}</td>
                    <td>
                      <span className={STATUS_BADGE[lead.status] || "status-badge"}>{lead.status}</span>
                    </td>
                    <td>{lead.source || "—"}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!error && totalPages > 1 && (
          <div className="dash__pagination">
            <button className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn--outline-light"
              style={{ color: "var(--text)", borderColor: "var(--border)" }}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Add Lead</h2>
            {addError && <div className="form-error">{addError}</div>}
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="addFirstName">First name</label>
                <input
                  id="addFirstName"
                  className="form-input"
                  value={addForm.firstName}
                  onChange={(e) => setAddForm((f) => ({ ...f, firstName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addEmail">Email address</label>
                <input
                  id="addEmail"
                  type="email"
                  required
                  className="form-input"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="addAudience">Audience type</label>
                <input
                  id="addAudience"
                  className="form-input"
                  value={addForm.audienceType}
                  onChange={(e) => setAddForm((f) => ({ ...f, audienceType: e.target.value }))}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={() => setAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
