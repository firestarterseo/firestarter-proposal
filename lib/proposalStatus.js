// Single source of truth for which status transitions are valid, used by the
// authenticated /send route and the public accept/decline routes so the
// state machine can't be bypassed from either surface.
export const ALLOWED_TRANSITIONS = {
  send: ["draft", "sent", "viewed"], // re-sending after a bounce/edit is fine
  view: ["sent"], // draft->viewed shouldn't happen (can't view before sending); already-viewed is a no-op, handled separately
  accept: ["sent", "viewed"],
  decline: ["sent", "viewed"],
};
