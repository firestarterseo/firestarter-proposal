export default function GapAnalysisSection({ data }) {
  return (
    <div className="sec-mid">
      <span className="eye">02 &mdash; Visibility Gap Analysis</span>
      <h2 className="h2">Here&rsquo;s Exactly<br />Where You Stand<br />Across Every Channel</h2>
      <p className="intro">
        We audited {data.clientCompanyName}&rsquo;s presence across all five discovery channels.
        The numbers below aren&rsquo;t abstract &mdash; they represent real buyers, real searches,
        and real jobs going to competitors right now.
      </p>

      <span className="sec-label">Organic SEO &mdash; Keyword Position Audit</span>
      <div className="ledger">
        <div className="ledger-head"><span>Keyword</span><span>Your Rank</span><span>Monthly Searches</span><span>Priority</span></div>
        {(data.keywordLedger || []).map((row, i) => (
          <div className="ledger-row" key={i}>
            <span className={`lkw${row.hot ? " hot" : ""}`}>{row.keyword}</span>
            <span><span className={`badge b-${row.severity}`}>{row.rankBadge}</span></span>
            <span style={row.hot ? { fontFamily: '"Fjalla One",sans-serif', fontSize: 16, color: "var(--fo)" } : undefined}>
              {row.searches}
            </span>
            {row.priority && (
              row.priorityMuted
                ? <span style={{ fontSize: 11, color: "var(--text2)" }}>{row.priority}</span>
                : <span className="opp">{row.priority}</span>
            )}
          </div>
        ))}
      </div>

      {data.gapPullQuote && <div className="pq" dangerouslySetInnerHTML={{ __html: data.gapPullQuote }} />}

      <span className="sec-label" style={{ marginTop: 32 }}>Authority Gap &mdash; {data.clientCompanyName} vs. Competitors</span>
      <div className="auth-split">
        <div>
          <div className="auth-ours">
            <span className="auth-ours-label">{data.clientCompanyName}</span>
            <div className="auth-ours-dr">DR {data.authorityYourDr}</div>
            <div className="auth-ours-stat">{data.authorityYourStat}</div>
          </div>
          {data.authorityOpenDoorNote && (
            <div className="auth-ours-note">
              <strong>The open door.</strong>
              {data.authorityOpenDoorNote}
            </div>
          )}
        </div>
        <div className="auth-competitors">
          {(data.competitors || []).map((c, i) => (
            <div className="auth-comp" key={i}>
              <div className="auth-comp-name">{c.name}</div>
              <div className={`auth-comp-dr${c.alert ? " alert" : ""}`}>DR {c.dr}</div>
              <div className="auth-comp-stat">{c.stat}</div>
              {c.note && <div className="auth-comp-note">&#8593; {c.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
