-- ProposalForm.js now logs an "edited" event on every save so the activity
-- feed can say "You edited the proposal" (see lib/proposalEvents.js
-- describeEventGroup) — the original check constraint only allowed the
-- four client-facing lifecycle events and rejected this insert outright.

alter table proposal_events drop constraint proposal_events_event_type_check;
alter table proposal_events add constraint proposal_events_event_type_check
  check (event_type in ('sent', 'viewed', 'accepted', 'declined', 'edited'));
