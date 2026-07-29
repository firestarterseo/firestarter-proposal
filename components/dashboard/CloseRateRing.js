const SIZE = 88;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CloseRateRing({ percent }) {
  const filled = percent === null ? 0 : (percent / 100) * CIRCUMFERENCE;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Close rate">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--success)" strokeWidth={STROKE}
          strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`} strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="700" fill="var(--text)">
          {percent === null ? "—" : `${percent}%`}
        </text>
      </svg>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Close rate</div>
    </div>
  );
}
