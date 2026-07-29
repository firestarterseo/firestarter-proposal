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
      last.durationSeconds += ev.duration_seconds || 0;
    } else {
      groups.push({
        eventType: ev.event_type,
        actorName: ev.actor_name,
        firstAt: ev.created_at,
        lastAt: ev.created_at,
        count: 1,
        ips: new Set([ev.ip_address || "unknown"]),
        durationSeconds: ev.duration_seconds || 0,
      });
    }
  }

  return groups.reverse();
}

export function summarizeVisits(groups) {
  const visits = groups.filter((g) => g.eventType === "viewed");
  // Visits from before duration tracking existed report 0 — excluded from
  // the average rather than counted as "0s" so old proposals don't read as
  // if the client blew straight past the document.
  const timedVisits = visits.filter((v) => v.durationSeconds > 0);
  const avgDurationSeconds = timedVisits.length
    ? Math.round(timedVisits.reduce((sum, v) => sum + v.durationSeconds, 0) / timedVisits.length)
    : null;
  return {
    visitCount: visits.length,
    firstVisit: visits.length ? visits[visits.length - 1].firstAt : null,
    lastActivity: groups.length ? groups[0].lastAt : null,
    avgDurationSeconds,
  };
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 1) return null;
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  return remSeconds ? `${minutes}m ${remSeconds}s` : `${minutes}m`;
}

export function formatRelativeTime(iso) {
  if (!iso) return null;
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
}

// One plain-English sentence, meant to replace the raw event log as the
// headline — "how many times, over how long, how recently" is the actual
// question a rep has, not a list of individual page-load timestamps.
export function describeEngagement({ visitCount, firstVisit, lastActivity, avgDurationSeconds, contactName }) {
  if (!visitCount) return null;
  const name = contactName?.trim() || "The client";
  const recently = formatRelativeTime(lastActivity);
  const avgClause = avgDurationSeconds ? `, averaging ${formatDuration(avgDurationSeconds)} per visit` : "";

  if (visitCount === 1) {
    return `${name} opened this once, ${recently}${avgClause}.`;
  }

  const spanDays = Math.round((new Date(lastActivity) - new Date(firstVisit)) / 86400000);
  const spanClause = spanDays >= 1 ? `over ${spanDays} day${spanDays === 1 ? "" : "s"}` : "in one day";
  return `${name} opened this ${visitCount} times ${spanClause}, most recently ${recently}${avgClause}.`;
}

// One line per grouped event, in the style of "{who} {did what}" rather than
// a bare event-type + count — matches how every mainstream proposal tool
// (Proposify, PandaDoc, etc.) phrases its activity feed, and is the format
// the sales rep specifically asked to match.
export function describeEventGroup(group, { contactName } = {}) {
  const name = contactName?.trim() || "The client";
  const total = formatDuration(group.durationSeconds);

  switch (group.eventType) {
    case "viewed":
      if (group.count === 1) return total ? `${name} viewed the proposal for ${total}` : `${name} viewed the proposal`;
      return total ? `${name} viewed the proposal ${group.count} times, totaling ${total}` : `${name} viewed the proposal ${group.count} times`;
    case "sent":
      return group.count > 1 ? `You sent the proposal ${group.count} times` : "You sent the proposal";
    case "edited":
      return group.count > 1 ? `${group.actorName || "You"} edited the proposal ${group.count} times` : `${group.actorName || "You"} edited the proposal`;
    case "accepted":
      return `${name} signed the proposal`;
    case "declined":
      return `${name} declined the proposal`;
    default:
      return group.count > 1 ? `${group.eventType} ×${group.count}` : group.eventType;
  }
}
