import { Waves } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { normalizeText } from "../../utils/common";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const color = value >= 0 ? t.chart.line : "#ef4444";
    return (
      <div className={`${t.panelBg} border ${t.border} p-3 rounded-xl shadow-lg`}>
        <p className={`text-[10px] font-bold mb-1 ${t.textMuted} uppercase`}>{label}</p>
        <p className="text-sm font-bold" style={{ color }}>Impact: {value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const SeasonalityDeepDive = ({ analytics, seasonalityData }) => {
  const { t, isDark } = useTheme();
  const seasonality = analytics.seasonality || {};
  const pattern = seasonality.pattern || "none";
  const strength = seasonality.strength || "none";
  const score = seasonality.seasonal_strength_score || 0;
  const dominantPeriod = seasonality.dominant_period || null;

  const strengthColor = { strong: "text-orange-500", medium: "text-amber-500", weak: "text-blue-500", none: "text-neutral-500" }[strength];
  const strengthBarColor = { strong: "bg-orange-500", medium: "bg-amber-500", weak: "bg-blue-500", none: "bg-neutral-500" }[strength];

  const patternDisplay = pattern === "none" || pattern === "error" || pattern === "insufficient_data"
    ? "No Pattern Detected"
    : pattern.charAt(0).toUpperCase() + pattern.slice(1);

  // Build narrative
  const narrative = (() => {
    if (strength === 'none' || pattern === 'none' || pattern === 'insufficient_data' || pattern === 'error') {
      return 'No clear recurring pattern was found. Your business performs relatively evenly across time periods, meaning external factors likely matter more than timing.';
    }
    const cycleName = dominantPeriod === 'yearly' ? 'yearly' : 'weekly';
    const scorePct = (score * 100).toFixed(0);
    if (strength === 'strong') return `Your business follows a strong ${cycleName} rhythm (${scorePct}% seasonal influence) — ${patternDisplay.toLowerCase()}. Planning around this cycle could significantly improve your results.`;
    if (strength === 'medium') return `A moderate ${cycleName} pattern is visible (${scorePct}% seasonal influence) — ${patternDisplay.toLowerCase()}. Adjusting your operations to match this rhythm could yield measurable benefits.`;
    return `A subtle ${cycleName} pattern was detected (${scorePct}% seasonal influence) — ${patternDisplay.toLowerCase()}. This is mild, so it may not require major strategy changes.`;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500"><Waves className="w-5 h-5" /></div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Your Business Rhythm</h3>
          <p className={`text-xs ${t.textMuted}`}>Does your business follow a natural cycle? Here's what we found.</p>
        </div>
      </div>

      <div className={`${t.panelBg} rounded-[2rem] p-8 lg:p-10 border ${t.border} transition-all hover:shadow-md`}>
        {/* Narrative + Pattern info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {dominantPeriod && (
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-500`}>
                {dominantPeriod} Cycle
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${t.textMuted}`}>Strength:</span>
              <span className={`text-sm font-black ${strengthColor}`}>{normalizeText(strength)}</span>
              <div className={`w-16 h-1.5 rounded-full ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'} overflow-hidden`}>
                <div className={`h-full rounded-full ${strengthBarColor} transition-all duration-1000`} style={{ width: `${score * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <p className={`text-sm ${t.text} leading-relaxed opacity-80 mb-8`}>{narrative}</p>

        {/* Distribution Chart */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className={`text-sm font-bold ${t.text}`}>{dominantPeriod === 'yearly' ? 'Monthly' : 'Weekly'} Distribution</h4>
            <InfoTooltip text="Bars above zero show periods with above-average seasonal effect. Below zero indicates below-average. This isolates the recurring pattern from your overall trend." />
          </div>
          <div className="h-[200px] w-full">
            {seasonalityData && seasonalityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonalityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.chart.grid} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.chart.text, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 10, fill: t.chart.text, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val > 0 ? '+' : ''}${val.toFixed(0)}`} />
                  <RechartsTooltip cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }} content={<CustomTooltip t={t} />} />
                  <ReferenceLine y={0} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                  <Bar dataKey="avg" radius={[3, 3, 0, 0]} barSize={28}>
                    {seasonalityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.avg >= 0 ? t.chart.line : "#f43f5e"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <Waves className={`w-8 h-8 ${t.textMuted} mb-2`} />
                <p className={`text-sm ${t.textMuted} text-center`}>Insufficient data for seasonal distribution.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalityDeepDive;
