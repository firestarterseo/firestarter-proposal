// PPC-specific content for PPC-only and SEO+PPC proposals — see
// lib/proposalTypes.js usesPpcContent. The "PPC Project Process" overview
// bullets are fixed agency-wide copy (same "standardize fixed methodology
// copy" convention as StrategySection/NextStepsSection); the target keyword
// table and budget/forecast table are per-proposal, driven by
// data.ppcKeywords / data.ppcAvgCpc / data.ppcBudgetTiers
// (proposals.ppc_keywords / ppc_avg_cpc / ppc_budget_tiers).
//
// Forecast math confirmed against the real "Womdogapp Ads" example:
//   clicks = budget / avgCpc
//   conversions(rate) = clicks * rate
//   cpa(rate) = avgCpc / rate

const PROCESS_POINTS = [
  {
    title: "Multiple Campaign Approach",
    desc: "Search, Display, and Remarketing campaigns run in parallel — each targeting a different stage of the buying journey so qualified clicks aren't left to a single channel.",
  },
  {
    title: "Banner Ads",
    desc: "Custom-designed display creative keeps your brand in front of researching buyers across the Google Display Network, even when they aren't actively searching.",
  },
  {
    title: "Competitor Targeting",
    desc: "We bid on the terms your competitors rank and advertise for, putting your offer in front of buyers who are already comparing options in your market.",
  },
  {
    title: "Brand Protection",
    desc: "Defensive campaigns on your own branded terms keep competitors from buying their way into your existing demand and hijacking searches for your name.",
  },
];

function formatMoney(amount) {
  const num = Number(amount) || 0;
  return num % 1 === 0 ? num.toLocaleString("en-US") : num.toFixed(2);
}

function formatNumber(num, decimals = 0) {
  const n = Number(num) || 0;
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

function forecastForRate(budget, avgCpc, rate) {
  const clicks = avgCpc > 0 ? budget / avgCpc : 0;
  const conversions = clicks * rate;
  const cpa = rate > 0 ? avgCpc / rate : 0;
  return { clicks, conversions, cpa };
}

export default function PpcStrategySection({ data }) {
  const keywords = data.ppcKeywords || [];
  const avgCpc = Number(data.ppcAvgCpc) || 0;
  const tiers = data.ppcBudgetTiers || [];
  const showForecast = avgCpc > 0 && tiers.length > 0;

  return (
    <>
      <div className="sec-dark">
        <span className="eye-lt">PPC Project Process</span>
        <h2 className="h2-lt">How We&rsquo;ll Run<br /><em>Your Ad Spend</em></h2>
        <div className="layer-items">
          {PROCESS_POINTS.map((p) => (
            <div className="li-card" key={p.title}>
              <div className="li-title">{p.title}</div>
              <div className="li-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="sec">
          <span className="eye">Target Keywords</span>
          <h2 className="h2">Where We&rsquo;ll<br /><em>Spend First</em></h2>
          <table className="li-table">
            <colgroup>
              <col className="li-col-desc" />
              <col style={{ width: "30%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="li-col-desc">Keyword</th>
                <th className="li-col-num">Monthly Searches</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((k, i) => (
                <tr key={i}>
                  <td className="li-col-desc">{k.keyword}</td>
                  <td className="li-col-num">{formatNumber(k.searches)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForecast && (
        <div className="sec-mid">
          <span className="eye">Budget &amp; Forecast</span>
          <h2 className="h2">What Your<br /><em>Investment Gets You</em></h2>
          <p className="intro">
            Forecasts assume an average cost-per-click of ${formatMoney(avgCpc)}, shown at two conversion-rate
            assumptions so you can see the range of outcomes a given monthly budget can realistically produce.
          </p>
          <table className="li-table">
            <colgroup>
              <col style={{ width: "22%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="li-col-desc">Monthly Budget</th>
                <th className="li-col-num">Est. Clicks</th>
                <th className="li-col-num">Conversions @5%</th>
                <th className="li-col-num">CPA @5%</th>
                <th className="li-col-num">Conversions @10%</th>
                <th className="li-col-num">CPA @10%</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => {
                const budget = Number(tier.budget) || 0;
                const low = forecastForRate(budget, avgCpc, 0.05);
                const high = forecastForRate(budget, avgCpc, 0.1);
                return (
                  <tr key={i}>
                    <td className="li-col-desc">${formatMoney(budget)}/mo</td>
                    <td className="li-col-num">{formatNumber(low.clicks)}</td>
                    <td className="li-col-num">{formatNumber(low.conversions, 1)}</td>
                    <td className="li-col-num">${formatMoney(low.cpa)}</td>
                    <td className="li-col-num">{formatNumber(high.conversions, 1)}</td>
                    <td className="li-col-num">${formatMoney(high.cpa)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
