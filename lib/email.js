// Sends the client-facing proposal link via Resend (https://resend.com).
// Requires two env vars in Vercel -> Project -> Settings -> Environment Variables:
//   RESEND_API_KEY        - the Resend API key
//   PROPOSALS_FROM_EMAIL  - must be on a domain verified in Resend, e.g. proposals@firestarterseo.com
export async function sendProposalEmail(proposal, shareUrl) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.PROPOSALS_FROM_EMAIL;

  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not set." };
  if (!fromEmail) return { sent: false, reason: "PROPOSALS_FROM_EMAIL is not set." };
  if (!proposal.client_email) return { sent: false, reason: "This proposal has no client email address." };

  const html = `
    <div style="font-family:-apple-system,Arial,sans-serif;color:#1d1525;max-width:560px;">
      <p style="margin:0 0 4px;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Firestarter SEO</p>
      <h2 style="margin:0 0 16px;">Your search visibility proposal is ready</h2>
      <p style="margin:0 0 20px;line-height:1.6;">
        Hi${proposal.client_contact_name ? ` ${proposal.client_contact_name}` : ""}, we've put together a proposal
        for ${proposal.client_company_name}. Take a look and let us know if you have any questions.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${shareUrl}" style="display:inline-block;background:#f27f30;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          View your proposal
        </a>
      </p>
      <p style="font-size:12px;color:#888;">This link is unique to you — no account or login needed.</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [proposal.client_email],
      subject: `Your search visibility proposal from Firestarter SEO`,
      html,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { sent: false, reason: data.message || `Resend request failed (${res.status})` };
  }

  const data = await res.json();
  return { sent: true, id: data.id };
}
