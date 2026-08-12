"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const BLANK = {
  name: "", monthly_price: "", tagline: "", badge_label: "", sort_order: 0, active: true,
  stat_callouts_json: "[]", feature_groups_json: "[]", monthly_deliverables_json: "[]",
};

export default function PackagesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("service_packages").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      monthly_price: item.monthly_price,
      tagline: item.tagline || "",
      badge_label: item.badge_label || "",
      sort_order: item.sort_order,
      active: item.active,
      stat_callouts_json: JSON.stringify(item.stat_callouts || [], null, 2),
      feature_groups_json: JSON.stringify(item.feature_groups || [], null, 2),
      monthly_deliverables_json: JSON.stringify(item.monthly_deliverables || [], null, 2),
    });
    setError("");
  }

  function startNew() {
    setEditingId("new");
    setForm({
      ...BLANK,
      sort_order: items.length,
      stat_callouts_json: '[\n  {"value": "2", "label": "High-DR Link Inserts"}\n]',
      feature_groups_json: '[\n  {"group_label": "Foundation", "items": ["Technical SEO & site health monitoring"]}\n]',
      monthly_deliverables_json: '[\n  {"title": "6 Guest Post / AI Citation Placements / mo", "description": "High-authority links + AI brand mentions combined"}\n]',
    });
    setError("");
  }

  function cancel() {
    setEditingId(null);
    setForm(BLANK);
    setError("");
  }

  async function save(e) {
    e.preventDefault();
    setError("");

    let statCallouts, featureGroups, monthlyDeliverables;
    try {
      statCallouts = JSON.parse(form.stat_callouts_json);
      featureGroups = JSON.parse(form.feature_groups_json);
      monthlyDeliverables = JSON.parse(form.monthly_deliverables_json);
    } catch (parseErr) {
      setError(`Stat callouts / feature groups / monthly deliverables must be valid JSON: ${parseErr.message}`);
      return;
    }

    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      monthly_price: Number(form.monthly_price),
      tagline: form.tagline.trim(),
      badge_label: form.badge_label.trim(),
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
      stat_callouts: statCallouts,
      feature_groups: featureGroups,
      monthly_deliverables: monthlyDeliverables,
    };
    if (!payload.name || Number.isNaN(payload.monthly_price)) {
      setError("Name and a numeric monthly price are required.");
      return;
    }
    const { error: err } =
      editingId === "new"
        ? await supabase.from("service_packages").insert(payload)
        : await supabase.from("service_packages").update(payload).eq("id", editingId);
    if (err) {
      setError(err.message);
      return;
    }
    cancel();
    load();
  }

  async function remove(id) {
    const supabase = createClient();
    await supabase.from("service_packages").delete().eq("id", id);
    load();
  }

  return (
    <div>
      {editingId ? (
        <form className="form-card" onSubmit={save} style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Dominance" />
            </div>
            <div className="form-field">
              <label>Monthly price ($)</label>
              <input type="number" step="0.01" value={form.monthly_price} onChange={(e) => setForm((f) => ({ ...f, monthly_price: e.target.value }))} placeholder="e.g. 4000" />
            </div>
            <div className="form-field">
              <label>Badge label (optional)</label>
              <input type="text" value={form.badge_label} onChange={(e) => setForm((f) => ({ ...f, badge_label: e.target.value }))} placeholder="e.g. Most Popular" />
            </div>
            <div className="form-field">
              <label>Sort order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} />
            </div>
            <div className="form-field form-field-wide">
              <label>Tagline</label>
              <textarea value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} />
            </div>
            <div className="form-field form-field-wide">
              <label>Stat callouts (JSON array of {"{value, label}"})</label>
              <textarea
                value={form.stat_callouts_json}
                onChange={(e) => setForm((f) => ({ ...f, stat_callouts_json: e.target.value }))}
                style={{ fontFamily: "monospace", minHeight: 110 }}
              />
              <span className="form-hint">The last entry renders as the "total" stat — see components/proposal/InvestmentSection.js.</span>
            </div>
            <div className="form-field form-field-wide">
              <label>Feature groups (JSON array of {"{group_label, items: [text]}"})</label>
              <textarea
                value={form.feature_groups_json}
                onChange={(e) => setForm((f) => ({ ...f, feature_groups_json: e.target.value }))}
                style={{ fontFamily: "monospace", minHeight: 160 }}
              />
            </div>
            <div className="form-field form-field-wide">
              <label>Monthly deliverables (JSON array of {"{title, description}"})</label>
              <textarea
                value={form.monthly_deliverables_json}
                onChange={(e) => setForm((f) => ({ ...f, monthly_deliverables_json: e.target.value }))}
                style={{ fontFamily: "monospace", minHeight: 130 }}
              />
              <span className="form-hint">Powers the "Monthly Deliverables" block in the proposal — shows whichever package is recommended, so keep these accurate per tier.</span>
            </div>
          </div>
          <label className="checkbox-field">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            Active (selectable on new proposals)
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-primary inline">Save</button>
            <button type="button" className="btn-secondary" onClick={cancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="page-actions">
          <button className="btn-primary inline" onClick={startNew}>Add package</button>
        </div>
      )}

      <div className="soft-card">
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No packages yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Price</th><th>Badge</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${Number(item.monthly_price).toLocaleString("en-US")}/mo</td>
                  <td>{item.badge_label}</td>
                  <td><span className={`status-pill ${item.active ? "accepted" : "draft"}`}>{item.active ? "Active" : "Inactive"}</span></td>
                  <td>
                    <button className="link-toggle" onClick={() => startEdit(item)}>Edit</button>{" "}
                    <button className="link-toggle" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
