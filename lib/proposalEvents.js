const GAP_MINUTES = 5;

// Raw proposal_events rows log one row per page load, so a client refreshing
// or re-opening the link within a few minutes shows up as several identical
// "viewed" rows in a row. Collapses consecutive same-type events within
// GAP_MINUTES of each other into one visit, so the audit trail reads as
// "visits" instead of raw page-load pings. Expects `events` ordered newest
// first (matches the query in app/proposals/[id]/page.js) and returns groups
// in that same newest-first order.
export function groupProposalEvents(events) {
  const chronological = [...events].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const groups = [];

  for (const ev of chronological) {
    const last = groups[groups.length - 1];
    const withinGap = last && (new Date(ev.created_at) - new Date(last.lastAt)) <= GAP_MINUTES * 60 * 1000;
    if (last && last.eventType === ev.event_type && withinGap) {
      last.count += 1;
      last.lastAt = ev.created_at;
      last.ips.add(ev.ip_address || "unknown");
    } else {
      groups.push({
        eventType: ev.event_type,
        actorName: ev.actor_name,
        firstAt: ev.created_at,
        lastAt: ev.created_at,
        count: 1,
        ips: new Set([ev.ip_address || "unknown"]),
      });
    }
  }

  return groups.reverse();
}

export function summarizeVisits(groups) {
  const visits = groups.filter((g) => g.eventType === "viewed");
  return {
    visitCount: visits.length,
    firstVisit: visits.length ? visits[visits.length - 1].firstAt : null,
    lastActivity: groups.length ? groups[0].lastAt : null,
  };
}
