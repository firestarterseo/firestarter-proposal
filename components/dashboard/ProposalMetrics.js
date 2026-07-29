import CloseRateRing from "./CloseRateRing";
import ProposalTrendChart from "./ProposalTrendChart";

export default function ProposalMetrics({ createdCount, sentCount, viewedCount, wonCount, lostCount, closeRate, months, series }) {
  return (
    <div className="soft-card" style={{ padding: "20px 24px", marginBottom: 20 }}>
      <div className="section-label">Proposal metrics</div>
      <div style={{ display: "flex", gap: 28, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <div className="cards" style={{ flex: "1 1 320px", marginBottom: 0 }}>
          <div className="card" style={{ flex: "1 1 90px" }}><div className="num">{createdCount}</div><div className="label">Created</div></div>
          <div className="card" style={{ flex: "1 1 90px" }}><div className="num">{sentCount}</div><div className="label">Sent</div></div>
          <div className="card" style={{ flex: "1 1 90px" }}><div className="num">{viewedCount}</div><div className="label">Viewed</div></div>
          <div className="card" style={{ flex: "1 1 90px" }}><div className="num">{wonCount}</div><div className="label">Won</div></div>
          <div className="card" style={{ flex: "1 1 90px" }}><div className="num">{lostCount}</div><div className="label">Lost</div></div>
        </div>
        <CloseRateRing percent={closeRate} />
      </div>
      <ProposalTrendChart months={months} series={series} />
    </div>
  );
}
