-- Tracks active time-on-page per client visit. Populated by a client-side
-- beacon on the public view page (see components/proposal/ViewDurationTracker.js
-- and app/api/public/view-duration/route.js), not at insert time — the
-- "viewed" row is created synchronously on page load, before any duration
-- is known.

alter table proposal_events
  add column duration_seconds integer;
