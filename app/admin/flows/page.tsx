"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Icon from "@/components/Icon";
import { adminFetch, useRequireAdmin } from "@/lib/authClient";

type Template = { _id: string; name: string };

type Step = {
  _id: string;
  order: number;
  templateId: string;
  delayValue: number;
  delayUnit: "minutes" | "hours" | "days";
  isActive: boolean;
  template: { name: string; subject: string } | null;
};

type Flow = {
  _id: string;
  name: string;
  isActive: boolean;
  trigger: string;
  steps: Step[];
};

export default function AdminFlowsPage() {
  const auth = useRequireAdmin();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyStatus, setApplyStatus] = useState<Record<string, string>>({});
  const [dragStepId, setDragStepId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!auth) return;
    try {
      const [flowsData, templatesData] = await Promise.all([
        adminFetch("/api/admin/flows", auth),
        adminFetch("/api/admin/templates", auth),
      ]);
      setFlows(flowsData);
      setTemplates(templatesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load flows");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleFlowActive(flow: Flow) {
    if (!auth) return;
    await adminFetch(`/api/admin/flows/${flow._id}`, auth, {
      method: "PUT",
      body: JSON.stringify({ isActive: !flow.isActive }),
    });
    load();
  }

  async function addStep(flowId: string) {
    if (!auth || templates.length === 0) return;
    await adminFetch(`/api/admin/flows/${flowId}/steps`, auth, {
      method: "POST",
      body: JSON.stringify({ templateId: templates[0]._id, delayValue: 1, delayUnit: "days" }),
    });
    load();
  }

  async function updateStep(flowId: string, stepId: string, patch: Partial<Step>) {
    if (!auth) return;
    await adminFetch(`/api/admin/flows/${flowId}/steps/${stepId}`, auth, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    load();
  }

  async function removeStep(flowId: string, stepId: string) {
    if (!auth || !confirm("Remove this step from the flow?")) return;
    await adminFetch(`/api/admin/flows/${flowId}/steps/${stepId}`, auth, { method: "DELETE" });
    load();
  }

  async function persistOrder(flow: Flow, orderedSteps: Step[]) {
    if (!auth) return;
    setFlows((prev) => prev.map((f) => (f._id === flow._id ? { ...f, steps: orderedSteps } : f)));
    await adminFetch(`/api/admin/flows/${flow._id}/steps`, auth, {
      method: "PUT",
      body: JSON.stringify({ order: orderedSteps.map((s) => s._id) }),
    });
    load();
  }

  function handleDrop(flow: Flow, targetStepId: string) {
    if (!dragStepId || dragStepId === targetStepId) return;
    const steps = [...flow.steps];
    const fromIndex = steps.findIndex((s) => s._id === dragStepId);
    const toIndex = steps.findIndex((s) => s._id === targetStepId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = steps.splice(fromIndex, 1);
    steps.splice(toIndex, 0, moved);
    persistOrder(flow, steps);
    setDragStepId(null);
  }

  async function applyToExisting(flowId: string) {
    if (!auth) return;
    setApplyStatus((s) => ({ ...s, [flowId]: "Applying…" }));
    try {
      const result = await adminFetch(`/api/admin/flows/${flowId}/apply-existing`, auth, { method: "POST" });
      setApplyStatus((s) => ({ ...s, [flowId]: `Applied to ${result.leadsProcessed} active lead(s).` }));
    } catch (err) {
      setApplyStatus((s) => ({ ...s, [flowId]: err instanceof Error ? err.message : "Failed" }));
    }
  }

  if (!auth) return null;

  return (
    <AdminShell active="flows">
      <div className="dash__header">
        <div>
          <h1>Email Flows</h1>
          <p className="muted" style={{ margin: 0 }}>
            Control what gets sent, when, and whether it's on — no code required.
          </p>
        </div>
      </div>

      {error && <div className="dash__empty">{error}</div>}
      {!error && loading && <div className="dash__empty">Loading flows…</div>}

      {!error && !loading && flows.length === 0 && (
        <div className="dash__empty">No flows yet. Run the seed script to create the default welcome series.</div>
      )}

      {!error &&
        flows.map((flow) => (
          <div className="dash__panel flow-panel" key={flow._id}>
            <div className="dash__panel-head">
              <div>
                <h2>{flow.name}</h2>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                  Trigger: {flow.trigger}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  className="btn btn--outline-light"
                  style={{ color: "var(--text)", borderColor: "var(--border)" }}
                  onClick={() => applyToExisting(flow._id)}
                >
                  Apply to Existing Leads
                </button>
                <label className="toggle-switch">
                  <input type="checkbox" checked={flow.isActive} onChange={() => toggleFlowActive(flow)} />
                  <span className="toggle-switch__track" />
                  <span>{flow.isActive ? "Active" : "Paused"}</span>
                </label>
              </div>
            </div>

            {applyStatus[flow._id] && (
              <div className="muted" style={{ padding: "8px 24px 0" }}>
                {applyStatus[flow._id]}
              </div>
            )}

            <div className="flow-timeline">
              {flow.steps.map((step, i) => (
                <div
                  key={step._id}
                  className="flow-step-card"
                  draggable
                  onDragStart={() => setDragStepId(step._id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(flow, step._id)}
                >
                  <span className="flow-step-card__drag" aria-hidden="true">
                    <Icon name="drag" size={18} />
                  </span>
                  <span className="flow-step-card__order">{i + 1}</span>

                  <select
                    className="form-input form-select"
                    value={step.templateId}
                    onChange={(e) => updateStep(flow._id, step._id, { templateId: e.target.value })}
                  >
                    {templates.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <span className="muted">Send after</span>
                  <input
                    type="number"
                    min={0}
                    className="form-input"
                    style={{ width: 70 }}
                    value={step.delayValue}
                    onChange={(e) => updateStep(flow._id, step._id, { delayValue: Number(e.target.value) })}
                  />
                  <select
                    className="form-input form-select"
                    style={{ width: 110 }}
                    value={step.delayUnit}
                    onChange={(e) => updateStep(flow._id, step._id, { delayUnit: e.target.value as Step["delayUnit"] })}
                  >
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>

                  <label className="toggle-switch toggle-switch--compact">
                    <input
                      type="checkbox"
                      checked={step.isActive}
                      onChange={(e) => updateStep(flow._id, step._id, { isActive: e.target.checked })}
                    />
                    <span className="toggle-switch__track" />
                  </label>

                  <button
                    className="dash__icon-btn dash__icon-btn--danger"
                    aria-label="Remove step"
                    onClick={() => removeStep(flow._id, step._id)}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ padding: "16px 24px 24px" }}>
              <button className="btn btn--outline-light" style={{ color: "var(--text)", borderColor: "var(--border)" }} onClick={() => addStep(flow._id)}>
                <Icon name="plus" size={15} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                Add Step
              </button>
            </div>
          </div>
        ))}
    </AdminShell>
  );
}
