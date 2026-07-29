const WIDTH = 760;
const HEIGHT = 220;
const PAD_LEFT = 30;
const PAD_RIGHT = 34;
const PAD_TOP = 16;
const PAD_BOTTOM = 26;

// Rounds up to a "clean" axis max (1/2/5 × 10^n) rather than the raw max
// value, so gridline labels read as 0/5/10 instead of 0/3.4/6.8.
function niceMax(value) {
  if (value <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 2, 5, 10]) {
    if (value <= step * pow) return step * pow;
  }
  return 10 * pow;
}

export default function ProposalTrendChart({ months, series }) {
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const maxVal = niceMax(Math.max(1, ...series.flatMap((s) => s.data)));
  const xFor = (i) => PAD_LEFT + (months.length > 1 ? (i / (months.length - 1)) * plotW : plotW / 2);
  const yFor = (v) => PAD_TOP + plotH - (v / maxVal) * plotH;
  const yTicks = [0, 0.5, 1].map((f) => Math.round(maxVal * f));

  return (
    <div>
      <div style={{ display: "flex", gap: 18, marginBottom: 14, flexWrap: "wrap" }}>
        {series.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: "inline-block", flexShrink: 0 }} />
            {s.label}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="img" aria-label="Proposal trend by month">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={yFor(t)} y2={yFor(t)} stroke="var(--border)" strokeWidth="1" />
            <text x={PAD_LEFT - 8} y={yFor(t) + 3} textAnchor="end" fontSize="10" fill="var(--muted)">{t}</text>
          </g>
        ))}
        {months.map((m, i) => (
          (i === 0 || i === months.length - 1 || i % 2 === 0) && (
            <text key={m.key} x={xFor(i)} y={HEIGHT - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{m.label}</text>
          )
        ))}
        {series.map((s) => {
          const points = s.data.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
          const lastIdx = s.data.length - 1;
          const lastX = xFor(lastIdx);
          const lastY = yFor(s.data[lastIdx]);
          return (
            <g key={s.key}>
              <polyline points={points} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={lastX} cy={lastY} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2">
                <title>{`${s.label}: ${s.data[lastIdx]}`}</title>
              </circle>
              <text x={lastX + 8} y={lastY + 4} fontSize="11" fontWeight="700" fill="var(--text)">{s.data[lastIdx]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
