"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

type LogItem = {
  _id: string;
  status: string;
  scheduledFor: string;
  sentAt: string | null;
  attempts: number;
  error: string;
  opens: number;
  clicks: number;
  lead: { email: string; firstName: string } | null;
  template: { name: string } | null;
};

const STATUS_BADGE: Record<string, string> = {
  pending: "status-badge status-badge--pending",
  sent: "status-badge status-badge--active",
  failed: "status-badge status-badge--unsubscribed",
  skipped: "status-badge",
};

export default function AdminLogsPage() {
  const auth = useRequireAdmin();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 25;

  const load = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, page: String(page), pageSize: String(pageSize) });
      const data = await adminFetch(`/api/admin/logs?${params}`, auth);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [auth, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function retry(id: string) {
    if (!auth) return;
    await adminFetch(`/api/admin/logs/${id}/retry`, auth, { method: "POST" });
    load();
  }

  if (!auth) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell active="logs">
      <div className="dash__header">
        <div>
          <h1>Email Logs</h1>
          <p className="muted" style={{ margin: 0 }}>
            {total} scheduled email{total === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="dash__filters">
        <select
          className="form-input form-select"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>

      <div className="dash__panel">
        {error && <div className="dash__empty">{error}</div>}
        {!error && loading && <div className="dash__empty">Loading logs…</div>}
        {!error && !loading && logs.length === 0 && <div className="dash__empty">No emails match these filters.</div>}
        {!error && !loading && logs.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="dash__table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Template</th>
                  <th>Status</th>
                  <th>Scheduled For</th>
                  <th>Sent At</th>
                  <th>Opens</th>
                  <th>Clicks</th>
                  <th>Error</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.lead?.email || "(deleted lead)"}</td>
                    <td>{log.template?.name || "(deleted template)"}</td>
                    <td>
                      <span className={STATUS_BADGE[log.status] || "status-badge"}>{log.status}</span>
                      {log.attempts > 0 && log.status !== "sent" && (
                        <span className="muted" style={{ marginLeft: 6, fontSize: 12 }}>
                          ({log.attempts} attempt{log.attempts === 1 ? "" : "s"})
                        </span>
                      )}
                    </td>
                    <td>{new Date(log.scheduledFor).toLocaleString()}</td>
                    <td>{log.sentAt ? new Date(log.sentAt).toLocaleString() : "—"}</td>
                    <td>{log.opens}</td>
                    <td>{log.clicks}</td>
                    <td style={{ maxWidth: 220, fontSize: 12, color: "var(--muted)" }}>{log.error || "—"}</td>
                    <td>
                      {log.status === "failed" && (
                        <button className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={() => retry(log._id)}>
                          Retry
                        </button>
                      )}
                    </td>
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
    </AdminShell>
  );
}
