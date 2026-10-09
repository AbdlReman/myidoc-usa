"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { clearAuth, getAuth, ROLE_LABELS, type StoredAuth } from "@/lib/authClient";

type DashUser = {
  _id: string;
  name: string;
  email: string;
  role: number;
};

type FormState = { _id?: string; name: string; email: string; password: string; role: number };

const EMPTY_FORM: FormState = { name: "", email: "", password: "", role: 3 };

const roleBadgeClass: Record<number, string> = {
  1: "role-badge role-badge--admin",
  2: "role-badge role-badge--doctor",
  3: "role-badge role-badge--patient",
};

const avatarColor: Record<number, string> = { 1: "var(--primary)", 2: "#2196f3", 3: "#4caf50" };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [users, setUsers] = useState<DashUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async (token: string) => {
    const res = await fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Unauthorized");
    return (await res.json()) as DashUser[];
  }, []);

  useEffect(() => {
    const stored = getAuth();
    if (!stored || stored.role !== 1) {
      router.replace("/login");
      return;
    }
    setAuth(stored);
    loadUsers(stored.token)
      .then(setUsers)
      .catch(() => {
        setError("Your session has expired. Redirecting to sign in…");
        clearAuth();
        setTimeout(() => router.replace("/login"), 1500);
      })
      .finally(() => setLoading(false));
  }, [router, loadUsers]);

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(user: DashUser) {
    setForm({ _id: user._id, name: user.name, email: user.email, password: "", role: user.role });
    setFormError("");
    setModalOpen(true);
  }

  async function handleDelete(user: DashUser) {
    if (!auth) return;
    if (!confirm(`Delete ${user.name}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/users/${user._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to delete user");
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth) return;
    setFormError("");
    setSaving(true);

    const isEdit = Boolean(form._id);
    const url = isEdit ? `/api/admin/users/${form._id}` : "/api/admin/users";
    const method = isEdit ? "PUT" : "POST";
    const body: Record<string, unknown> = { name: form.name, email: form.email, role: form.role };
    if (form.password) body.password = form.password;
    if (!isEdit) body.password = form.password;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to save user");
        return;
      }
      if (isEdit) {
        setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));
      } else {
        setUsers((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!auth) return null;

  const counts = {
    total: users.length,
    admins: users.filter((u) => u.role === 1).length,
    doctors: users.filter((u) => u.role === 2).length,
    patients: users.filter((u) => u.role === 3).length,
  };

  return (
    <div className="dash">
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <Logo />
        </div>
        <nav className="dash__nav">
          <Link href="/admin/dashboard" className="dash__nav-item is-active">
            <Icon name="users" size={20} />
            Users
          </Link>
        </nav>
        <button className="dash__logout" onClick={handleLogout}>
          <Icon name="logout" size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} />
          Log out
        </button>
      </aside>

      <div className="dash__main">
        <div className="dash__header">
          <div>
            <h1>Users</h1>
            <p className="muted" style={{ margin: 0 }}>
              Signed in as {auth.name} ({ROLE_LABELS[auth.role]})
            </p>
          </div>
          <button className="btn btn--primary" onClick={openCreateModal}>
            <Icon name="plus" size={16} style={{ marginRight: 6, verticalAlign: "-3px" }} />
            Add User
          </button>
        </div>

        <div className="dash__stats">
          <div className="dash__stat">
            <div className="dash__stat-label">Total Users</div>
            <div className="dash__stat-value">{loading ? "…" : counts.total}</div>
          </div>
          <div className="dash__stat">
            <div className="dash__stat-label">Admins</div>
            <div className="dash__stat-value">{loading ? "…" : counts.admins}</div>
          </div>
          <div className="dash__stat">
            <div className="dash__stat-label">Doctors</div>
            <div className="dash__stat-value">{loading ? "…" : counts.doctors}</div>
          </div>
          <div className="dash__stat">
            <div className="dash__stat-label">Patients</div>
            <div className="dash__stat-value">{loading ? "…" : counts.patients}</div>
          </div>
        </div>

        <div className="dash__panel">
          <div className="dash__panel-head">
            <h2>User Management</h2>
          </div>

          {error && <div className="dash__empty">{error}</div>}

          {!error && loading && <div className="dash__empty">Loading users…</div>}

          {!error && !loading && users.length === 0 && <div className="dash__empty">No users yet. Add the first one.</div>}

          {!error && !loading && users.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table className="dash__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="dash__user-cell">
                          <span className="dash__avatar" style={{ background: avatarColor[user.role] }}>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={roleBadgeClass[user.role]}>{ROLE_LABELS[user.role]}</span>
                      </td>
                      <td>
                        <div className="dash__row-actions">
                          <button className="dash__icon-btn" aria-label="Edit user" onClick={() => openEditModal(user)}>
                            <Icon name="edit" size={15} />
                          </button>
                          <button
                            className="dash__icon-btn dash__icon-btn--danger"
                            aria-label="Delete user"
                            onClick={() => handleDelete(user)}
                          >
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
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{form._id ? "Edit User" : "Add User"}</h2>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full name</label>
                <input
                  id="name"
                  className="form-input"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="userEmail">Email address</label>
                <input
                  id="userEmail"
                  type="email"
                  className="form-input"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="role">Role</label>
                <select
                  id="role"
                  className="form-input form-select"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: Number(e.target.value) }))}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Doctor</option>
                  <option value={3}>Patient</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  {form._id ? "New password (leave blank to keep current)" : "Password"}
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  minLength={8}
                  required={!form._id}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={() => setModalOpen(false)}>
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
    </div>
  );
}
