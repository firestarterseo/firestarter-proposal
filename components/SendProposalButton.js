"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendProposalButton({ proposalId, status, clientEmail }) {
  const router = useRouter();
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const alreadySent = status !== "draft";

  async function handleSend() {
    if (!confirm(`Send this proposal to ${clientEmail}?`)) return;
    setState("sending");
    setError("");
    const res = await fetch(`/api/proposals/${proposalId}/send`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState("error");
      setError(data.error || "Failed to send.");
      return;
    }
    setState("sent");
    router.refresh();
  }

  return (
    <div style={{ textAlign: "right" }}>
      <button className="btn-primary inline" onClick={handleSend} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : alreadySent ? "Re-send" : "Send to client"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
