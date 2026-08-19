// Hub-and-spoke "5 discovery channels" diagram from the original template.
// Layout (hub position, spoke lines, card positions) is fixed — only each
// card's title/badge/stat rows are data-driven, one per entry in `channels`
// (expects exactly 5, in this order: organic, aiOverviews, localMaps, aeoLlm, googleAds).
//
// SVG can't reference the .proposal CSS custom properties, so brand colors
// are hardcoded here — kept in sync with proposal.css's --fo (#F27F30) and
// --fd (#1D1525) per the 2026 Firestarter Brand Guidelines. The inactive
// card header (previously #2d3748, an off-brand slate) and hub circle
// (previously #1a1f2e, an off-brand navy) now both use the brand's Deep
// Charcoal instead.

const CARD_POSITIONS = [
  { x: 285, y: 10 },  // top: organic
  { x: 10, y: 185 },  // mid-left: AI overviews
  { x: 560, y: 185 }, // mid-right: local/maps
  { x: 95, y: 422 },  // bot-left: AEO/LLM
  { x: 475, y: 422 }, // bot-right: google ads
];

const VALUE_COLORS = {
  bad: "#842029",
  mid: "#856404",
  good: "#1a5c2a",
  neutral: "#52525b",
};

const BADGE_STYLES = {
  active: { bg: "rgba(255,255,255,.22)", stroke: "rgba(255,255,255,.4)", text: "#ffffff" },
  invisible: { bg: "#fce8ea", stroke: null, text: "#842029" },
  not_running: { bg: "#e8e8ea", stroke: null, text: "#41464b" },
};

function ChannelCard({ x, y, title, headerActive, badgeLabel, badgeVariant, rows }) {
  const badgeStyle = BADGE_STYLES[badgeVariant] || BADGE_STYLES.invisible;
  const headerFill = headerActive ? "#F27F30" : "#1D1525";
  const badgeWidth = badgeVariant === "active" ? 54 : badgeVariant === "not_running" ? 88 : 70;
  const badgeX = 198 - 12 - badgeWidth;

  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="210" height="118" rx="8" fill="white" stroke={headerActive ? "#F27F30" : "#e4e4e7"} strokeWidth={headerActive ? 2 : 1.2} />
      <rect width="210" height="28" rx="8" fill={headerFill} />
      <rect y="16" width="210" height="12" fill={headerFill} />
      <text x="12" y="19.5" fontFamily="Fjalla One,sans-serif" fontSize="12" fill="white" letterSpacing=".5">{title}</text>
      <rect x={badgeX} y="8" width={badgeWidth} height="14" rx="7" fill={badgeStyle.bg} stroke={badgeStyle.stroke || "none"} strokeWidth={badgeStyle.stroke ? 0.8 : 0} />
      <text x={badgeX + badgeWidth / 2} y="17" textAnchor="middle" fontFamily="Roboto Slab,serif" fontSize="8.5" fill={badgeStyle.text} fontWeight="700">{badgeLabel}</text>
      {rows.map((row, i) => {
        const rowY = 47 + i * 18;
        return (
          <g key={i}>
            <line x1="12" y1={rowY} x2="198" y2={rowY} stroke="#e4e4e7" strokeWidth=".5" />
            <text x="12" y={rowY - 4} fontSize="11" fill="#52525b">{row.label}</text>
            <text x="198" y={rowY - 4} textAnchor="end" fontSize="11" fill={VALUE_COLORS[row.severity] || VALUE_COLORS.neutral} fontWeight="600">{row.value}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function ChannelDiagram({ channels, hubLabel }) {
  const cards = (channels || []).slice(0, 5);

  return (
    <svg width="100%" viewBox="0 0 780 560" xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: "Overpass,sans-serif" }}>
      <defs>
        <marker id="proposal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M1 2L8 5L1 8" fill="none" stroke="#F27F30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <line x1="390" y1="165" x2="390" y2="82" stroke="#F27F30" strokeWidth="1.5" strokeDasharray="5 4" opacity=".6" markerEnd="url(#proposal-arrow)" />
      <line x1="272" y1="278" x2="130" y2="254" stroke="#F27F30" strokeWidth="1.5" strokeDasharray="5 4" opacity=".6" markerEnd="url(#proposal-arrow)" />
      <line x1="516" y1="278" x2="650" y2="254" stroke="#F27F30" strokeWidth="1.5" strokeDasharray="5 4" opacity=".6" markerEnd="url(#proposal-arrow)" />
      <line x1="336" y1="362" x2="248" y2="432" stroke="#F27F30" strokeWidth="1.5" strokeDasharray="5 4" opacity=".6" markerEnd="url(#proposal-arrow)" />
      <line x1="444" y1="362" x2="532" y2="432" stroke="#F27F30" strokeWidth="1.5" strokeDasharray="5 4" opacity=".6" markerEnd="url(#proposal-arrow)" />

      <circle cx="390" cy="295" r="70" fill="#1D1525" stroke="#F27F30" strokeWidth="2.5" />
      <text x="390" y="281" textAnchor="middle" fontFamily="Fjalla One,sans-serif" fontSize="13" fill="#F27F30" letterSpacing="1">{hubLabel}</text>
      <line x1="340" y1="293" x2="440" y2="293" stroke="#F27F30" strokeWidth="0.8" opacity=".4" />
      <text x="390" y="310" textAnchor="middle" fontFamily="Overpass,sans-serif" fontSize="9" fill="#ffffff" opacity=".45" letterSpacing="1">SEARCH VISIBILITY</text>

      {cards.map((card, i) => {
        const { key, ...cardProps } = card;
        return <ChannelCard key={key || i} {...CARD_POSITIONS[i]} {...cardProps} />;
      })}
    </svg>
  );
}
