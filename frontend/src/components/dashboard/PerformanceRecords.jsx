import { History } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

const PerformanceRecords = ({ analytics, t }) => {
  const peak = analytics.extremes?.peak || { value: 0, date: new Date() };
  const trough = analytics.extremes?.trough || { value: 0, date: new Date() };
  const range = peak.value - trough.value;

  const peakDate = new Date(peak.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const troughDate = new Date(trough.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const narrative = (() => {
    const spread = range > 0 ? `$${range.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'N/A';
    let text = `Your business reached its highest point of $${peak.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} on ${peakDate}`;
    text += `, and its lowest point of $${trough.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} on ${troughDate}`;
    text += ` — a ${spread} range. `;

    if (range / (peak.value || 1) > 0.5) {
      text += 'This wide spread suggests your business has experienced significant ups and downs. Understanding what drove both extremes can help you replicate peaks and avoid troughs.';
    } else {
      text += 'This relatively contained range shows your business has operated within a stable band, which is a positive sign of consistency.';
    }
    return text;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><History className="w-5 h-5" /></div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Your Track Record</h3>
          <p className={`text-xs ${t.textMuted}`}>The highest and lowest points your business has ever reached.</p>
        </div>
      </div>

      <div className={`${t.panelBg} rounded-[2rem] p-8 lg:p-10 border ${t.border} transition-all hover:shadow-md`}>
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Compact peak/trough display */}
          <div className="flex flex-col gap-6 shrink-0 lg:min-w-[200px]">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>All-Time Peak</p>
              <p className="text-3xl font-black text-emerald-500 tracking-tighter">${peak.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className={`text-[10px] font-bold ${t.textMuted} mt-1 opacity-50`}>{peakDate}</p>
            </div>
            <div className={`h-px ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>All-Time Low</p>
              <p className="text-3xl font-black text-red-500 tracking-tighter">${trough.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className={`text-[10px] font-bold ${t.textMuted} mt-1 opacity-50`}>{troughDate}</p>
            </div>
          </div>

          <div className={`hidden lg:block w-px self-stretch ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

          {/* Narrative */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h4 className={`text-sm font-bold ${t.text}`}>What This Means</h4>
              <InfoTooltip text="Your all-time highs and lows across the dataset. Understanding this range helps you set realistic targets and identify what drove exceptional performance." />
            </div>
            <p className={`text-base ${t.text} leading-relaxed opacity-80`}>{narrative}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRecords;
