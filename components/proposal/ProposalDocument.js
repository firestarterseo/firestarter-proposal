import "./proposal.css";
import Cover from "./Cover";
import LandscapeSection from "./LandscapeSection";
import GapAnalysisSection from "./GapAnalysisSection";
import StrategySection from "./StrategySection";
import SourceSection from "./SourceSection";
import AuthoritySection from "./AuthoritySection";
import InvestmentSection from "./InvestmentSection";
import NextStepsSection from "./NextStepsSection";
import Footer from "./Footer";

// Single source of truth for the proposal's visual output — used by both the
// internal editor's live preview and the public /view/[token] page, so they
// can never drift apart. `afterNextSteps` is where the public page injects
// the accept/decline form; the internal preview omits it.
export default function ProposalDocument({ data, afterNextSteps }) {
  return (
    <div className="proposal">
      <Cover data={data} />
      <LandscapeSection data={data} />
      <GapAnalysisSection data={data} />
      <StrategySection data={data} />
      <SourceSection data={data} />
      <AuthoritySection data={data} />
      <InvestmentSection data={data} />
      <NextStepsSection />
      {afterNextSteps}
      <Footer />
    </div>
  );
}
