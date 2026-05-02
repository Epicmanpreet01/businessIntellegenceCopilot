import { Compass } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { normalizeText } from "../../utils/common";

const StrategicOutlook = ({ analytics, t }) => {
  // Build a comprehensive narrative weaving risk, alignment, and opportunity
  const narrative = (() => {
    const risk = analytics.risk_level;
    const alignment = analytics.trend_alignment;
    const opp = analytics.opportunity_level;

    let text = '';

    // Risk
    if (risk === 'high') text += 'Your risk exposure is elevated — recent volatility or downward trends make your business more vulnerable to shocks. ';
    else if (risk === 'medium') text += 'Your risk level is moderate — no immediate threats, but some vulnerability exists. ';
    else text += 'Your risk level is low — the business shows strong resistance to disruptions. ';

    // Alignment
    if (alignment === 'aligned') text += 'Your historical trends and AI forecast are aligned, which means predictions are more reliable and planning is safer. ';
    else text += 'A potential reversal is expected — the forecast diverges from historical patterns, so prepare for a possible shift in direction. ';

    // Opportunity
    if (opp === 'high') text += 'Growth opportunity is high — positive momentum and favorable conditions make this an excellent time to invest in expansion.';
    else if (opp === 'medium') text += 'Moderate growth opportunity exists — conditions are favorable but not exceptional. Proceed with measured optimism.';
    else text += 'Growth opportunity is limited at present. Focus on strengthening your current position before pursuing aggressive expansion.';

    return text;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Compass className="w-5 h-5" /></div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>What Should You Prepare For?</h3>
          <p className={`text-xs ${t.textMuted}`}>Your risk exposure, trend alignment, and growth opportunities.</p>
        </div>
      </div>

      <div className={`${t.panelBg} rounded-[2rem] p-8 lg:p-10 border ${t.border} transition-all hover:shadow-md`}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Key indicators — compact inline display, not separate cards */}
          <div className="flex flex-col gap-5 shrink-0 lg:min-w-[180px]">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Risk Level</p>
              <p className={`text-2xl font-black tracking-tight ${analytics.risk_level === 'low' ? 'text-emerald-500' : analytics.risk_level === 'high' ? 'text-red-500' : 'text-amber-500'}`}>
                {normalizeText(analytics.risk_level)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Trend Alignment</p>
              <p className={`text-2xl font-black tracking-tight ${analytics.trend_alignment === 'aligned' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {normalizeText(analytics.trend_alignment)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Opportunity</p>
              <p className={`text-2xl font-black tracking-tight ${analytics.opportunity_level === 'high' ? 'text-emerald-500' : analytics.opportunity_level === 'low' ? 'text-red-500' : 'text-amber-500'}`}>
                {normalizeText(analytics.opportunity_level)}
              </p>
            </div>
          </div>

          <div className={`hidden lg:block w-px self-stretch ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

          {/* Narrative */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h4 className={`text-sm font-bold ${t.text}`}>Strategic Assessment</h4>
              <InfoTooltip text="Synthesizes your risk, trend alignment, and growth opportunity into a strategic picture. Risk is based on volatility and anomaly impact. Alignment compares historical patterns with forecasts." />
            </div>
            <p className={`text-base ${t.text} leading-relaxed opacity-80`}>{narrative}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicOutlook;
