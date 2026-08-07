// The real, signed legal agreement — appended at the end of every proposal,
// right before the accept/decline form. Wording is verbatim from the
// business's actual service agreement; only the five bracketed values below
// are computed per-proposal (see lib/proposalMapping.js computeAgreementFinancials
// for how setupFee/totalMonthly are derived). Do not edit the legal wording
// here without instruction — this is the document being signed.

function formatNumber(amount) {
  const num = Number(amount) || 0;
  return num % 1 === 0 ? num.toLocaleString("en-US") : num.toFixed(2);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const CLAUSES = [
  {
    heading: "SEO Investment",
    body: [
      "The costs that are associated with an SEO campaign will vary based on Client’s objectives and goals for the SEO campaign. Firestarter SEO has provided Client with a description of the different levels of service that Firestarter SEO offers. It is Client’s decision as to which level of service with which Client would like to proceed. Nothing in this Agreement or any other communications Firestarter SEO has exchanged with Client in any way constitutes a promise, warranty, guarantee, or representation that any certain or specific level of service will provide Client with any certain, specific, or guaranteed outcome.",
    ],
  },
  {
    heading: "Length of Service",
    body: [
      "Firestarter SEO will provide the Services on a 12-month term (“Term”). This Agreement will renew automatically for successive one year terms, unless Client notifies Firestarter SEO, in writing, at least forty-five (45) days before the end of the then-current Term of its intent not to renew the Agreement. If Firestarter SEO Applied any discounts to the monthly rate for its services during the initial term, at the beginning of a renewal term, Firestarter SEO may at its sole discretion, continue to apply this discount in whole or part, or discontinue the discount and continue to provide the Services at undiscounted rates. Should Client engage Firestarter for PPC Services, Firestarter SEO will provide those services on a 3-month term.",
    ],
  },
  {
    heading: "Pauses",
    body: [
      "Should Client wish to pause Services, they may do so for up to 3 months with thirty (30) days' written notice. While the campaign is paused, a $75 monthly maintenance fee will be assessed for upkeep of all reporting data, dashboards, analytics, and other monthly costs incurred by Firestarter SEO. Additionally, the amount of time remaining in the Term will also be paused during this period, and the Term will be extended for the duration of the pause. After 3 months, or upon Client’s written instructions, the campaign will resume and the provision of Services under this service agreement will proceed as normal. Only one pause is allowed per Term.",
    ],
  },
  {
    heading: "Cancellations and Liquidated Damages",
    body: [
      "Either party may terminate this Agreement before the expiration of the Term, whether the initial term or an extended or renewed Term, upon forty-five (45) days’ written notice to the non-canceling party of the canceling party’s intent to cancel this Agreement (“Cancellation”). In the event of a Cancellation, Client shall continue to pay to Firestarter SEO the usual monthly rate for Services through the end of the 45-day period. If the 45-day period includes part of a month, Firestarter SEO will send Client a prorated invoice covering the portion of the month included in the 45-day period.",
      "If Client asks Firestarter SEO to cease providing the Services before the end of the Term or the 45-day notice period, Firestarter SEO will make reasonable efforts to comply with this request. However, Client’s payment obligations as described above will remain in effect. This provision is not a penalty, but rather, is intended to compensate Firestarter SEO for the allocation of resources, loss of time, loss of opportunity, and loss of other work. It is expressly acknowledged that damages in the event of Cancellation are difficult to quantify and the parties state and agree that this liquidated damages calculation is a fair approximation of the amount of damages likely to be sustained by Firestarter SEO as a result of a Cancellation by Client. The parties desire to liquidate these damages in advance rather than litigate the actual cost, at significant time and expense.",
    ],
  },
  {
    heading: "Confidentiality",
    body: [
      "To the extent any of Client’s information is considered by Client to be confidential or proprietary, Client shall designate such information as confidential (“Confidential Information”). If the Confidential Information is in written form, Client shall place the word “Confidential” in a conspicuous place on the document prior to providing it to Firestarter SEO. If the Confidential Information is provided verbally, Client shall advise Firestarter SEO of the confidential nature of the information before stating the Confidential Information to Firestarter SEO. Client shall then follow up by providing a written document to Firestarter SEO within two (2) days of the verbal disclosure that confirms the date and the content of the verbal disclosure.",
      "Firestarter SEO shall not use or disclose any Confidential Information except to the extent necessary for the performance of the Services, or for any other purposes as authorized by Client in writing. In the event that Firestarter SEO is requested to provide Client’s Confidential Information through a subpoena, discovery request, court order, or other similar order or instruction, Firestarter SEO will notify Client of the request or order as soon as reasonably possible, and in any event no later than two (2) business days after receipt of the request or order, so as to allow Client to take any action it deems appropriate to address the potential disclosure of Confidential Information pursuant to the request or order.",
    ],
  },
  {
    heading: "Indemnity",
    body: [
      "Client agrees to indemnify, defend and hold harmless Firestarter SEO and its managers, members, directors, employees, agents, insurers, attorneys, representatives, consultants, and advisors, and each of their heirs, successors, and assigns, from and against any and all claims, demands, lawsuits, threats, liabilities, taxes, interest, fines, penalties, actions, proceedings, damages, losses, costs, and expenses (including attorney fees and costs) of every kind and nature (collectively, “Claims”) arising of out or resulting from: (a) any breach of this Agreement by Client; (b) any Claim by any third-party that documents or information provided by Client to Firestarter SEO that Firestarter SEO uses to provide the Services was in violation of that third-party’s copyright, trademark, or patent rights, or was in any other way used by Firestarter SEO without that third-party’s authorization; (c) any Claims made by any third-parties which in any way arise from or relate to Firestarter SEO’s providing of the Services to Client; or (d) any acts of negligence by Firestarter SEO in providing the Services. This provision does not apply to conduct that a court of competent jurisdiction determines to constitute gross negligence or willful and wanton conduct.",
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      "Client represents and warrants to Firestarter SEO that Client understands that the providing of SEO services, including the Services: (1) is an inexact process, and that by providing the Services to Client, Firestarter SEO is not providing any form or promise, warranty, guaranty, or representation that the Services will provide Client with any certain or specific result or outcome; and (2) will not generate any certain or specific profit, revenue, or income generated to Client. Client further represents and warrants that it understands that when disputes arise, it is in the best interest of all parties involved to bring the matter to the other party’s attention promptly. This allows any outstanding issues to be addressed as soon as possible, which helps the parties to quickly address the issues and continue with the provision of the Services.",
      "Based on the foregoing, Client agrees to provide Firestarter SEO with prompt written notice no later than six weeks after it learns of any facts or circumstances that may give rise to (x) a Claim; or (y) a dispute between the parties that in any way arises from or relates to this Agreement. In the event a lawsuit or other legal action arises from such a Claim or dispute, Client will not be permitted to recover damages relating to facts or circumstances of which Client either knew or in the exercise of ordinary diligence should have discovered, but for which it failed to give Firestarter SEO timely written notice. Client further agrees that Firestarter SEO’s total liability in the event of, a Claim or dispute that in any way arises from or relates to this Agreement, or the formation of this Agreement, shall be no greater than the total amount paid by Client to Firestarter SEO during the two-year period ending on the date Client notified Firestarter SEO in writing of that matter. Client acknowledges and agrees that its claims that arise from this Agreement and/or the Services will be limited to those claims sounding in contract, and that under no circumstances will Firestarter SEO be liable for any indirect or consequential damages (including, but not limited to, lost profits, lost revenue, or loss of business opportunity) or punitive damages. Firestarter SEO has allocated its risk and expense as a material part of this Agreement. Client acknowledges that the terms set forth in this paragraph are material terms to this Agreement, and that Firestarter SEO would not have entered into this Agreement without this provision.",
    ],
  },
  {
    heading: "Waiver",
    body: [
      "The failure of either party to strictly enforce any provision of this Agreement shall not be deemed a waiver of such party’s rights to strictly enforce that or any other provision of this Agreement at any time.",
    ],
  },
  {
    heading: "Attorney Fees and Costs",
    body: [
      "If a dispute between the parties arises relating in any way to this Agreement, the parties will first attempt to discuss and resolve the dispute in good faith prior to initiating any kind of mediation, arbitration, or legal action. Client shall pay Firestarter SEO’s reasonable attorney's fees and costs if Firestarter SEO prevails in any lawsuit that arises from this agreement and/or the Services. Interest on any amount owed under this Agreement shall accrue from the date the amount becomes due and payable at the lesser rate of (i) 18% per annum or (ii the maximum interest rate allowed by law.",
    ],
  },
];

const JURY_WAIVER = "THE PARTIES KNOWINGLY AND VOLUNTARILY WAIVE THEIR RIGHT TO A JURY TRIAL IN ANY LAWSUIT THAT RELATES TO OR ARISES FROM THIS AGREEMENT.";

const CLAUSES_AFTER_JURY_WAIVER = [
  {
    heading: "Applicable Law and Jurisdiction",
    body: [
      "This Agreement shall be governed by the laws of the state of Colorado without regard to applicable principles of conflicts of law. Each party consents to the exclusive jurisdiction of any federal or state court located in Denver, Colorado in connection with any matter relating in any way to this Agreement.",
    ],
  },
  {
    heading: "No Refund Policy",
    body: [
      "All sales or transactions are considered final. Due to the nature of the services Firestarter offers, Firestarter is unable to provide refunds. If you have questions about any services to be rendered pursuant to any invoice or request for payment, please contact Firestarter to discuss before completing your transaction or making payment. By making any payment to Firestarter, Client agrees that the payment is fair consideration for services provided by Firestarter or for Firestarter’s commitment to provide services during the period to which the payment applies, and acknowledges that the payment is not subject to refunding due to dissatisfaction with the services or any other reason.",
    ],
  },
  {
    heading: "Assignability",
    body: [
      "Firestarter SEO may assign this Agreement at any time, and without prior notice to or consent from Client. Client may not assign this Agreement without the prior written approval of Firestarter SEO. This Agreement shall be binding upon and shall inure to the benefit of the parties and their authorized respective successors and assigns.",
    ],
  },
  {
    heading: "Entire Agreement",
    body: [
      "This Agreement contains the entire agreement between the parties, and supersedes any and all prior written and/or oral agreements. This Agreement may be altered or modified only in writing signed by the parties hereto.",
    ],
  },
  {
    heading: "Severability",
    body: [
      "If any provision of this Agreement shall be deemed invalid, illegal, or unenforceable, the invalid, illegal, or unenforceable provision(s) shall be modified to the extent necessary to be valid, legal, and enforceable, and the validity, legality and enforceability of the remaining provisions of this Agreement shall not be affected or impaired.",
    ],
  },
  {
    heading: "Aggregated and Anonymized Data Usage",
    body: [
      "Client acknowledges and agrees that Firestarter SEO may collect, analyze, and use data, metrics, performance information, trends, and other information derived from the Services, provided that such information is aggregated with data from other clients and anonymized so that neither Client nor any individual can be identified. Firestarter SEO may use such aggregated and anonymized information for any lawful purpose, including to develop, publish, distribute, and commercialize original market research, industry reports, benchmarking studies, trend analyses, artificial intelligence training datasets, and similar informational materials. Firestarter SEO shall not disclose Client's confidential information, proprietary business information, or any data that reasonably identifies Client without Client's prior written consent. Client grants Firestarter SEO a perpetual, worldwide, royalty-free right to use such aggregated and anonymized information for the foregoing purposes.",
    ],
  },
];

export default function ServiceAgreementSection({ data }) {
  const clientName = data.clientCompanyName || "Client";
  const clientAddress = data.clientAddress || "";
  const dateAccepted = data.acceptedAt ? formatDate(data.acceptedAt) : "Not yet accepted";
  const { setupFee, totalMonthly } = data.agreementFinancials || { setupFee: 0, totalMonthly: 0 };

  return (
    <div className="sec">
      <span className="eye">Service Agreement</span>
      <h2 className="h2">Service<br /><em>Agreement</em></h2>

      <div className="sa-open">
        <p>
          This service agreement (&ldquo;Agreement&rdquo;), entered into {dateAccepted} (the &ldquo;Effective Date&rdquo;), is
          between Firestarter Search Engine Optimization LLC, located at 4700 S Syracuse St #460, Denver CO 80237
          (&ldquo;Firestarter SEO&rdquo;), and {clientName} (&ldquo;Client&rdquo;) located at {clientAddress}. Firestarter SEO
          and Client are sometimes referred to below individually as a &ldquo;party&rdquo; or jointly as the &ldquo;parties.&rdquo;
        </p>
        <p>The parties agree as follows:</p>
        <p>
          Client shall pay Firestarter SEO a one-time setup fee of ${formatNumber(setupFee)} upon execution
          of this Agreement, and an ongoing fee of ${formatNumber(totalMonthly)} per month for the Services. Ongoing monthly
          payments are billed on the 1st or 15th of each month, and are due and payable on or within ten days of the date on
          which the bill is sent to Client. If paying by ACH, client will pay on the 5th or the 20th of each month.
        </p>
        <p>
          If additional services other than the Services described above are requested by Client (i.e., any services that
          are in addition to the Services), and if Firestarter SEO agrees to perform these Additional Services (which
          decision shall be made in Firestarter SEO&rsquo;s sole discretion), the fees for the Additional Services will be
          quoted to Client in advance, and such Additional Services will not be performed unless and until Client provides
          its written authorization for Firestarter SEO to proceed with providing the Additional Services per the terms of
          the quote. The accepted quote shall be incorporated into and made a part of this Agreement. All Additional
          Services will be invoiced separately from the Services, which invoices will be prepared and sent out to Client on
          a monthly basis. The same payment terms as described above will apply to the Additional Services. Any and all
          Additional Services that are provided to Client as set forth above are provided per the terms of this Agreement.
          These Additional Services may include, but are not necessarily limited to, the following services. The rates
          associated with each Additional Service below is provided for reference purposes only. The rate Firestarter SEO
          provides in its quote may differ from the rates listed below, and in case of conflict the quoted rate will
          control over the rates below.
        </p>
      </div>

      {CLAUSES.map((clause) => (
        <div className="sa-clause" key={clause.heading}>
          <div className="sa-clause-h">{clause.heading}</div>
          {clause.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      ))}

      <p className="sa-callout">{JURY_WAIVER}</p>

      {CLAUSES_AFTER_JURY_WAIVER.map((clause) => (
        <div className="sa-clause" key={clause.heading}>
          <div className="sa-clause-h">{clause.heading}</div>
          {clause.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>
      ))}
    </div>
  );
}
