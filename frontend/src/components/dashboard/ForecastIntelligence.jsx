import { TrendingUp, TrendingDown, Gauge } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { normalizeText } from "../../utils/common";

const ForecastIntelligence = ({ analytics, t }) => {
  const forecast = analytics.forecast || {};
  const trendDirection = forecast.trend || "flat";
  const changePct = forecast.change_pct || 0;
  const strength = forecast.strength || "weak";
  const volatility = forecast.volatility || "low";
  const consistency = forecast.consistency || "mixed";
  const confidence = forecast.confidence || "low";
  const peak = forecast.peak || { index: 0, value: 0 };
  const dip = forecast.dip || { index: 0, value: 0 };
  const isUp = trendDirection === "upward";
  const strengthPct = { weak: 25, moderate: 55, strong: 90 }[strength] || 25;

  // Build narrative
  const narrative = (() => {
    const dir = isUp ? 'grow' : 'decline';
    const mag = Math.abs(changePct).toFixed(1);

    let text = `The AI projects a ${mag}% ${dir} with ${confidence} confidence. `;

    if (consistency === 'consistent_growth') text += 'The forecast shows consistently upward movement';
    else if (consistency === 'consistent_decline') text += 'The forecast shows a sustained downward path';
    else text += 'The projected path shows mixed signals';

    if (volatility === 'low') text += ' and low volatility, meaning a smooth trajectory is expected. ';
    else if (volatility === 'high') text += ', though high volatility means the actual path could be bumpy. ';
    else text += ' with some expected fluctuations along the way. ';

    text += `The projected range spans from $${dip.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} (floor) to $${peak.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} (peak).`;

    return text;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500"><Gauge className="w-5 h-5" /></div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>What's Coming Next?</h3>
          <p className={`text-xs ${t.textMuted}`}>Our AI's best prediction for your upcoming performance.</p>
        </div>
      </div>

      <div className={`${t.panelBg} rounded-[2rem] p-8 lg:p-10 border ${t.border} transition-all hover:shadow-md`}>
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Direction Hero */}
          <div className="flex flex-col items-center gap-4 shrink-0 lg:min-w-[180px]">
            <div className={`p-5 rounded-2xl ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {isUp ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
            </div>
            <div className="text-center">
              <p className={`text-4xl font-black ${t.text} tracking-tighter`}>
                {changePct >= 0 ? "+" : ""}{changePct.toFixed(1)}%
              </p>
              <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} mt-1`}>Projected Change</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {isUp ? "Bullish" : "Bearish"} Outlook
            </span>
            {/* Signal strength bar */}
            <div className="w-full space-y-1">
              <div className="flex justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest ${t.textMuted} opacity-60`}>Signal Strength</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${t.text}`}>{normalizeText(strength)}</span>
              </div>
              <div className={`h-1.5 w-full rounded-full ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'} overflow-hidden`}>
                <div className={`h-full rounded-full transition-all duration-1000 ${isUp ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${strengthPct}%` }} />
              </div>
            </div>
          </div>

          <div className={`hidden lg:block w-px self-stretch ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

          {/* Narrative — replaces 4 separate cards */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <h4 className={`text-sm font-bold ${t.text}`}>What This Means For You</h4>
              <InfoTooltip text="A plain-English interpretation of the forecast signals — volatility, consistency, confidence, and projected range." />
            </div>
            <p className={`text-base ${t.text} leading-relaxed mb-6 opacity-80`}>{narrative}</p>

            {/* Inline range display */}
            <div className={`flex gap-8 pt-5 border-t ${t.name === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Projected Peak</p>
                <p className={`text-xl font-black text-emerald-500`}>${peak.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Projected Floor</p>
                <p className={`text-xl font-black text-red-500`}>${dip.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>AI Confidence</p>
                <p className={`text-xl font-black ${confidence === 'high' ? 'text-emerald-500' : confidence === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>{normalizeText(confidence)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastIntelligence;
