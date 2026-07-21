"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = ["all", "draft", "sent", "viewed", "accepted", "declined"];

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProposalsTable({ proposals }) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return proposals.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (query.trim() && !p.client_company_name.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [proposals, filter, query]);

  const counts = useMemo(() => {
    const c = { all: proposals.length, draft: 0, sent: 0, viewed: 0, accepted: 0, declined: 0 };
    proposals.forEach((p) => { c[p.status] = (c[p.status] || 0) + 1; });
    return c;
  }, [proposals]);

  return (
    <div>
      <div className="controls">
        <input type="text" placeholder="Search by client name…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {FILTERS.map((f) => (
          <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f} ({counts[f] || 0})
          </button>
        ))}
      </div>

      <div className="soft-card">
        {filtered.length === 0 ? (
          <div className="empty-state">No proposals match.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Client</th><th>Status</th><th>Created</th><th>Sent</th><th>Accepted</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="clickable" onClick={() => router.push(`/proposals/${p.id}`)}>
                  <td>{p.client_company_name}</td>
                  <td><span className={`status-pill ${p.status}`}>{p.status}</span></td>
                  <td>{fmtDate(p.created_at)}</td>
                  <td>{fmtDate(p.sent_at)}</td>
                  <td>{fmtDate(p.accepted_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
