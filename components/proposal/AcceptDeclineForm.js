"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptDeclineForm({ token }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function submit(action) {
    setError("");
    if (action === "accept" && (!name.trim() || !agreed)) {
      setError("Please type your full name and check the box to accept.");
      return;
    }
    if (action === "decline" && !confirm("Decline this proposal? You can always reach out to Firestarter if you change your mind.")) {
      return;
    }
    setStatus(action === "accept" ? "accepting" : "declining");
    const res = await fetch(`/api/public/proposals/${token}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: action === "accept" ? JSON.stringify({ signerName: name.trim() }) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("idle");
      setError(data.error || "Something went wrong. Please refresh and try again.");
      return;
    }
    setStatus(action === "accept" ? "accepted" : "declined");
    router.refresh();
  }

  if (status === "accepted") {
    return (
      <div className="accept-block">
        <div className="accept-status">Accepted — thank you!</div>
        <p className="accept-sub" style={{ marginTop: 8 }}>Someone from Firestarter will be in touch shortly to get started.</p>
      </div>
    );
  }
  if (status === "declined") {
    return (
      <div className="accept-block">
        <div className="accept-status declined">Declined</div>
        <p className="accept-sub" style={{ marginTop: 8 }}>No worries — reach out any time if you'd like to revisit this.</p>
      </div>
    );
  }

  return (
    <div className="accept-block">
      <div className="accept-head">Ready to move forward?</div>
      <p className="accept-sub">Type your full name and check the box below to accept this proposal.</p>
      <div className="accept-field">
        <label>Full name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
      </div>
      <label className="accept-checkbox">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        I agree to move forward with this proposal.
      </label>
      {error && <p className="accept-error">{error}</p>}
      <div className="accept-actions">
        <button className="btn-accept" onClick={() => submit("accept")} disabled={status === "accepting" || status === "declining"}>
          {status === "accepting" ? "Accepting…" : "Accept proposal"}
        </button>
        <button className="btn-decline" onClick={() => submit("decline")} disabled={status === "accepting" || status === "declining"}>
          {status === "declining" ? "Declining…" : "Decline"}
        </button>
      </div>
    </div>
  );
}
