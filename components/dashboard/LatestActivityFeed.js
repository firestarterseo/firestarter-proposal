import { describeEventGroup, formatRelativeTime } from "../../lib/proposalEvents";

// Cross-proposal feed (contrast with the per-proposal activity log in
// app/proposals/[id]/page.js, which groups repeat events into visits) — here
// each row is a single raw event, relative-timed, company name inline, so it
// reads like "Blake viewed the proposal Dental Solutions LLC · 2 hours ago".
export default function LatestActivityFeed({ events }) {
  if (!events.length) return null;

  return (
    <div className="soft-card" style={{ padding: "16px 20px", marginBottom: 20 }}>
      <div className="section-label">Latest activity</div>
      <ul className="audit-list">
        {events.map((ev) => (
          <li className="audit-item" key={ev.id}>
            <span>
              {describeEventGroup(
                { eventType: ev.event_type, count: 1, durationSeconds: ev.duration_seconds || 0, actorName: ev.actor_name },
                { contactName: ev.proposals?.client_contact_name, companyName: ev.proposals?.client_company_name }
              )}
            </span>
            <span className="audit-meta">{formatRelativeTime(ev.created_at)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
