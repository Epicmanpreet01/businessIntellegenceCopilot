import { Heart } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

const BusinessHealthScorecard = ({ analytics, t }) => {
  const trendMap = { weak: 10, moderate: 20, strong: 30 };
  const volMap = { low: 25, medium: 15, high: 5 };
  const impactMap = { none: 20, low: 15, moderate: 10, high: 5 };
  const relMap = { above_average: 15, average: 10, below_average: 5 };
  const reliMap = { high: 10, medium: 6, low: 2 };

  const compositeScore = Math.min(100, Math.max(0,
    (trendMap[analytics.trend?.strength] || 10) +
    (volMap[analytics.volatility] || 15) +
    (impactMap[analytics.anomaly_impact] || 15) +
    (relMap[analytics.relative_performance] || 10) +
    (reliMap[analytics.forecast_reliability] || 5)
  ));

  const scoreColor = compositeScore >= 75 ? "text-emerald-500" : compositeScore >= 50 ? "text-amber-500" : "text-red-500";
  const scoreLabel = compositeScore >= 75 ? "Healthy" : compositeScore >= 50 ? "Moderate" : "Needs Attention";
  const barColor = compositeScore >= 75 ? "bg-emerald-500" : compositeScore >= 50 ? "bg-amber-500" : "bg-red-500";

  // Build a flowing narrative from signals
  const trendText = (() => {
    const dir = analytics.trend?.direction;
    const str = analytics.trend?.strength;
    if (dir === 'upwards') return `trending ${str === 'strong' ? 'strongly' : str === 'moderate' ? 'steadily' : 'gently'} upward`;
    if (dir === 'downwards') return `experiencing a ${str === 'strong' ? 'significant' : 'gradual'} decline`;
    return 'holding flat without a clear direction';
  })();

  const momentumText = (() => {
    const m = analytics.momentum;
    if (m === 'strong_positive') return 'Strong recent momentum is accelerating your growth.';
    if (m === 'positive') return 'Recent momentum is positive, adding to your trajectory.';
    if (m === 'strong_negative') return 'A sharp recent pullback is dragging performance down.';
    if (m === 'negative') return 'Short-term momentum has turned negative.';
    return 'Short-term momentum is neutral.';
  })();

  const contextParts = [];
  if (analytics.volatility === 'high') contextParts.push('high day-to-day unpredictability');
  else if (analytics.volatility === 'low') contextParts.push('stable, predictable revenue');
  if (analytics.relative_performance === 'above_average') contextParts.push('above-average recent results');
  else if (analytics.relative_performance === 'below_average') contextParts.push('below-average recent results');
  if (analytics.recovery_state === 'recovering') contextParts.push('active recovery');
  if (analytics.acceleration === 'accelerating') contextParts.push('accelerating growth');
  else if (analytics.acceleration === 'decelerating') contextParts.push('slowing growth');
  const contextText = contextParts.length > 0 ? `Key factors: ${contextParts.join(', ')}.` : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500"><Heart className="w-5 h-5" /></div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>How Healthy Is Your Business?</h3>
          <p className={`text-xs ${t.textMuted}`}>One score that combines every signal we track.</p>
        </div>
      </div>

      <div className={`${t.panelBg} rounded-[2rem] p-8 lg:p-10 border ${t.border} transition-all hover:shadow-md`}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Compact Score */}
          <div className="flex flex-col items-center gap-3 shrink-0 lg:min-w-[140px]">
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black ${scoreColor}`}>{compositeScore}</span>
              <span className={`text-lg font-bold ${t.textMuted}`}>/100</span>
            </div>
            <div className={`w-full h-2 rounded-full ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'} overflow-hidden`}>
              <div className={`h-full rounded-full ${barColor} transition-all duration-1000`} style={{ width: `${compositeScore}%` }} />
            </div>
            <span className={`text-xs font-black uppercase tracking-widest ${scoreColor}`}>{scoreLabel}</span>
          </div>

          <div className={`hidden lg:block w-px self-stretch ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

          {/* Narrative */}
          <div className="flex-1">
            <p className={`text-base ${t.text} leading-relaxed mb-3`}>
              Your business is <span className="font-bold">{trendText}</span>. {momentumText}
            </p>
            {contextText && (
              <p className={`text-sm ${t.textMuted} leading-relaxed italic`}>{contextText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHealthScorecard;
