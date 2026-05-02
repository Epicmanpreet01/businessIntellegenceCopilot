import { Activity, Wind } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { normalizeText } from "../../utils/common";

const MarketPersonality = ({ analytics, t }) => {
  // Build a rich narrative that weaves in volatility, momentum, recovery
  const narrative = (() => {
    const profile = analytics.behavior_profile;
    const vol = analytics.volatility;
    const mom = analytics.momentum;
    const recovery = analytics.recovery_state;

    let text = '';

    if (profile === 'stable_growth') text = 'Your business has the personality of a steady climber — growing reliably without wild swings. This is the most desirable profile for sustained success.';
    else if (profile === 'volatile_growth') text = "You're growing, but the ride is bumpy. High volatility with upward momentum means opportunity exists, but so does risk.";
    else if (profile === 'unstable_decline') text = 'Instability paired with declining performance signals a challenging phase. Stabilizing operations should be the top priority.';
    else if (vol === 'low' && mom === 'flat') text = 'Your business is in a quiet, stable phase — consistent but not growing. Look for new catalysts to break the plateau.';
    else text = 'Your business is in a balanced state — no extreme signals detected. A good foundation to build from.';

    // Weave in additional context
    const extras = [];
    if (vol === 'high') extras.push('day-to-day revenue is highly unpredictable');
    else if (vol === 'low') extras.push('revenue patterns are stable and predictable');
    
    if (mom === 'strong_positive') extras.push('short-term momentum is strongly positive');
    else if (mom === 'positive') extras.push('recent momentum is trending upward');
    else if (mom === 'strong_negative') extras.push('short-term momentum is sharply negative');
    else if (mom === 'negative') extras.push('recent momentum has turned negative');

    if (recovery === 'recovering') extras.push('active recovery from a recent dip is underway');

    if (extras.length > 0) {
      text += ` Specifically, ${extras.join(', ')}.`;
    }

    return text;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Wind className="w-5 h-5" /></div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>What Kind of Business Are You?</h3>
          <p className={`text-xs ${t.textMuted}`}>Your business's behavioral DNA — how it moves, reacts, and recovers.</p>
        </div>
      </div>

      <div className={`${t.panelBg} rounded-[2rem] p-8 lg:p-10 border ${t.border} relative overflow-hidden group hover:shadow-lg transition-all`}>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <Activity size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
          {/* Behavior Profile */}
          <div className="flex flex-col gap-4 shrink-0 lg:min-w-[200px]">
            <span className={`self-start px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500`}>
              Behavior Profile
            </span>
            <h4 className={`text-4xl lg:text-5xl font-black ${t.text} uppercase tracking-tighter leading-none`}>
              {normalizeText(analytics.behavior_profile) || "Analyzing..."}
            </h4>
          </div>

          <div className={`hidden lg:block w-px self-stretch ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

          {/* Narrative explanation */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h4 className={`text-sm font-bold ${t.text}`}>What This Means</h4>
              <InfoTooltip text="Your behavior profile combines trend direction, volatility, and momentum into a single archetype that describes how your business performs over time." />
            </div>
            <p className={`text-base ${t.text} leading-relaxed opacity-80`}>{narrative}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPersonality;
