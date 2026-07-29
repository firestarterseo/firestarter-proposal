"use client";

import { useState } from "react";

export default function Disclosure({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          padding: 0, cursor: "pointer", font: "inherit", color: "var(--muted)", fontSize: 12,
          fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
          marginTop: 16, marginBottom: open ? 12 : 0,
        }}
      >
        <span style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s", display: "inline-block", fontSize: 10 }}>
          &#9656;
        </span>
        {label}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
