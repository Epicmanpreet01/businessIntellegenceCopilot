import InfoTooltip from "./InfoTooltip";
import { normalizeText } from "../../utils/common";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";

const AnomalyIntelligenceStrip = ({ analytics, t }) => {
  const summary = analytics.anomaly_summary || { count: 0, recent_count: 0 };
  const impact = analytics.anomaly_impact || "none";
  const bias = analytics.anomaly_bias || "none";

  let stabilityScore = 100;
  if (impact === "high") stabilityScore -= 40;
  else if (impact === "moderate") stabilityScore -= 25;
  else if (impact === "low") stabilityScore -= 10;
  stabilityScore -= Math.min(30, summary.count * 5);
  stabilityScore -= Math.min(20, summary.recent_count * 10);
  stabilityScore = Math.max(0, Math.min(100, stabilityScore));

  const stabilityLabel = stabilityScore >= 80 ? "Excellent" : stabilityScore >= 60 ? "Good" : stabilityScore >= 40 ? "Fair" : "Poor";
  const stabilityColor = stabilityScore >= 80 ? "text-emerald-500" : stabilityScore >= 60 ? "text-blue-500" : stabilityScore >= 40 ? "text-amber-500" : "text-red-500";
  const barColor = stabilityScore >= 80 ? "bg-emerald-500" : stabilityScore >= 60 ? "bg-blue-500" : stabilityScore >= 40 ? "bg-amber-500" : "bg-red-500";

  // Build narrative
  const narrative = (() => {
    if (summary.count === 0) {
      return 'Your data is clean — no unusual spikes or drops were detected. This contributes to a strong stability index.';
    }

    let text = `We detected `;
    text += `${summary.count} unusual event${summary.count !== 1 ? 's' : ''} in your data`;

    if (summary.recent_count > 0) {
      text += `, ${summary.recent_count} of which occurred in the past week`;
    } else {
      text += ', but none occurred recently';
    }
    text += '. ';

    if (impact === 'high') text += 'These events have had a significant impact on your overall metrics. ';
    else if (impact === 'moderate') text += 'The impact on your metrics has been moderate. ';
    else if (impact === 'low') text += 'The impact has been minor. ';

    if (bias === 'positive_bias') text += 'Recent anomalies lean toward positive spikes — a favorable sign.';
    else if (bias === 'negative_bias') text += 'Recent anomalies lean toward drops — worth monitoring closely.';
    else if (bias === 'neutral') text += 'Anomalies are evenly split between spikes and drops.';

    return text;
  })();

  return (
    <div className={`${t.panelBg} rounded-[2rem] p-8 border ${t.border} transition-all hover:shadow-md`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-bold ${t.text}`}>Anomaly Intelligence</h3>
          <InfoTooltip text="A consolidated assessment of unusual events in your data — their frequency, impact, and direction." />
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Stability:</span>
          <span className={`text-base font-black ${stabilityColor}`}>
            <AnimatedNumber value={stabilityScore} duration={1500} />/100
          </span>
          <div className={`w-16 h-1.5 rounded-full ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'} overflow-hidden`}>
            <motion.div 
              className={`h-full rounded-full ${barColor}`} 
              initial={{ width: 0 }}
              whileInView={{ width: `${stabilityScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
            />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${stabilityColor}`}>{stabilityLabel}</span>
        </div>
      </div>

      <p className={`text-sm ${t.text} leading-relaxed opacity-80 mb-6`}>{narrative}</p>

      {/* Inline metrics display */}
      <div className={`flex flex-wrap gap-8 pt-5 border-t ${t.name === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Recent Anomalies</p>
          <p className={`text-xl font-black ${summary.recent_count === 0 ? 'text-emerald-500' : summary.recent_count < 3 ? 'text-amber-500' : 'text-red-500'}`}>
            <AnimatedNumber value={summary.recent_count} duration={1500} />
          </p>
        </div>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Overall Impact</p>
          <p className={`text-xl font-black ${impact === 'none' || impact === 'low' ? 'text-emerald-500' : impact === 'moderate' ? 'text-amber-500' : 'text-red-500'}`}>{normalizeText(impact || 'Unknown')}</p>
        </div>
        <div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Directional Bias</p>
          <p className={`text-xl font-black ${bias === 'positive_bias' ? 'text-emerald-500' : bias === 'negative_bias' ? 'text-red-500' : 'text-amber-500'}`}>{normalizeText(bias || 'Unknown')}</p>
        </div>
      </div>
    </div>
  );
};

export default AnomalyIntelligenceStrip;
