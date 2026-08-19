import "./proposal.css";
import Cover from "./Cover";
import LandscapeSection from "./LandscapeSection";
import GapAnalysisSection from "./GapAnalysisSection";
import StrategySection from "./StrategySection";
import SourceSection from "./SourceSection";
import AuthoritySection from "./AuthoritySection";
import InvestmentSection from "./InvestmentSection";
import LineItemsInvestmentSection from "./LineItemsInvestmentSection";
import AgencyIntroSection from "./AgencyIntroSection";
import WebsitePlaybookSection from "./WebsitePlaybookSection";
import PpcStrategySection from "./PpcStrategySection";
import NextStepsSection from "./NextStepsSection";
import ServiceAgreementSection from "./ServiceAgreementSection";
import Footer from "./Footer";
import {
  usesStrategyContent,
  usesLineItemInvestment,
  usesLegalAgreement,
  usesAgencyIntro,
  usesPpcContent,
  usesWebsitePlaybook,
} from "../../lib/proposalTypes";

// Single source of truth for the proposal's visual output — used by both the
// internal editor's live preview and the public /view/[token] page, so they
// can never drift apart. `afterNextSteps` is where the public page injects
// the accept/decline form; the internal preview omits it.
//
// Which sections render depends on data.proposalType — see
// lib/proposalTypes.js. "seo" and "seo_ppc" get the full strategy build-out
// and catalog-driven Investment cards; "sow", "ppc", and "website" get a
// lighter document with a freeform line-item Investment table instead, and
// "website" additionally skips the legal Service Agreement entirely (per the
// real example proposals this was modeled on — see
// docs/proposal-types-questionnaire.md).
export default function ProposalDocument({ data, afterNextSteps }) {
  const proposalType = data.proposalType || "seo";
  const showStrategy = usesStrategyContent(proposalType);
  const showLineItems = usesLineItemInvestment(proposalType);
  const showAgreement = usesLegalAgreement(proposalType);
  const showAgencyIntro = usesAgencyIntro(proposalType);
  const showPpc = usesPpcContent(proposalType);
  const showWebsitePlaybook = usesWebsitePlaybook(proposalType);

  return (
    <div className="proposal">
      <Cover data={data} />
      {/* SOW / PPC-only / Website open with the fixed agency-credibility intro;
          full SEO / SEO+PPC build credibility their own way below instead. */}
      {showAgencyIntro && <AgencyIntroSection />}
      {showStrategy && (
        <>
          <LandscapeSection data={data} />
          <GapAnalysisSection data={data} />
          <StrategySection data={data} />
          <SourceSection data={data} />
          <AuthoritySection data={data} />
          {/* SEO+PPC bolts the PPC keyword/forecast content into the full SEO
              build-out, right before the catalog-driven Investment section. */}
          {showPpc && <PpcStrategySection data={data} />}
          <InvestmentSection data={data} />
        </>
      )}
      {showWebsitePlaybook && <WebsitePlaybookSection />}
      {/* Standalone PPC-only proposals show the PPC content here, ahead of
          their freeform line-item Investment table. */}
      {!showStrategy && showPpc && <PpcStrategySection data={data} />}
      {showLineItems && <LineItemsInvestmentSection data={data} />}
      <NextStepsSection variant={showStrategy ? "seo" : "general"} />
      {showAgreement && <ServiceAgreementSection data={data} />}
      {afterNextSteps}
      <Footer />
    </div>
  );
}
