"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { INDUSTRY_CATEGORIES, SERVICE_CATEGORIES } from "../../lib/caseStudyCategories";

const BLANK = { industry_label: "", industry_category: "", service_category: "", stat_number: "", stat_label: "", company_note: "", sort_order: 0, active: true };

export default function CaseStudiesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("case_studies").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      industry_label: item.industry_label,
      industry_category: item.industry_category || "",
      service_category: item.service_category || "",
      stat_number: item.stat_number,
      stat_label: item.stat_label,
      company_note: item.company_note,
      sort_order: item.sort_order,
      active: item.active,
    });
  }

  function startNew() {
    setEditingId("new");
    setForm({ ...BLANK, sort_order: items.length });
  }

  function cancel() {
    setEditingId(null);
    setForm(BLANK);
    setError("");
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    const supabase = createClient();
    const payload = {
      industry_label: form.industry_label.trim(),
      industry_category: form.industry_category,
      service_category: form.service_category,
      stat_number: form.stat_number.trim(),
      stat_label: form.stat_label.trim(),
      company_note: form.company_note.trim(),
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
    };
    if (!payload.industry_label || !payload.stat_number || !payload.stat_label) {
      setError("Industry, stat number, and stat label are required.");
      return;
    }
    const { error: err } =
      editingId === "new"
        ? await supabase.from("case_studies").insert(payload)
        : await supabase.from("case_studies").update(payload).eq("id", editingId);
    if (err) {
      setError(err.message);
      return;
    }
    cancel();
    load();
  }

  async function remove(id) {
    const supabase = createClient();
    await supabase.from("case_studies").delete().eq("id", id);
    load();
  }

  return (
    <div>
      {editingId ? (
        <form className="form-card" onSubmit={save} style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div className="form-field">
              <label>Industry / market label</label>
              <input type="text" value={form.industry_label} onChange={(e) => setForm((f) => ({ ...f, industry_label: e.target.value }))} placeholder="e.g. Home Services · Denver" />
            </div>
            <div className="form-field">
              <label>Sort order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Industry category (for filtering)</label>
              <select value={form.industry_category} onChange={(e) => setForm((f) => ({ ...f, industry_category: e.target.value }))}>
                <option value="">&mdash;</option>
                {INDUSTRY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Service type (for filtering)</label>
              <select value={form.service_category} onChange={(e) => setForm((f) => ({ ...f, service_category: e.target.value }))}>
                <option value="">&mdash;</option>
                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Stat number</label>
              <input type="text" value={form.stat_number} onChange={(e) => setForm((f) => ({ ...f, stat_number: e.target.value }))} placeholder="e.g. 1,097%" />
            </div>
            <div className="form-field">
              <label>Stat label</label>
              <input type="text" value={form.stat_label} onChange={(e) => setForm((f) => ({ ...f, stat_label: e.target.value }))} placeholder="e.g. Increase in targeted website traffic" />
            </div>
            <div className="form-field form-field-wide">
              <label>Company note</label>
              <input type="text" value={form.company_note} onChange={(e) => setForm((f) => ({ ...f, company_note: e.target.value }))} placeholder="e.g. JDI Windows · $1.9M revenue increase" />
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
          <button className="btn-primary inline" onClick={startNew}>Add case study</button>
        </div>
      )}

      <div className="soft-card">
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No case studies yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Industry</th><th>Stat</th><th>Company</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.industry_label}</td>
                  <td>{item.stat_number} &mdash; {item.stat_label}</td>
                  <td>{item.company_note}</td>
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
