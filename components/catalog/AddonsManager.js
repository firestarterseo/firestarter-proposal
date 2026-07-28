"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const BLANK = { name: "", description: "", price_amount: "", price_unit: "/mo", price_note: "", category: "addon", sort_order: 0, active: true, pricing_options_json: "" };

export default function AddonsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("addon_items").select("*").order("category").order("sort_order");
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
      description: item.description || "",
      price_amount: item.price_amount,
      price_unit: item.price_unit,
      price_note: item.price_note || "",
      category: item.category,
      sort_order: item.sort_order,
      active: item.active,
      pricing_options_json: item.pricing_options ? JSON.stringify(item.pricing_options, null, 2) : "",
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

    let pricingOptions = null;
    if (form.pricing_options_json.trim()) {
      try {
        pricingOptions = JSON.parse(form.pricing_options_json);
      } catch (parseErr) {
        setError(`Pricing options must be valid JSON: ${parseErr.message}`);
        return;
      }
    }

    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price_amount: Number(form.price_amount),
      price_unit: form.price_unit.trim() || "/mo",
      price_note: form.price_note.trim(),
      category: form.category,
      sort_order: Number(form.sort_order) || 0,
      active: form.active,
      pricing_options: pricingOptions,
    };
    if (!payload.name || Number.isNaN(payload.price_amount)) {
      setError("Name and a numeric price are required.");
      return;
    }
    const { error: err } =
      editingId === "new"
        ? await supabase.from("addon_items").insert(payload)
        : await supabase.from("addon_items").update(payload).eq("id", editingId);
    if (err) {
      setError(err.message);
      return;
    }
    cancel();
    load();
  }

  async function remove(id) {
    const supabase = createClient();
    await supabase.from("addon_items").delete().eq("id", id);
    load();
  }

  return (
    <div>
      {editingId ? (
        <form className="form-card" onSubmit={save} style={{ marginBottom: 20 }}>
          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Additional Guest Post (DA 40+)" />
            </div>
            <div className="form-field form-field-wide">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="addon">Add-on (recurring stack)</option>
                <option value="one_time_fee">One-time fee</option>
              </select>
            </div>
            <div className="form-field">
              <label>Sort order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Price amount</label>
              <input type="number" step="0.01" value={form.price_amount} onChange={(e) => setForm((f) => ({ ...f, price_amount: e.target.value }))} placeholder="e.g. 350" />
            </div>
            <div className="form-field">
              <label>Price unit</label>
              <input type="text" value={form.price_unit} onChange={(e) => setForm((f) => ({ ...f, price_unit: e.target.value }))} placeholder="/mo, one-time, % of spend" />
            </div>
            <div className="form-field form-field-wide">
              <label>Price note (optional)</label>
              <input type="text" value={form.price_note} onChange={(e) => setForm((f) => ({ ...f, price_note: e.target.value }))} placeholder="e.g. $750 min/mo" />
            </div>
            <div className="form-field form-field-wide">
              <label>Pricing options (optional — JSON array of {"{label, price_amount, price_unit, price_note}"})</label>
              <textarea
                value={form.pricing_options_json}
                onChange={(e) => setForm((f) => ({ ...f, pricing_options_json: e.target.value }))}
                placeholder={'[\n  {"label": "20% of spend", "price_amount": 20, "price_unit": "% of spend", "price_note": "$750 min/mo"},\n  {"label": "Flat monthly fee", "price_amount": 1500, "price_unit": "/mo", "price_note": ""}\n]'}
                style={{ fontFamily: "monospace", minHeight: 110 }}
              />
              <span className="form-hint">Leave blank for a normal single-price add-on. When filled in, staff pick one option per proposal instead of using the price fields above.</span>
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
          <button className="btn-primary inline" onClick={startNew}>Add item</button>
        </div>
      )}

      <div className="soft-card">
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : items.length === 0 ? (
          <div className="empty-state">No add-ons yet.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category === "one_time_fee" ? "One-time fee" : "Add-on"}</td>
                  <td>${Number(item.price_amount).toLocaleString("en-US")} {item.price_unit}{item.price_note ? ` (${item.price_note})` : ""}</td>
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
