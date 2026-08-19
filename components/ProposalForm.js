"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { CHANNEL_DEFAULTS, buildLandscapeCopy, computeAgreementFinancials, computeLineItemFinancials } from "../lib/proposalMapping";
import { PROPOSAL_TYPE_OPTIONS, usesStrategyContent, usesLineItemInvestment, usesPpcContent } from "../lib/proposalTypes";
import { INDUSTRY_CATEGORIES, SERVICE_CATEGORIES } from "../lib/caseStudyCategories";
import { generateShareToken } from "../lib/tokens";
import ChannelCardEditor from "./proposal/editor/ChannelCardEditor";
import ProposalDocument from "./proposal/ProposalDocument";

function blankForm() {
  return {
    proposalType: "seo",
    clientCompanyName: "", clientContactName: "", clientAddress: "", clientEmail: "", preparedBy: "",
    servicesSummary: "", subtitle: "", heroEmphasisWord: "",
    industryLabel: "", targetCustomerLabel: "", targetKeywordExample: "",
    channelCards: CHANNEL_DEFAULTS.map((c) => ({ ...c, rows: c.rows.map((r) => ({ ...r })) })),
    landscapeStats: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }],
    keywordLedger: [],
    gapPullQuote: "",
    authorityYourDr: "", authorityYourReferringDomains: "", authorityOpenDoorNote: "",
    competitors: [],
    sourceCalloutBullets: [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }],
    authorityPullQuote: "",
    selectedCaseStudyIds: [],
    selectedPackageIds: [], recommendedPackageId: "",
    selectedAddonIds: [],
    // Freeform line-item pricing for General SOW / PPC-only / Website
    // proposals — see lib/proposalTypes.js and LineItemsInvestmentSection.js.
    lineItems: [],
    investmentRecommendation: "",
    discountLabel: "", discountAmount: "",
    // PPC-only / SEO+PPC content — see lib/proposalTypes.js usesPpcContent
    // and components/proposal/PpcStrategySection.js.
    ppcKeywords: [],
    ppcAvgCpc: "",
    ppcBudgetTiers: [],
  };
}

function blankLineItem() {
  return { description: "", priceAmount: "", priceUnit: "", qty: 1, group: "primary" };
}

function blankPpcKeyword() {
  return { keyword: "", searches: "" };
}

function blankPpcBudgetTier() {
  return { budget: "" };
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
function rowMove(list, i, delta) {
  const j = i + delta;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(i, 1);
  copy.splice(j, 0, item);
  return copy;
}
function rowMoveToTop(list, i) {
  if (i === 0) return list;
  const copy = [...list];
  const [item] = copy.splice(i, 1);
  copy.unshift(item);
  return copy;
}

// A catalog add-on's actual name/price/unit/note for this proposal, after
// applying a chosen pricing_options variant (e.g. Google Ads Management's
// tiers) and/or a per-proposal price override — used by both the live
// preview and the save payload so they can never disagree.
function getEffectiveAddonFields(addon, selectedOptions, priceOverrides) {
  let fields = {
    name: addon.name,
    description: addon.description,
    price_amount: addon.price_amount,
    price_unit: addon.price_unit,
    price_note: addon.price_note,
  };
  const options = addon.pricing_options;
  if (options && options.length) {
    const idx = selectedOptions[addon.id] ?? 0;
    const opt = options[idx] || options[0];
    fields = {
      name: `${addon.name} — ${opt.label}`,
      description: addon.description,
      price_amount: opt.price_amount,
      price_unit: opt.price_unit,
      price_note: opt.price_note || "",
    };
  }
  const override = priceOverrides[addon.id];
  if (override !== undefined && override !== "" && !Number.isNaN(Number(override))) {
    fields = { ...fields, price_amount: Number(override) };
  }
  return fields;
}

export default function ProposalForm({ initialProposal, initialPackageIds, initialAddonIds, initialRecommendedPackageId, initialAddonRows }) {
  const router = useRouter();
  const isEdit = Boolean(initialProposal);

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          proposalType: initialProposal.proposal_type || "seo",
          clientCompanyName: initialProposal.client_company_name || "",
          clientContactName: initialProposal.client_contact_name || "",
          clientAddress: initialProposal.client_address || "",
          clientEmail: initialProposal.client_email || "",
          preparedBy: initialProposal.prepared_by || "",
          servicesSummary: initialProposal.services_summary || "",
          subtitle: initialProposal.subtitle || "",
          heroEmphasisWord: initialProposal.hero_emphasis_word || "",
          industryLabel: initialProposal.industry_label || "",
          targetCustomerLabel: initialProposal.target_customer_label || "",
          targetKeywordExample: initialProposal.target_keyword_example || "",
          channelCards: initialProposal.channel_cards?.length ? initialProposal.channel_cards : blankForm().channelCards,
          landscapeStats: initialProposal.landscape_stats?.length ? initialProposal.landscape_stats : blankForm().landscapeStats,
          keywordLedger: initialProposal.keyword_ledger || [],
          gapPullQuote: initialProposal.gap_pull_quote || "",
          authorityYourDr: initialProposal.authority_your_dr ?? "",
          authorityYourReferringDomains: initialProposal.authority_your_referring_domains ?? "",
          authorityOpenDoorNote: initialProposal.authority_open_door_note || "",
          competitors: initialProposal.competitors || [],
          sourceCalloutBullets: initialProposal.source_callout_bullets?.length ? initialProposal.source_callout_bullets : blankForm().sourceCalloutBullets,
          authorityPullQuote: initialProposal.authority_pull_quote || "",
          selectedCaseStudyIds: initialProposal.selected_case_study_ids || [],
          selectedPackageIds: initialPackageIds || [],
          recommendedPackageId: initialRecommendedPackageId || "",
          selectedAddonIds: initialAddonIds || [],
          lineItems: (initialProposal.line_items || []).map((item) => ({
            description: item.description || "",
            priceAmount: item.price_amount ?? "",
            priceUnit: item.price_unit || "",
            qty: item.qty ?? 1,
            group: item.group || "primary",
          })),
          investmentRecommendation: initialProposal.investment_recommendation || "",
          discountLabel: initialProposal.discount_label || "",
          discountAmount: initialProposal.discount_amount ?? "",
          ppcKeywords: initialProposal.ppc_keywords || [],
          ppcAvgCpc: initialProposal.ppc_avg_cpc ?? "",
          ppcBudgetTiers: initialProposal.ppc_budget_tiers || [],
        }
      : blankForm()
  );
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [keywordPasteText, setKeywordPasteText] = useState("");
  const [csIndustryFilter, setCsIndustryFilter] = useState("");
  const [csServiceFilter, setCsServiceFilter] = useState("");
  // When editing an existing proposal, any previously-chosen add-on pricing
  // option or price override is restored below once the add-on catalog has
  // loaded (see the addon_items fetch), by comparing the saved
  // proposal_addons snapshot (name + price_amount) back against the current
  // catalog defaults.
  const [addonSelectedOptions, setAddonSelectedOptions] = useState({});
  const [addonPriceOverrides, setAddonPriceOverrides] = useState({});

  useEffect(() => {
    const supabase = createClient();
    supabase.from("service_packages").select("*").eq("active", true).order("sort_order").then(({ data }) => setPackages(data || []));
    supabase.from("addon_items").select("*").eq("active", true).order("category").order("sort_order").then(({ data }) => {
      setAddons(data || []);
      if (isEdit && initialAddonRows?.length) {
        const options = {};
        const overrides = {};
        (data || []).forEach((a) => {
          const saved = initialAddonRows.find((r) => r.addon_id === a.id);
          if (!saved) return;
          // Always restore the exact price this proposal was saved with —
          // even when it happens to match the current catalog default —
          // so the field never silently reverts to blank/placeholder on
          // reload. The catalog default can also drift after a proposal is
          // saved, so falling back to "only show it if it differs" would
          // mean re-opening an old proposal could show today's price
          // instead of the one the client actually agreed to.
          overrides[a.id] = String(saved.price_amount);
          if (a.pricing_options?.length) {
            const idx = a.pricing_options.findIndex((opt) => `${a.name} — ${opt.label}` === saved.name);
            if (idx >= 0) options[a.id] = idx;
          }
        });
        if (Object.keys(options).length) setAddonSelectedOptions((s) => ({ ...s, ...options }));
        if (Object.keys(overrides).length) setAddonPriceOverrides((s) => ({ ...s, ...overrides }));
      }
    });
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

  function parseKeywordPaste() {
    const lines = keywordPasteText.split("\n").map((l) => l.trim()).filter(Boolean);
    const newRows = lines
      .map((line) => {
        const cols = line.includes("\t") ? line.split("\t") : line.split(",");
        const keyword = (cols[0] || "").trim();
        const rank = (cols[1] || "").trim();
        const searches = (cols[2] || "").trim();
        const hasRank = rank && rank.toLowerCase() !== "not ranked" && rank !== "-";
        return { keyword, rankBadge: rank || "Not ranked", severity: hasRank ? "mid" : "bad", searches, priority: "" };
      })
      .filter((r) => r.keyword);
    if (newRows.length) {
      update("keywordLedger", [...form.keywordLedger, ...newRows]);
      setKeywordPasteText("");
    }
  }

  const previewData = useMemo(() => {
    const { introText, landscapePullQuote } = buildLandscapeCopy({
      industryLabel: form.industryLabel,
      targetCustomerLabel: form.targetCustomerLabel,
      targetKeywordExample: form.targetKeywordExample,
      clientCompanyName: form.clientCompanyName,
    });

    const selectedPackages = packages
      .filter((p) => form.selectedPackageIds.includes(p.id))
      .map((p) => ({
        name: p.name, monthlyPrice: p.monthly_price, tagline: p.tagline, badgeLabel: p.badge_label,
        isRecommended: p.id === form.recommendedPackageId,
        statCallouts: p.stat_callouts || [],
        featureGroups: (p.feature_groups || []).map((g) => ({ groupLabel: g.group_label, items: g.items })),
        monthlyDeliverables: p.monthly_deliverables || [],
      }));
    const selectedAddons = addons
      .filter((a) => form.selectedAddonIds.includes(a.id))
      .map((a) => {
        const fx = getEffectiveAddonFields(a, addonSelectedOptions, addonPriceOverrides);
        return { name: fx.name, description: fx.description, priceAmount: fx.price_amount, priceUnit: fx.price_unit, priceNote: fx.price_note, category: a.category };
      });
    const selectedCaseStudies = caseStudies
      .filter((cs) => form.selectedCaseStudyIds.includes(cs.id))
      .map((cs) => ({ industryLabel: cs.industry_label, statNumber: cs.stat_number, statLabel: cs.stat_label, companyNote: cs.company_note, url: cs.case_study_url }));

    return {
      ...form, introText, landscapePullQuote,
      packages: selectedPackages, addons: selectedAddons, caseStudies: selectedCaseStudies,
      acceptedAt: initialProposal?.accepted_at || null,
      agreementFinancials: usesLineItemInvestment(form.proposalType)
        ? computeLineItemFinancials(form.lineItems, form.discountAmount)
        : computeAgreementFinancials(selectedPackages, selectedAddons),
    };
  }, [form, packages, addons, caseStudies, addonSelectedOptions, addonPriceOverrides, initialProposal]);

  const visibleCaseStudies = caseStudies.filter((cs) =>
    form.selectedCaseStudyIds.includes(cs.id) ||
    ((!csIndustryFilter || cs.industry_category === csIndustryFilter) &&
      (!csServiceFilter || cs.service_category === csServiceFilter))
  );

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
      proposal_type: form.proposalType,
      client_company_name: form.clientCompanyName.trim(),
      client_contact_name: form.clientContactName.trim(),
      client_address: form.clientAddress.trim(),
      client_email: form.clientEmail.trim(),
      prepared_by: form.preparedBy.trim(),
      services_summary: form.servicesSummary.trim(),
      subtitle: form.subtitle.trim(),
      hero_emphasis_word: form.heroEmphasisWord.trim(),
      industry_label: form.industryLabel.trim(),
      target_customer_label: form.targetCustomerLabel.trim(),
      target_keyword_example: form.targetKeywordExample.trim(),
      channel_cards: form.channelCards,
      landscape_stats: form.landscapeStats,
      keyword_ledger: form.keywordLedger,
      gap_pull_quote: form.gapPullQuote,
      authority_your_dr: form.authorityYourDr === "" ? null : Number(form.authorityYourDr),
      authority_your_referring_domains: form.authorityYourReferringDomains === "" ? null : Number(form.authorityYourReferringDomains),
      authority_open_door_note: form.authorityOpenDoorNote,
      competitors: form.competitors,
      source_callout_bullets: form.sourceCalloutBullets,
      authority_pull_quote: form.authorityPullQuote,
      selected_case_study_ids: form.selectedCaseStudyIds,
      line_items: form.lineItems.map((item) => ({
        description: item.description,
        price_amount: item.priceAmount === "" ? 0 : Number(item.priceAmount) || 0,
        price_unit: item.priceUnit,
        qty: item.qty === "" ? 1 : Number(item.qty) || 1,
        group: item.group || "primary",
      })),
      investment_recommendation: form.investmentRecommendation,
      discount_label: form.discountLabel,
      discount_amount: form.discountAmount === "" ? null : Number(form.discountAmount),
      ppc_keywords: form.ppcKeywords.map((k) => ({
        keyword: k.keyword,
        searches: k.searches === "" ? 0 : Number(k.searches) || 0,
      })),
      ppc_avg_cpc: form.ppcAvgCpc === "" ? null : Number(form.ppcAvgCpc),
      ppc_budget_tiers: form.ppcBudgetTiers.map((t) => ({
        budget: t.budget === "" ? 0 : Number(t.budget) || 0,
      })),
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
      const { data: { user } } = await supabase.auth.getUser();
      const profile = user ? (await supabase.from("profiles").select("display_name").eq("id", user.id).single()).data : null;
      await supabase.from("proposal_events").insert({ proposal_id: proposalId, event_type: "edited", actor_name: profile?.display_name || null });
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
        stat_callouts: p.stat_callouts, feature_groups: p.feature_groups, monthly_deliverables: p.monthly_deliverables,
      }));
    const addonRows = addons
      .filter((a) => form.selectedAddonIds.includes(a.id))
      .map((a, i) => {
        const fx = getEffectiveAddonFields(a, addonSelectedOptions, addonPriceOverrides);
        return {
          proposal_id: proposalId, addon_id: a.id, category: a.category, sort_order: i,
          name: fx.name, description: fx.description, price_amount: fx.price_amount, price_unit: fx.price_unit, price_note: fx.price_note,
        };
      });

    if (packageRows.length) await supabase.from("proposal_packages").insert(packageRows);
    if (addonRows.length) await supabase.from("proposal_addons").insert(addonRows);

    router.push(`/proposals/${proposalId}`);
    router.refresh();
  }

  return (
    <div className="editor-split">
      <div className="editor-pane">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="editor-section-title">Proposal type</h2>
          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label>Type</label>
              <select value={form.proposalType} onChange={(e) => update("proposalType", e.target.value)}>
                {PROPOSAL_TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <h2 className="editor-section-title">Cover</h2>
          <div className="form-grid">
            <div className="form-field form-field-wide">
              <label>Client company name *</label>
              <input type="text" value={form.clientCompanyName} onChange={(e) => update("clientCompanyName", e.target.value)} placeholder="e.g. Total Install Outdoor Living" required />
            </div>
            <div className="form-field">
              <label>Client contact name</label>
              <input type="text" value={form.clientContactName} onChange={(e) => update("clientContactName", e.target.value)} />
            </div>
            <div className="form-field form-field-wide">
              <label>Client address</label>
              <input type="text" value={form.clientAddress} onChange={(e) => update("clientAddress", e.target.value)} placeholder="Used in the service agreement — optional" />
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

          {usesStrategyContent(form.proposalType) && (
          <>
          <h2 className="editor-section-title">01 — Landscape</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Industry</label>
              <input type="text" value={form.industryLabel} onChange={(e) => update("industryLabel", e.target.value)} placeholder="e.g. outdoor living contractor" />
            </div>
            <div className="form-field">
              <label>Target customer</label>
              <input type="text" value={form.targetCustomerLabel} onChange={(e) => update("targetCustomerLabel", e.target.value)} placeholder="e.g. homeowner" />
            </div>
            <div className="form-field form-field-wide">
              <label>Target keyword example</label>
              <input type="text" value={form.targetKeywordExample} onChange={(e) => update("targetKeywordExample", e.target.value)} placeholder="e.g. best pergola installer near me" />
            </div>
          </div>

          <div style={{ margin: "16px 0" }}>
            {form.channelCards.map((channel, i) => (
              <ChannelCardEditor key={channel.key} channel={channel} onChange={(next) => update("channelCards", rowUpdate(form.channelCards, i, next))} />
            ))}
          </div>

          <div className="form-field form-field-wide">
            <label>Summary stats (3 headline numbers shown below the channel diagram)</label>
            {form.landscapeStats.map((stat, i) => (
              <div className="form-grid" style={{ gridTemplateColumns: "1fr 2fr", marginBottom: 8 }} key={i}>
                <input type="text" placeholder={`Value ${i + 1}, e.g. 1 of 5`} value={stat.value} onChange={(e) => update("landscapeStats", rowUpdate(form.landscapeStats, i, { value: e.target.value }))} />
                <input type="text" placeholder="Label" value={stat.label} onChange={(e) => update("landscapeStats", rowUpdate(form.landscapeStats, i, { label: e.target.value }))} />
              </div>
            ))}
          </div>

          <h2 className="editor-section-title">02 — Gap Analysis</h2>
          <div className="form-field form-field-wide">
            <label>Bulk paste keywords (Keyword, Current Rank, Monthly Searches — one per line, tab or comma separated)</label>
            <textarea
              value={keywordPasteText}
              onChange={(e) => setKeywordPasteText(e.target.value)}
              placeholder={"pergola Denver CO\tNot ranked\t210\ncovered patio Denver\t#83\t90"}
              style={{ minHeight: 90 }}
            />
            <button type="button" className="link-toggle" style={{ marginTop: 6 }} onClick={parseKeywordPaste}>Parse &amp; add rows</button>
          </div>
          <div className="form-field form-field-wide">
            <label>Keyword ledger — renders in this order, use the arrows to reorder ({form.keywordLedger.length})</label>
            {form.keywordLedger.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 110px 90px 110px 90px auto", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <input type="text" placeholder="Keyword" value={row.keyword} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { keyword: e.target.value }))} />
                <input type="text" placeholder="Rank" value={row.rankBadge} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { rankBadge: e.target.value }))} />
                <select value={row.severity} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { severity: e.target.value }))}>
                  <option value="bad">Bad</option><option value="mid">Mid</option><option value="good">Good</option>
                </select>
                <input type="number" placeholder="Searches/mo" value={row.searches} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { searches: e.target.value }))} />
                <input type="text" placeholder="Priority" value={row.priority} onChange={(e) => update("keywordLedger", rowUpdate(form.keywordLedger, i, { priority: e.target.value }))} />
                <div style={{ display: "flex", gap: 2, whiteSpace: "nowrap" }}>
                  <button type="button" className="link-toggle" title="Move to top" disabled={i === 0} onClick={() => update("keywordLedger", rowMoveToTop(form.keywordLedger, i))}>Top</button>
                  <button type="button" className="link-toggle" title="Move up" disabled={i === 0} onClick={() => update("keywordLedger", rowMove(form.keywordLedger, i, -1))}>&uarr;</button>
                  <button type="button" className="link-toggle" title="Move down" disabled={i === form.keywordLedger.length - 1} onClick={() => update("keywordLedger", rowMove(form.keywordLedger, i, 1))}>&darr;</button>
                  <button type="button" className="link-toggle" title="Remove" onClick={() => update("keywordLedger", rowRemove(form.keywordLedger, i))}>Remove</button>
                </div>
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
              <label>Your referring domains</label>
              <input type="number" value={form.authorityYourReferringDomains} onChange={(e) => update("authorityYourReferringDomains", e.target.value)} />
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
                <div className="form-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr", marginBottom: 6 }}>
                  <input type="text" placeholder="Name" value={c.name} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { name: e.target.value }))} />
                  <input type="number" placeholder="DR" value={c.dr} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { dr: e.target.value }))} />
                  <input type="number" placeholder="Referring domains" value={c.referringDomains} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { referringDomains: e.target.value }))} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="checkbox-field" style={{ margin: 0 }}><input type="checkbox" checked={!!c.alert} onChange={(e) => update("competitors", rowUpdate(form.competitors, i, { alert: e.target.checked }))} /> Flag</label>
                  <button type="button" className="link-toggle" onClick={() => update("competitors", rowRemove(form.competitors, i))}>Remove</button>
                </div>
              </div>
            ))}
            <button type="button" className="link-toggle" onClick={() => update("competitors", rowAdd(form.competitors, { name: "", dr: "", referringDomains: "", alert: false, note: "" }))}>+ Add competitor</button>
          </div>

          <h2 className="editor-section-title">SOURCE™ &amp; Authority</h2>
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

          <h2 className="editor-section-title">Case studies</h2>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
            <div className="form-field">
              <label>Filter by industry</label>
              <select value={csIndustryFilter} onChange={(e) => setCsIndustryFilter(e.target.value)}>
                <option value="">All Industries</option>
                {INDUSTRY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Filter by service type</label>
              <select value={csServiceFilter} onChange={(e) => setCsServiceFilter(e.target.value)}>
                <option value="">All Solutions</option>
                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {visibleCaseStudies.map((cs) => (
            <label className="checkbox-field" key={cs.id}>
              <input type="checkbox" checked={form.selectedCaseStudyIds.includes(cs.id)} onChange={() => toggleId("selectedCaseStudyIds", cs.id)} />
              {cs.industry_label} — {cs.stat_number} {cs.stat_label}
            </label>
          ))}

          <h2 className="editor-section-title">Packages</h2>
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

          <h2 className="editor-section-title">Add-ons &amp; one-time fees</h2>
          {addons.map((a) => {
            const selected = form.selectedAddonIds.includes(a.id);
            const hasOptions = a.pricing_options && a.pricing_options.length > 0;
            const fx = getEffectiveAddonFields(a, addonSelectedOptions, addonPriceOverrides);
            return (
              <div key={a.id} style={{ marginBottom: 8 }}>
                <label className="checkbox-field" style={{ margin: 0 }}>
                  <input type="checkbox" checked={selected} onChange={() => toggleId("selectedAddonIds", a.id)} />
                  {a.name} — ${Number(fx.price_amount).toLocaleString("en-US")} {fx.price_unit}
                </label>
                {selected && hasOptions && (
                  <div style={{ marginLeft: 24, marginTop: 4 }}>
                    {a.pricing_options.map((opt, oi) => (
                      <label className="checkbox-field" key={oi} style={{ display: "block", margin: "2px 0" }}>
                        <input
                          type="radio"
                          name={`addon-option-${a.id}`}
                          checked={(addonSelectedOptions[a.id] ?? 0) === oi}
                          onChange={() => setAddonSelectedOptions((s) => ({ ...s, [a.id]: oi }))}
                        />
                        {opt.label} — ${Number(opt.price_amount).toLocaleString("en-US")} {opt.price_unit}
                      </label>
                    ))}
                  </div>
                )}
                {selected && (
                  <div style={{ marginLeft: 24, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Price for this proposal:</span>
                    <input
                      type="number"
                      style={{ width: 110 }}
                      placeholder={String(fx.price_amount)}
                      value={addonPriceOverrides[a.id] ?? ""}
                      onChange={(e) => setAddonPriceOverrides((s) => ({ ...s, [a.id]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            );
          })}
          </>
          )}

          {usesPpcContent(form.proposalType) && (
          <>
          <h2 className="editor-section-title">PPC</h2>
          <div className="form-field form-field-wide">
            <label>Average CPC ($)</label>
            <input type="number" step="0.01" style={{ maxWidth: 140 }} value={form.ppcAvgCpc} onChange={(e) => update("ppcAvgCpc", e.target.value)} placeholder="e.g. 4.50" />
          </div>
          <div className="form-field form-field-wide">
            <label>Target keywords ({form.ppcKeywords.length})</label>
            {form.ppcKeywords.map((k, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 140px auto", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <input type="text" placeholder="Keyword" value={k.keyword} onChange={(e) => update("ppcKeywords", rowUpdate(form.ppcKeywords, i, { keyword: e.target.value }))} />
                <input type="number" placeholder="Monthly searches" value={k.searches} onChange={(e) => update("ppcKeywords", rowUpdate(form.ppcKeywords, i, { searches: e.target.value }))} />
                <button type="button" className="link-toggle" onClick={() => update("ppcKeywords", rowRemove(form.ppcKeywords, i))}>Remove</button>
              </div>
            ))}
            <button type="button" className="link-toggle" onClick={() => update("ppcKeywords", rowAdd(form.ppcKeywords, blankPpcKeyword()))}>+ Add keyword</button>
          </div>
          <div className="form-field form-field-wide">
            <label>Budget tiers to forecast ({form.ppcBudgetTiers.length})</label>
            {form.ppcBudgetTiers.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "160px auto", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <input type="number" placeholder="Monthly budget ($)" value={t.budget} onChange={(e) => update("ppcBudgetTiers", rowUpdate(form.ppcBudgetTiers, i, { budget: e.target.value }))} />
                <button type="button" className="link-toggle" onClick={() => update("ppcBudgetTiers", rowRemove(form.ppcBudgetTiers, i))}>Remove</button>
              </div>
            ))}
            <button type="button" className="link-toggle" onClick={() => update("ppcBudgetTiers", rowAdd(form.ppcBudgetTiers, blankPpcBudgetTier()))}>+ Add budget tier</button>
          </div>
          </>
          )}

          {usesLineItemInvestment(form.proposalType) && (
          <>
          <h2 className="editor-section-title">Investment</h2>
          <div className="form-field form-field-wide">
            <label>Recommendation paragraph (shown above the pricing table)</label>
            <textarea value={form.investmentRecommendation} onChange={(e) => update("investmentRecommendation", e.target.value)} placeholder="Based on our recommendations and the desired results, we recommend a budget of $X/month…" />
          </div>
          <div className="form-field form-field-wide">
            <label>Line items ({form.lineItems.length})</label>
            {form.lineItems.map((item, i) => (
              <div key={i} style={{ border: "1px solid var(--border, #ddd)", borderRadius: 6, padding: 10, marginBottom: 8 }}>
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => update("lineItems", rowUpdate(form.lineItems, i, { description: e.target.value }))}
                  rows={2}
                  style={{ width: "100%", fontSize: 14, padding: "8px 10px", marginBottom: 8, resize: "vertical", boxSizing: "border-box" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "110px 130px 70px 150px auto", gap: 6, alignItems: "center" }}>
                  <input type="number" placeholder="Price" value={item.priceAmount} onChange={(e) => update("lineItems", rowUpdate(form.lineItems, i, { priceAmount: e.target.value }))} />
                  <select value={item.priceUnit} onChange={(e) => update("lineItems", rowUpdate(form.lineItems, i, { priceUnit: e.target.value }))}>
                    <option value="">One-time</option>
                    <option value="/mo">Monthly</option>
                    <option value="/yr">Yearly</option>
                  </select>
                  <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => update("lineItems", rowUpdate(form.lineItems, i, { qty: e.target.value }))} />
                  <select value={item.group || "primary"} onChange={(e) => update("lineItems", rowUpdate(form.lineItems, i, { group: e.target.value }))}>
                    <option value="primary">Primary table</option>
                    <option value="other_costs">Other costs table</option>
                  </select>
                  <button type="button" className="link-toggle" onClick={() => update("lineItems", rowRemove(form.lineItems, i))}>Remove</button>
                </div>
              </div>
            ))}
            <button type="button" className="link-toggle" onClick={() => update("lineItems", rowAdd(form.lineItems, blankLineItem()))}>+ Add line item</button>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Discount label</label>
              <input type="text" placeholder="e.g. Discount (10%)" value={form.discountLabel} onChange={(e) => update("discountLabel", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Discount amount ($)</label>
              <input type="number" value={form.discountAmount} onChange={(e) => update("discountAmount", e.target.value)} />
            </div>
          </div>
          </>
          )}

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
