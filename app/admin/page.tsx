"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SignupsChart from "@/components/admin/Chart";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

type Stats = {
  totalLeads: number;
  newToday: number;
  newThisWeek: number;
  activeCount: number;
  unsubscribedCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  signupsOverTime: { date: string; count: number }[];
};

export default function AdminOverviewPage() {
  const auth = useRequireAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    adminFetch("/api/admin/stats", auth)
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [auth]);

  if (!auth) return null;

  return (
    <AdminShell active="overview">
      <div className="dash__header">
        <div>
          <h1>Overview</h1>
          <p className="muted" style={{ margin: 0 }}>
            Signed in as {auth.name}
          </p>
        </div>
      </div>

      {error && <div className="dash__empty">{error}</div>}

      {!error && (
        <>
          <div className="dash__stats">
            <div className="dash__stat">
              <div className="dash__stat-label">Total Leads</div>
              <div className="dash__stat-value">{stats ? stats.totalLeads : "…"}</div>
            </div>
            <div className="dash__stat">
              <div className="dash__stat-label">New Today</div>
              <div className="dash__stat-value">{stats ? stats.newToday : "…"}</div>
            </div>
            <div className="dash__stat">
              <div className="dash__stat-label">New This Week</div>
              <div className="dash__stat-value">{stats ? stats.newThisWeek : "…"}</div>
            </div>
            <div className="dash__stat">
              <div className="dash__stat-label">Active / Unsubscribed</div>
              <div className="dash__stat-value">
                {stats ? `${stats.activeCount} / ${stats.unsubscribedCount}` : "…"}
              </div>
            </div>
            <div className="dash__stat">
              <div className="dash__stat-label">Emails Sent</div>
              <div className="dash__stat-value">{stats ? stats.sentCount : "…"}</div>
            </div>
            <div className="dash__stat">
              <div className="dash__stat-label">Open Rate</div>
              <div className="dash__stat-value">{stats ? `${(stats.openRate * 100).toFixed(1)}%` : "…"}</div>
            </div>
            <div className="dash__stat">
              <div className="dash__stat-label">Click Rate</div>
              <div className="dash__stat-value">{stats ? `${(stats.clickRate * 100).toFixed(1)}%` : "…"}</div>
            </div>
          </div>

          <div className="dash__panel">
            <div className="dash__panel-head">
              <h2>Signups — Last 30 Days</h2>
            </div>
            <div style={{ padding: 24 }}>
              {stats ? <SignupsChart data={stats.signupsOverTime} /> : <div className="dash__empty">Loading…</div>}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
