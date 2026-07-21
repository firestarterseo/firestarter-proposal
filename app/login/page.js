"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }
    setStatus("sent");
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setStatus("verifying");
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) {
      setStatus("sent");
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <img src="/firestarter-logo.webp" alt="Firestarter SEO" className="brand-logo" />
        <p>Proposals — team sign in</p>
        {status === "sent" || status === "verifying" ? (
          <>
            <p className="login-note">
              Check <strong>{email}</strong> for a sign-in link — or enter the 6-digit code from that email below.
            </p>
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="btn-primary" type="submit" disabled={status === "verifying"}>
                {status === "verifying" ? "Verifying…" : "Verify code"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@firestarterseo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn-primary" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending link…" : "Send sign-in link"}
            </button>
          </form>
        )}
        {error && <p className="login-error">{error}</p>}
        {status !== "sent" && status !== "verifying" && email && (
          <button
            type="button"
            className="link-toggle"
            style={{ marginTop: 12 }}
            onClick={() => { setStatus("sent"); setError(""); }}
          >
            Already have a code? Enter it instead
          </button>
        )}
        <p className="login-note">
          New team member? Ask an admin to invite you from the Supabase dashboard first —
          this app doesn't have open self-signup.
        </p>
      </div>
    </div>
  );
}
