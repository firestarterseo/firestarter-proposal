"use client";

import { useEffect, useRef } from "react";

// Tracks time the client actually has this tab visible (paused while
// backgrounded, not just "tab open"), then reports the total once via
// sendBeacon so it still lands during tab close. Renders nothing —
// eventId is the id of the "viewed" row this visit already inserted
// server-side (see app/view/[token]/page.js); null on decided proposals,
// where no such row gets created.
export default function ViewDurationTracker({ eventId }) {
  const sentRef = useRef(false);
  const visibleSinceRef = useRef(null);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!eventId) return;
    visibleSinceRef.current = document.visibilityState === "visible" ? Date.now() : null;

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        if (visibleSinceRef.current) {
          accumulatedRef.current += Date.now() - visibleSinceRef.current;
          visibleSinceRef.current = null;
        }
      } else {
        visibleSinceRef.current = Date.now();
      }
    }

    function send() {
      if (sentRef.current) return;
      if (visibleSinceRef.current) {
        accumulatedRef.current += Date.now() - visibleSinceRef.current;
        visibleSinceRef.current = null;
      }
      const seconds = Math.round(accumulatedRef.current / 1000);
      if (seconds < 1) return;
      sentRef.current = true;
      const payload = JSON.stringify({ eventId, durationSeconds: seconds });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/public/view-duration", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/public/view-duration", { method: "POST", body: payload, keepalive: true });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", send);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", send);
    };
  }, [eventId]);

  return null;
}
