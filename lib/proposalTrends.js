function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Trailing N-month buckets ending this month, for the dashboard trend chart.
// Built from whatever `now` the caller passes in (not read internally) so
// this stays pure and testable.
export function buildMonthlyTrend(proposals, now, monthsBack = 12) {
  const months = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleString("en-US", { month: "short" }) });
  }
  const monthIndex = Object.fromEntries(months.map((m, i) => [m.key, i]));

  const created = new Array(months.length).fill(0);
  const won = new Array(months.length).fill(0);
  const lost = new Array(months.length).fill(0);

  for (const p of proposals) {
    const ci = monthIndex[monthKey(p.created_at)];
    if (ci !== undefined) created[ci] += 1;
    if (p.accepted_at) {
      const wi = monthIndex[monthKey(p.accepted_at)];
      if (wi !== undefined) won[wi] += 1;
    }
    if (p.declined_at) {
      const li = monthIndex[monthKey(p.declined_at)];
      if (li !== undefined) lost[li] += 1;
    }
  }

  return {
    months,
    series: [
      { key: "created", label: "Created", color: "#8b8592", data: created },
      { key: "won", label: "Won", color: "#22c55e", data: won },
      { key: "lost", label: "Lost", color: "#ef4b45", data: lost },
    ],
  };
}
