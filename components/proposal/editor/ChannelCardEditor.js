"use client";

import { CHANNEL_ROW_CONFIG, deriveSeverity } from "../../../lib/proposalMapping";

// One of the 5 fixed discovery-channel cards (see lib/proposalMapping.js
// CHANNEL_DEFAULTS/CHANNEL_ROW_CONFIG for the fixed order/titles/labels).
// Always exactly 4 stat rows, matching the ChannelDiagram SVG layout. Row
// labels and input types are fixed per the sales rep's spec — only the
// value (and, for text rows, the severity) is ever entered per proposal.

export default function ChannelCardEditor({ channel, onChange }) {
  const rowConfig = CHANNEL_ROW_CONFIG[channel.key] || [];

  function set(patch) {
    onChange({ ...channel, ...patch });
  }
  function setRowValue(i, value) {
    const cfg = rowConfig[i];
    const rows = channel.rows.map((r, ri) => {
      if (ri !== i) return r;
      const severity = cfg.fieldType === "text" ? r.severity : deriveSeverity(cfg.fieldType, value, cfg.invertPolarity);
      return { ...r, value, severity };
    });
    onChange({ ...channel, rows });
  }
  function setRowSeverity(i, severity) {
    const rows = channel.rows.map((r, ri) => (ri === i ? { ...r, severity } : r));
    onChange({ ...channel, rows });
  }

  return (
    <div className="form-card" style={{ padding: 20, marginBottom: 14 }}>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{channel.title}</div>
      <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
        <div className="form-field">
          <label>Badge</label>
          <select value={channel.badgeVariant} onChange={(e) => {
            const variant = e.target.value;
            const defaults = { active: "PARTIAL", invisible: "INVISIBLE", not_running: "NOT RUNNING" };
            set({ badgeVariant: variant, badgeLabel: defaults[variant] });
          }}>
            <option value="invisible">Invisible</option>
            <option value="active">Partial / active</option>
            <option value="not_running">Not running</option>
          </select>
        </div>
        <div className="form-field">
          <label>Badge label</label>
          <input type="text" value={channel.badgeLabel} onChange={(e) => set({ badgeLabel: e.target.value })} />
        </div>
        <label className="checkbox-field form-field-wide" style={{ margin: 0 }}>
          <input type="checkbox" checked={channel.headerActive} onChange={(e) => set({ headerActive: e.target.checked })} />
          Highlight as active channel
        </label>
      </div>
      {channel.rows.map((row, i) => {
        const cfg = rowConfig[i] || { label: row.label, fieldType: "text" };
        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>{cfg.label}</div>
            {cfg.fieldType === "text" ? (
              <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <input type="text" placeholder="Value, e.g. 1 of 17" value={row.value} onChange={(e) => setRowValue(i, e.target.value)} />
                <select value={row.severity} onChange={(e) => setRowSeverity(i, e.target.value)}>
                  <option value="bad">Bad (red)</option>
                  <option value="mid">Mid (amber)</option>
                  <option value="good">Good (green)</option>
                  <option value="neutral">Neutral (gray)</option>
                </select>
              </div>
            ) : (
              <select value={row.value} onChange={(e) => setRowValue(i, e.target.value)} style={{ width: "100%" }}>
                <option value="">— Select —</option>
                <option value="Yes">Yes</option>
                {cfg.fieldType === "ynp" && <option value="Partial">Partial</option>}
                <option value="No">No</option>
              </select>
            )}
          </div>
        );
      })}
      <div className="form-field form-field-wide" style={{ marginTop: 10 }}>
        <label>Strategy note (shown in the "What We Do" section)</label>
        <textarea value={channel.strategyNote} onChange={(e) => set({ strategyNote: e.target.value })} placeholder="e.g. Target: page 1 for “pergola Denver CO” (210/mo)…" />
      </div>
    </div>
  );
}
