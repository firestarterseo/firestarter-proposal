// Freeform Description/Price/Qty/Subtotal pricing table used by General SOW,
// PPC-only, and Website proposals — see lib/proposalTypes.js and the real
// example proposals in the shared Drive folder this was modeled on. Distinct
// from InvestmentSection.js, which renders the catalog-driven package/add-on
// cards for full SEO proposals.

function formatMoney(amount) {
  const num = Number(amount) || 0;
  return num % 1 === 0 ? num.toLocaleString("en-US") : num.toFixed(2);
}

function lineTotal(item) {
  const price = Number(item.priceAmount) || 0;
  const qty = item.qty === "" || item.qty === undefined ? 1 : Number(item.qty) || 0;
  return price * qty;
}

function LineItemsTable({ title, items }) {
  if (!items.length) return null;
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  return (
    <div className="li-table-wrap">
      {title && <div className="li-table-title">{title}</div>}
      <table className="li-table">
        <thead>
          <tr>
            <th className="li-col-desc">Description</th>
            <th className="li-col-num">Price</th>
            <th className="li-col-num">Qty</th>
            <th className="li-col-num">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className="li-col-desc">{item.description}</td>
              <td className="li-col-num">${formatMoney(item.priceAmount)}{item.priceUnit || ""}</td>
              <td className="li-col-num">{item.qty === "" || item.qty === undefined ? 1 : item.qty}</td>
              <td className="li-col-num">${formatMoney(lineTotal(item))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="li-col-desc" colSpan={3}>Total</td>
            <td className="li-col-num">${formatMoney(subtotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function LineItemsInvestmentSection({ data }) {
  const items = data.lineItems || [];
  const primaryItems = items.filter((item) => (item.group || "primary") === "primary");
  const otherItems = items.filter((item) => item.group === "other_costs");
  const itemsSubtotal = primaryItems.reduce((sum, item) => sum + lineTotal(item), 0);
  const discount = Number(data.discountAmount) || 0;
  const total = itemsSubtotal - discount;

  return (
    <div className="sec">
      <span className="eye">Investment</span>
      <h2 className="h2">What to Expect,<br /><em>and What It Costs</em></h2>

      {data.investmentRecommendation && <p className="intro">{data.investmentRecommendation}</p>}

      <LineItemsTable title={otherItems.length ? "Primary Investment" : null} items={primaryItems} />

      {discount !== 0 && (
        <div className="onetime-box" style={{ marginTop: -16 }}>
          <div className="onetime-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="onetime-row">
              <span>{data.discountLabel || "Discount"}</span>
              <span>-${formatMoney(discount)}</span>
            </div>
            <div className="onetime-row">
              <span>Total</span>
              <span>${formatMoney(total)}</span>
            </div>
          </div>
        </div>
      )}

      <LineItemsTable title="Other Costs" items={otherItems} />
    </div>
  );
}
