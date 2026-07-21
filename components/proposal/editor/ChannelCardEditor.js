"use client";

// One of the 5 fixed discovery-channel cards (see lib/proposalMapping.js
// CHANNEL_DEFAULTS for the fixed order/titles). Always exactly 4 stat rows,
// matching the ChannelDiagram SVG layout.

export default function ChannelCardEditor({ channel, onChange }) {
  function set(patch) {
    onChange({ ...channel, ...patch });
  }
  function setRow(i, patch) {
    const rows = channel.rows.map((r, ri) => (ri === i ? { ...r, ...patch } : r));
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
      {channel.rows.map((row, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Stat label, e.g. Keywords in top 100"
            value={row.label}
            onChange={(e) => setRow(i, { label: e.target.value })}
            style={{ width: "100%", marginBottom: 6 }}
          />
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <input type="text" placeholder="Value, e.g. 1 of 17" value={row.value} onChange={(e) => setRow(i, { value: e.target.value })} />
            <select value={row.severity} onChange={(e) => setRow(i, { severity: e.target.value })}>
              <option value="bad">Bad (red)</option>
              <option value="mid">Mid (amber)</option>
              <option value="good">Good (green)</option>
              <option value="neutral">Neutral (gray)</option>
            </select>
          </div>
        </div>
      ))}
      <div className="form-field form-field-wide" style={{ marginTop: 10 }}>
        <label>Strategy note (shown in the "What We Do" section)</label>
        <textarea value={channel.strategyNote} onChange={(e) => set({ strategyNote: e.target.value })} placeholder="e.g. Target: page 1 for “pergola Denver CO” (210/mo)…" />
      </div>
    </div>
  );
}
