"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { CHANNEL_DEFAULTS, TIMELINE_DEFAULTS } from "../lib/proposalMapping";
import { generateShareToken } from "../lib/tokens";
import ChannelCardEditor from "./proposal/editor/ChannelCardEditor";
import ProposalDocument from "./proposal/ProposalDocument";

function blankForm() {
  return {
    clientCompanyName: "", clientContactName: "", clientEmail: "", preparedBy: "",
    servicesSummary: "", subtitle: "", heroEmphasisWord: "",
    introText: "", landscapePullQuote: "",
    channelCards: CHANNEL_DEFAULTS.map((c) => ({ ...c, rows: c.rows.map((r) => ({ ...r })) })),
    landscapeStats: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }],
    keywordLedger: [],
    gapPullQuote: "",
    authorityYourDr: "", authorityYourStat: "", authorityOpenDoorNote: "",
    competitors: [],
    sourceCalloutBullets: [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }],
    authorityPullQuote: "",
    timelineStages: TIMELINE_DEFAULTS.map((t) => ({ ...t })),
    selectedCaseStudyIds: [],
    selectedPackageIds: [], recommendedPackageId: "",
    selectedAddonIds: [],
  };
}

function rowAdd(list, blank) {
  return [...list, blank];
}
function rowUpdate(list, i, patch) {
  return list.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
}
function rowRemove(list, i) {
  return list.filter((_, idx) => idx !== i);
}

export default function ProposalForm({ initialProposal, initialPackageIds, initialAddonIds, initialRecommendedPackageId }) {
  const router = useRouter();
  const isEdit = Boolean(initialProposal);

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          clientCompanyName: initialProposal.client_company_name || "",
          clientContactName: initialProposal.client_contact_name || "",
          clientEmail: initialProposal.client_email || "",
          preparedBy: initialProposal.prepared_by || "",
          servicesSummary: initialProposal.services_summary || "",
          subtitle: initialProposal.subtitle || "",
          heroEmphasisWord: initialProposal.hero_emphasis_word || "",
          introText: initialProposal.intro_text || "",
          landscapePullQuote: initialProposal.landscape_pull_quote || "",
          channelCards: initialProposal.channel_cards?.length ? initialProposal.channel_cards : blankForm().channelCards,
          landscapeStats: initialProposal.landscape_stats?.length ? initialProposal.landscape_stats : blankForm().landscapeStats,
          keywordLedger: initialProposal.keyword_ledger || [],
          gapPullQuote: initialProposal.gap_pull_quote || "",
          authorityYourDr: initialProposal.authority_your_dr ?? "",
          authorityYourStat: initialProposal.authority_your_stat || "",
          authorityOpenDoorNote: initialProposal.authority_open_door_note || "",
          competitors: initialProposal.competitors || [],
          sourceCalloutBullets: initialProposal.source_callout_bullets?.length ? initialProposal.source_callout_bullets : blankForm().sourceCalloutBullets,
          authorityPullQuote: initialProposal.authority_pull_quote || "",
          timelineStages: initialProposal.timeline_stages?.length ? initialProposal.timeline_stages : blankForm().timelineStages,
          selectedCaseStudyIds: initialProposal.selected_case_study_ids || [],
          selectedPackageIds: initialPackageIds || [],
          recommendedPackageId: initialRecommendedPackageId || "",
          selectedAddonIds: initialAddonIds || [],
        }
      : blankForm()
  );
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("service_packages").select("*").eq("active", true).order("sort_order").then(({ data }) => setPackages(data || []));
    supabase.from("addon_items").select("*").eq("active", true).order("category").order("sort_order").then(({ data }) => setAddons(data || []));
    supabase.from("case_studies").select("*").eq("active", true).order("sort_order").then(({ data }) => setCaseStudies(data || []));
    if (!isEdit) {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;
        const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
        if (profile?.display_name) {
          setForm((f) => (f.preparedBy ? f : { ...f, preparedBy: profile.display_name }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function toggleId(key, id) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));
  }

  const previewData = useMemo(() => {
    const selectedPackages = packages
      .filter((p) => form.selectedPackageIds.includes(p.id))
      .map((p) => ({
        name: p.name, monthlyPrice: p.monthly_price, tagline: p.tagline, badgeLabel: p.badge_label,
        isRecommended: p.id === form.recommendedPackageId,
        statCallouts: p.stat_callouts || [],
        featureGroups: (p.feature_groups || []).map((g) => ({ groupLabel: g.group_label, items: g.items })),
      }));
    const selectedAddons = addons
      .filter((a) => form.selectedAddonIds.includes(a.id))
      .map((a) => ({ name: a.name, description: a.description, priceAmount: a.price_amount, priceUnit: a.price_unit, priceNote: a.price_note, category: a.category }));
    const selectedCaseStudies = caseStudies
      .filter((cs) => form.selectedCaseStudyIds.includes(cs.id))
      .map((cs) => ({ industryLabel: cs.industry_label, statNumber: cs.stat_number, statLabel: cs.stat_label, companyNote: cs.company_note }));

    return { ...form, packages: selectedPackages, addons: selectedAddons, caseStudies: selectedCaseStudies };
  }, [form, packages, addons, caseStudies]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.clientCompanyName.trim() || !form.clientEmail.trim()) {
      setError("Client company name and email are required.");
      return;
    }
    setStatus("saving");
    setError("");

    const supabase = createClient();
    const payload = {
      client_company_name: form.clientCompanyName.trim(),
      client_contact_name: form.clientContactName.trim(),
      client_email: form.clientEmail.trim(),
      prepared_by: form.preparedBy.trim(),
      services_summary: form.servicesSummary.trim(),
      subtitle: form.subtitle.trim(),
      hero_emphasis_word: form.heroEmphasisWord.trim(),
      intro_text: form.introText,
      landscape_pull_quote: form.landscapePullQuote,
      channel_cards: form.channelCards,
      landscape_stats: form.landscapeStats,
      keyword_ledger: form.keywordLedger,
      gap_pull_quote: form.gapPullQuote,
      authority_your_dr: form.authorityYourDr === "" ? null : Number(form.authorityYourDr),
      authority_your_stat: form.authorityYourStat,
      authority_open_door_note: form.authorityOpenDoorNote,
      competitors: form.competitors,
      source_callout_bullets: form.sourceCalloutBullets,
      authority_pull_quote: form.authorityPullQuote,
      timeline_stages: form.timelineStages,
      selected_case_study_ids: form.selectedCaseStudyIds,
    };

    let proposalId = initialProposal?.id;
    if (isEdit) {
      const { error: updateErr } = await supabase.from("proposals").update(payload).eq("id", proposalId);
      if (updateErr) {
        setStatus("error");
        setError(updateErr.message);
        return;
      }
      await supabase.from("proposal_packages").delete().eq("proposal_id", proposalId);
      await supabase.from("proposal_addons").delete().eq("proposal_id", proposalId);
    } else {
      const shareToken = generateShareToken();
      const { data, error: insertErr } = await supabase
        .from("proposals")
        .insert({ ...payload, share_token: shareToken })
        .select()
        .single();
      if (insertErr) {
        setStatus("error");
        setError(insertErr.message);
        return;
      }
      proposalId = data.id;
    }

    const packageRows = packages
      .filter((p) => form.selectedPackageIds.includes(p.id))
      .map((p, i) => ({
        proposal_id: proposalId, package_id: p.id, is_recommended: p.id === form.recommendedPackageId, sort_order: i,
        name: p.name, monthly_price: p.monthly_price, tagline: p.tagline, badge_label: p.badge_label,
        stat_callouts: p.stat_callouts, feature_groups: p.feature_groups,
      }));
    const addonRows = addons
      .filter((a) => form.selectedAddonIds.includes(a.id))
      .map((a, i) => ({
        proposal_id: proposalId, addon_id: a.id, category: a.category, sort_order: i,
        name: a.name, description: a.description, price_amount: a.price_amount, price_unit: a.price_unit, price_note: a.price_note,
      }));

    if (packageRows.length) await supabase.from("proposal_packages").insert(packageRows);
    if (addonRows.length) await supabase.from("proposal_addons").insert(addonRows);

    router.push(`/proposals/${proposalId}`);
    router.refresh();
  }

  return (
    <div className="editor-split">
      <div className="editor-pane">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Cover</h2>
          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label>Client company name *</label>
              <input type="text" value={form.clientCompanyName} onChange={(e) => update("clientCompanyName", e.target.value)} placeholder="e.g. Total Install Outdoor Living" required />
            </div>
            <div className="form-field">
              <label>Client contact name</label>
              <input type="text" value={form.clientContactName} onChange={(e) => update("clientContactName", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Client email *</label>
              <input type="email" value={form.clientEmail} onChange={(e) => update("clientEmail", e.target.value)} required />
            </div>
            <div className="form-field">
              <label>Prepared by</label>
              <input type="text" value={form.preparedBy} onChange={(e) => update("preparedBy", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Hero emphasis word</label>
              <input type="text" value={form.heroEmphasisWord} onChange={(e) => update("heroEmphasisWord", e.target.value)} placeholder="One word from the company name to highlight" />
            </div>
            <div className="form-field form-field-wide">
              <label>Services summary</label>
              <input type="text" value={form.servicesSummary} onChange={(e) => update("servicesSummary", e.target.value)} placeholder="Organic SEO · Local/Maps · AI Overviews · AEO/LLM · Google Ads" />
            </div>
            <div className="form-field form-field-wide">
              <label>Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} placeholder="Search Visibility Strategy · 2026" />
            </div>
          </div>

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>01 — Landscape</h2>
          <div className="form-field form-field-wide">
            <label>Intro text</label>
            <textarea value={form.introText} onChange={(e) => update("introText", e.target.value)} />
          </div>
          <div className="form-field form-field-wide">
            <label>Pull quote (supports &lt;strong&gt;)</label>
            <textarea value={form.landscapePullQuote} onChange={(e) => update("landscapePullQuote", e.target.value)} />
          </div>

          <div style={{ margin: "16px 0" }}>
            {form.channelCards.map((channel, i) => (
              <ChannelCardEditor key={channel.key} channel={channel} onChange={(next) => update("channelCards", rowUpdate(form.channelCards, i, next))} />
            ))}
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {form.landscapeStats.map((stat, i) => (
              <div className="form-field" key={i}>
                <label>Summary stat {i + 1}</label>
                <input type="text" placeholder="Value, e.g. 1 of 5" value={stat.value} onChange={(e) => update("landscapeStats", rowUpdate(form.landscapeStats, i, { value: e.target.value }))} style={{ marginBottom: 6 }} />
                <input type="text" placeholder="Label" value={stat.label} onChange={(e) => update("landscapeStats", rowUpdate(form.landscapeStats, i, { label: e.target.value }))} />
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>02 — Gap Analysis</h2>
          <div className="form-field form-field-wide">
            <label>Keyword ledger</label>
            {form.keywordLedger.map((row, i) => (
              <div className="form-card" key={i} style={{ padding: 12, marginBottom: 8 }}>
                <input type="text" placeholder="Keyword" value={row.keyword} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { keyword: e.target.value }))} style={{ width: "100%", marginBottom: 6 }} />
                <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 6 }}>
                  <input type="text" placeholder="Rank, e.g. Not ranked" value={row.rankBadge} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { rankBadge: e.target.value }))} />
                  <select value={row.severity} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { severity: e.target.value }))}>
                    <option value="bad">Bad</option><option value="mid">Mid</option><option value="good">Good</option>
                  </select>
                </div>
                <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 6 }}>
                  <input type="number" placeholder="Searches/mo" value={row.searches} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { searches: e.target.value }))} />
                  <input type="text" placeholder="Priority" value={row.priority} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { priority: e.target.value }))} />
                </div>
                <button type="button" className="link-toggle" onClick={() => update("keywordLedger", rowRemove(form.keywordLedger, i))}>Remove</button>
              </div>
            ))}
            <button type="button" className="link-toggle" onClick={() => update("keywordLedger", rowAdd(form.keywordLedger, { keyword: "", rankBadge: "Not ranked", severity: "bad", searches: "", priority: "" }))}>+ Add keyword</button>
          </div>

          <div className="form-field form-field-wide">
            <label>Content-signal pull quote</label>
            <textarea value={form.gapPullQuote} onChange={(e) => update("gapPullQuote", e.target.value)} />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Your domain rating (DR)</label>
              <input type="number" value={form.authorityYourDr} onChange={(e) => update("authorityYourDr", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Your authority stat</label>
              <input type="text" value={form.authorityYourStat} onChange={(e) => update("authorityYourStat", e.target.value)} placeholder="40 total links · 111 referring domains" />
            </div>
            <div className="form-field form-field-wide">
              <label>"Open door" note</label>
              <textarea value={form.authorityOpenDoorNote} onChange={(e) => update("authorityOpenDoorNote", e.target.value)} />
            </div>
          </div>

          <div className="form-field form-field-wide">
            <label>Competitors</label>
            {form.competitors.map((c, i) => (
              <div className="form-card" key={i} style={{ padding: 12, marginBottom: 8 }}>
                <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 6 }}>
                  <input type="text" placeholder="Name" value={c.name} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { name: e.target.value }))} />
                  <input type="number" placeholder="DR" value={c.dr} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { dr: e.target.value }))} />
                </div>
                <input type="text" placeholder="Stat, e.g. 103 links · 237 domains" value={c.stat} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { stat: e.target.value }))} style={{ width: "100%", marginBottom: 6 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="checkbox-field" style={{ margin: 0 }}><input type="checkbox" checked={!!c.alert} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { alert: e.target.checked }))} /> Flag</label>
                  <button type="button" className="link-toggle" onClick={() => update("competitors", rowRemove(form.competitors, i))}>Remove</button>
                </div>
              </div>
            ))}
            <button type="button" className="link-toggle" onClick={() => update("competitors", rowAdd(form.competitors, { name: "", dr: "", stat: "", alert: false, note: "" }))}>+ Add competitor</button>
          </div>

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>SOURCE™ &amp; Authority</h2>
          <div className="form-field form-field-wide">
            <label>What SOURCE™ means for this client (4 bullets)</label>
            {form.sourceCalloutBullets.map((b, i) => (
              <div className="form-grid" key={i} style={{ gridTemplateColumns: "1fr 2fr", marginBottom: 6 }}>
                <input type="text" placeholder="Bullet title" value={b.title} onChange={(e) => update("sourceCalloutBullets", rowUpdate(form.sourceCalloutBullets, i, { title: e.target.value }))} />
                <input type="text" placeholder="Bullet text" value={b.text} onChange={(e) => update("sourceCalloutBullets", rowUpdate(form.sourceCalloutBullets, i, { text: e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="form-field form-field-wide">
            <label>Authority pull quote</label>
            <textarea value={form.authorityPullQuote} onChange={(e) => update("authorityPullQuote", e.target.value)} />
          </div>

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>05 — Timeline</h2>
          {form.timelineStages.map((stage, i) => (
            <div className="form-grid" key={i} style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 8 }}>
              <input type="text" placeholder="Period, e.g. Weeks 1–2" value={stage.period} onChange={(e) => update("timelineStages", rowUpdate(form.timelineStages, i, { period: e.target.value }))} />
              <input type="text" placeholder="Title" value={stage.title} onChange={(e) => update("timelineStages", rowUpdate(form.timelineStages, i, { title: e.target.value }))} />
              <textarea className="form-field-wide" placeholder="Description" value={stage.description} onChange={(e) => update("timelineStages", rowUpdate(form.timelineStages, i, { description: e.target.value }))} style={{ gridColumn: "1 / -1" }} />
            </div>
          ))}

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>Case studies</h2>
          {caseStudies.map((cs) => (
            <label className="checkbox-field" key={cs.id}>
              <input type="checkbox" checked={form.selectedCaseStudyIds.includes(cs.id)} onChange={() => toggleId("selectedCaseStudyIds", cs.id)} />
              {cs.industry_label} — {cs.stat_number} {cs.stat_label}
            </label>
          ))}

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>Packages</h2>
          {packages.map((p) => (
            <div key={p.id} style={{ marginBottom: 6 }}>
              <label className="checkbox-field" style={{ margin: 0 }}>
                <input type="checkbox" checked={form.selectedPackageIds.includes(p.id)} onChange={() => toggleId("selectedPackageIds", p.id)} />
                {p.name} — ${Number(p.monthly_price).toLocaleString("en-US")}/mo
              </label>
              {form.selectedPackageIds.includes(p.id) && (
                <label className="checkbox-field" style={{ marginLeft: 24, marginTop: 4 }}>
                  <input type="radio" name="recommendedPackage" checked={form.recommendedPackageId === p.id} onChange={() => update("recommendedPackageId", p.id)} />
                  Mark as recommended
                </label>
              )}
            </div>
          ))}

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em", margin: "24px 0 16px" }}>Add-ons &amp; one-time fees</h2>
          {addons.map((a) => (
            <label className="checkbox-field" key={a.id}>
              <input type="checkbox" checked={form.selectedAddonIds.includes(a.id)} onChange={() => toggleId("selectedAddonIds", a.id)} />
              {a.name} — ${Number(a.price_amount).toLocaleString("en-US")} {a.price_unit}
            </label>
          ))}

          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn-primary inline" disabled={status === "saving"}>
              {status === "saving" ? "Saving…" : isEdit ? "Save changes" : "Create proposal"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => router.push(isEdit ? `/proposals/${initialProposal.id}` : "/")}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="preview-pane">
        <ProposalDocument data={previewData} />
      </div>
    </div>
  );
}
