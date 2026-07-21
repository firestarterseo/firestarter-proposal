function formatPrice(amount, unit) {
  const num = Number(amount);
  const formatted = Number.isInteger(num) ? num.toLocaleString("en-US") : num.toFixed(2);
  if (unit === "% of spend") return `${formatted}%`;
  return `$${formatted}`;
}

export default function InvestmentSection({ data }) {
  const addons = (data.addons || []).filter((a) => a.category !== "one_time_fee");
  const oneTimeFees = (data.addons || []).filter((a) => a.category === "one_time_fee");

  return (
    <div className="sec">
      <span className="eye">05 &mdash; Investment</span>
      <h2 className="h2">What to Expect,<br /><em>and What It Costs</em></h2>
      <p className="intro">
        Before the numbers, the timeline. Authority compounds &mdash; the investment you make in month one
        is still working in month nine. Here&rsquo;s what that arc looks like.
      </p>

      <div className="tl">
        {(data.timelineStages || []).map((stage, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-l"><div className="tl-dot" /><div className="tl-line-v" /></div>
            <div className="tl-body">
              <div className="tl-per">{stage.period}</div>
              <div className="tl-title">{stage.title}</div>
              <div className="tl-desc">{stage.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "0 0 44px" }} />

      <span style={{ fontFamily: '"Roboto Slab",serif', fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text2)", display: "block", marginBottom: 16 }}>
        Choose Your Investment Level
      </span>
      <div className="inv-cards">
        {(data.packages || []).map((pkg, i) => (
          <div className={`inv-c${pkg.isRecommended ? " rec" : ""}`} key={i}>
            {pkg.badgeLabel && <div className={`inv-badge${pkg.isRecommended ? " rec" : ""}`}>{pkg.badgeLabel}</div>}
            <div className="inv-name">{pkg.name}</div>
            <div className="inv-price">${Number(pkg.monthlyPrice).toLocaleString("en-US")} <span>/ month</span></div>
            <div className="inv-note">{pkg.tagline}</div>

            {pkg.statCallouts && pkg.statCallouts.length > 0 && (
              <div className={`inv-stats${pkg.isRecommended ? " rec" : ""}`} style={{ gridTemplateColumns: `repeat(${pkg.statCallouts.length}, 1fr)` }}>
                {pkg.statCallouts.map((s, si) => (
                  <div className="inv-stat" key={si}>
                    <div className={`inv-stat-num${si === pkg.statCallouts.length - 1 ? " total" : ""}`}>{s.value}</div>
                    <div className="inv-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="inv-div" />
            {(pkg.featureGroups || []).map((group, gi) => (
              <div key={gi}>
                <div className="inv-group-label">{group.groupLabel}</div>
                {group.items.map((item, ii) => (
                  <div className="inv-line" key={ii}><span className="ck">&#10003;</span>{item}</div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {addons.length > 0 && (
        <>
          <span style={{ fontFamily: '"Roboto Slab",serif', fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text2)", display: "block", marginBottom: 14 }}>
            Add-Ons &mdash; Expand Your Authority Stack
          </span>
          <div className="addon-grid">
            {addons.map((a, i) => (
              <div className="addon-item" key={i}>
                <div><div className="addon-name">{a.name}</div><div className="addon-desc">{a.description}</div></div>
                <div className="addon-price">
                  {formatPrice(a.priceAmount, a.priceUnit)}
                  <span className="addon-price-unit">{a.priceUnit === "% of spend" ? a.priceNote || "of spend" : a.priceUnit}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {oneTimeFees.length > 0 && (
        <div className="onetime-box">
          <div className="onetime-head">One-Time Fees</div>
          <div className="onetime-grid">
            {oneTimeFees.map((f, i) => (
              <div className="onetime-row" key={i}>
                <span>{f.name}</span>
                <span>{f.priceNote || formatPrice(f.priceAmount, f.priceUnit)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pq">
        <strong>On accountability:</strong> You&rsquo;ll know exactly what we did every month, what moved,
        and what it cost per lead. Rankings, traffic, form submissions, and phone calls tracked in your
        reporting dashboard. Monthly strategy call every month. No surprises, no mystery reports.
      </div>
    </div>
  );
}
