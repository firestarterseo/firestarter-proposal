import ChannelDiagram from "./ChannelDiagram";

export default function LandscapeSection({ data }) {
  return (
    <div className="sec">
      <span className="eye">01 &mdash; The Search Landscape</span>
      <h2 className="h2">Your Buyers Search<br />in <em>5 Places.</em><br />You&rsquo;re Visible in One.</h2>
      <p className="intro">{data.introText}</p>
      <div className="pq" dangerouslySetInnerHTML={{ __html: data.landscapePullQuote }} />

      <span className="sec-label" style={{ marginBottom: 20 }}>
        The 5 Discovery Channels &mdash; Where Buyers Find {data.serviceCategory || "Contractors"} Today
      </span>

      <ChannelDiagram channels={data.channelCards} hubLabel={(data.clientCompanyName || "").toUpperCase().slice(0, 16)} />

      <div className="legend">
        <div className="leg-item"><div className="leg-swatch" style={{ background: "#fce8ea", border: "1px solid #842029" }} />Invisible</div>
        <div className="leg-item"><div className="leg-swatch" style={{ background: "#fff3cd", border: "1px solid #856404" }} />Partial</div>
        <div className="leg-item"><div className="leg-swatch" style={{ background: "var(--fo)" }} />Active / core channel</div>
      </div>

      <div className="stat3">
        {(data.landscapeStats || []).map((stat, i) => (
          <div className="stat3-cell" key={i}>
            <div className="stat3-num">{stat.value}</div>
            <div className="stat3-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
