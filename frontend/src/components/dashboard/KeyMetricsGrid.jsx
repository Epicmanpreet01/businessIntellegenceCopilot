import { useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, Activity, BarChart3, Zap, Gauge,
  AlertTriangle, Shield, Eye, RotateCcw, ShieldCheck, Rocket, Heart,
  BarChart, LineChart
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { normalizeText } from "../../utils/common";

const MetricTile = ({ 
  label, value, sub, detail, icon: Icon, 
  accentColor, badgeText, badgeColor, 
  t, colSpan = 1, rowSpan = 1, children 
}) => {
  return (
    <div className={`
      ${colSpan === 2 ? 'sm:col-span-2' : ''} 
      ${rowSpan === 2 ? 'row-span-2 sm:row-span-2' : ''} 
      ${t.panelBg} rounded-3xl border ${t.border} overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-orange-500/30 group relative flex flex-col
    `}>
      {/* Base Content */}
      <div className={`p-6 lg:p-7 flex flex-col h-full z-10 transition-opacity duration-300 group-hover:opacity-0`}>
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-2xl ${accentColor}`}>
            <Icon className={`${rowSpan === 2 ? 'w-8 h-8' : 'w-5 h-5'}`} />
          </div>
          {badgeText && (
            <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
        
        <div className="mt-auto">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.textMuted} opacity-70 mb-2`}>{label}</p>
          <div className="flex items-baseline gap-2 mb-2">
            <p className={`${rowSpan === 2 ? 'text-6xl' : colSpan === 2 ? 'text-4xl' : 'text-3xl'} font-black ${t.text} tracking-tighter leading-none`}>
              {value}
            </p>
            {rowSpan === 2 && <span className={`text-xl font-bold ${t.textMuted}`}>/100</span>}
          </div>
          {sub && <p className={`text-xs font-bold ${t.textMuted} opacity-60`}>{sub}</p>}
        </div>

        {children}
      </div>

      {/* Hover Detail Overlay */}
      {detail && (
        <div className={`absolute inset-0 ${t.name === 'dark' ? 'bg-neutral-900' : 'bg-white'} p-6 lg:p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 flex flex-col justify-center border-t-4 border-t-orange-500`}>
          <div className="flex items-center gap-3 mb-4">
             <div className={`p-2 rounded-lg ${accentColor}`}>
               <Icon className="w-4 h-4" />
             </div>
             <h4 className={`text-xs font-black uppercase tracking-[0.2em] ${t.text}`}>{label} Detail</h4>
          </div>
          <p className={`text-sm md:text-base ${t.text} leading-relaxed opacity-90`}>{detail}</p>
        </div>
      )}
    </div>
  );
};

const KeyMetricsGrid = ({ analytics }) => {
  const { t } = useTheme();

  const trendDir = analytics.trend?.direction || 'flat';
  const trendStr = analytics.trend?.strength || 'weak';
  const change7d = analytics.change?.last_7d || 0;
  const change30d = analytics.change?.last_30d || 0;
  const momentum = analytics.momentum || 'flat';
  const volatility = analytics.volatility || 'low';
  const acceleration = analytics.acceleration || 'stable';
  const forecastChange = analytics.forecast?.change_pct || 0;
  const forecastDir = analytics.forecast?.trend || 'flat';
  const anomalyCount = analytics.anomaly_summary?.count || 0;
  const recentAnomalies = analytics.anomaly_summary?.recent_count || 0;
  const riskLevel = analytics.risk_level || 'medium';
  const relPerf = analytics.relative_performance || 'average';
  const recovery = analytics.recovery_state || 'stable';
  const reliability = analytics.forecast_reliability || 'medium';

  const formatChange = (val) => `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;

  // Derived: Health Score
  const healthScore = Math.min(100, Math.max(0,
    ({ weak: 10, moderate: 20, strong: 30 }[trendStr] || 10) +
    ({ low: 25, medium: 15, high: 5 }[volatility] || 15) +
    ({ none: 20, low: 15, moderate: 10, high: 5 }[analytics.anomaly_impact] || 15) +
    ({ above_average: 15, average: 10, below_average: 5 }[relPerf] || 10) +
    ({ high: 10, medium: 6, low: 2 }[reliability] || 5)
  ));
  const healthColor = healthScore >= 75 ? 'text-emerald-500' : healthScore >= 50 ? 'text-amber-500' : 'text-red-500';
  const healthBg = healthScore >= 75 ? 'bg-emerald-500/10' : healthScore >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10';
  const healthBadge = healthScore >= 75 ? 'Healthy' : healthScore >= 50 ? 'Moderate' : 'Needs Attention';

  // Derived: Stability Index
  let stabilityScore = 100;
  if (analytics.anomaly_impact === "high") stabilityScore -= 40;
  else if (analytics.anomaly_impact === "moderate") stabilityScore -= 25;
  else if (analytics.anomaly_impact === "low") stabilityScore -= 10;
  stabilityScore -= Math.min(30, anomalyCount * 5);
  stabilityScore -= Math.min(20, recentAnomalies * 10);
  stabilityScore = Math.max(0, Math.min(100, stabilityScore));

  const getChangeBadge = (val) => val >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500';
  const getChangeStatus = (val) => val >= 0 ? 'Growing' : 'Declining';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={`p-2 rounded-xl bg-orange-500/10 text-orange-500`}>
          <LineChart className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Core Intelligence</h3>
          <p className={`text-xs ${t.textMuted}`}>Executive summary of your performance, dynamics, and data quality.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
        
        {/* ROW 1 & 2: Health (2x2), 7D (1x1), 30D (1x1), Forecast (2x1) */}
        <MetricTile 
          colSpan={2} rowSpan={2} 
          label="Composite Health" 
          value={healthScore} 
          sub="Overall business vitality index"
          badgeText={healthBadge}
          badgeColor={`${healthBg} ${healthColor}`}
          icon={Heart} accentColor={`${healthBg} ${healthColor}`}
          detail={`This is your master metric. It combines Trend Strength (30%), Volatility (25%), Anomaly Impact (20%), Relative Performance (15%), and Forecast Reliability (10%). A score of ${healthScore} indicates your business is currently ${healthBadge.toLowerCase()}.`}
          t={t}
        >
          <div className={`mt-8 pt-6 border-t ${t.name === 'dark' ? 'border-neutral-800' : 'border-neutral-200'} grid grid-cols-2 gap-4`}>
            <div>
              <p className={`text-[9px] uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Top Driver</p>
              <p className={`text-sm font-bold ${t.text}`}>{trendDir === 'upwards' ? 'Upward Trend' : volatility === 'low' ? 'Low Volatility' : 'Anomaly Impact'}</p>
            </div>
            <div>
              <p className={`text-[9px] uppercase tracking-widest ${t.textMuted} opacity-60 mb-1`}>Risk Factor</p>
              <p className={`text-sm font-bold ${t.text}`}>{volatility === 'high' ? 'High Volatility' : anomalyCount > 0 ? 'Recent Anomalies' : 'None Detected'}</p>
            </div>
          </div>
        </MetricTile>

        <MetricTile 
          label="7-Day Change" 
          value={formatChange(change7d)} 
          sub="vs previous 7 days" 
          badgeText={getChangeStatus(change7d)}
          badgeColor={getChangeBadge(change7d)}
          icon={Activity} accentColor={getChangeBadge(change7d)}
          detail={`Short-term view: Revenue ${change7d >= 0 ? 'grew' : 'dropped'} by ${Math.abs(change7d).toFixed(1)}% compared to the week before. Watch this for immediate impacts of new strategies.`}
          t={t} 
        />
        
        <MetricTile 
          label="30-Day Change" 
          value={formatChange(change30d)} 
          sub="vs previous 30 days" 
          badgeText={getChangeStatus(change30d)}
          badgeColor={getChangeBadge(change30d)}
          icon={BarChart} accentColor={getChangeBadge(change30d)}
          detail={`Mid-term view: The 30-day window shows a ${Math.abs(change30d).toFixed(1)}% ${change30d >= 0 ? 'increase' : 'decrease'}. This smooths out daily noise to reveal your true current trajectory.`}
          t={t} 
        />

        <MetricTile 
          colSpan={2} 
          label="Forecast Projection" 
          value={formatChange(forecastChange)} 
          sub="Expected growth trajectory" 
          badgeText={`${normalizeText(reliability)} Confidence`}
          badgeColor={reliability === 'high' ? 'bg-emerald-500/10 text-emerald-500' : reliability === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}
          icon={forecastDir === 'upward' ? TrendingUp : TrendingDown} 
          accentColor={forecastDir === 'upward' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
          detail={`Our AI model projects a ${Math.abs(forecastChange).toFixed(1)}% ${forecastDir === 'upward' ? 'increase' : 'decrease'} based on historical patterns. The '${normalizeText(reliability)}' confidence indicates how stable those patterns are.`}
          t={t} 
        />

        {/* ROW 3: Dynamics (4x 1x1 tiles) */}
        <MetricTile 
          label="Trend Direction" 
          value={normalizeText(trendDir)} 
          sub={`${normalizeText(trendStr)} momentum`} 
          badgeText={normalizeText(trendStr)}
          badgeColor={trendDir === 'upwards' ? 'bg-emerald-500/10 text-emerald-500' : trendDir === 'downwards' ? 'bg-red-500/10 text-red-500' : 'bg-neutral-500/10 text-neutral-500'}
          icon={trendDir === 'upwards' ? TrendingUp : trendDir === 'downwards' ? TrendingDown : Minus}
          accentColor={trendDir === 'upwards' ? 'bg-emerald-500/10 text-emerald-500' : trendDir === 'downwards' ? 'bg-red-500/10 text-red-500' : 'bg-neutral-500/10 text-neutral-500'}
          detail={`The underlying direction of your business after stripping out seasonality and noise. A '${trendStr}' strength means the trend is ${trendStr === 'strong' ? 'very clear and likely to continue' : 'faint and could reverse'}.`}
          t={t} 
        />
        
        <MetricTile 
          label="Pace" 
          value={normalizeText(acceleration)} 
          sub="Growth acceleration" 
          badgeText={acceleration === 'accelerating' ? 'Speeding Up' : acceleration === 'decelerating' ? 'Slowing Down' : 'Steady'}
          badgeColor={acceleration === 'accelerating' ? 'bg-emerald-500/10 text-emerald-500' : acceleration === 'decelerating' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}
          icon={Rocket}
          accentColor={acceleration === 'accelerating' ? 'bg-emerald-500/10 text-emerald-500' : acceleration === 'decelerating' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}
          detail={`Acceleration shows if your growth rate is changing. ${acceleration === 'accelerating' ? 'You are growing faster than before — a highly positive signal.' : acceleration === 'decelerating' ? 'Your growth is slowing down. You are still growing, but losing momentum.' : 'Your growth pace is constant.'}`}
          t={t} 
        />
        
        <MetricTile 
          label="Volatility" 
          value={normalizeText(volatility)} 
          sub="Day-to-day variance" 
          badgeText={volatility === 'low' ? 'Predictable' : volatility === 'high' ? 'Erratic' : 'Normal'}
          badgeColor={volatility === 'low' ? 'bg-emerald-500/10 text-emerald-500' : volatility === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
          icon={BarChart3}
          accentColor={volatility === 'low' ? 'bg-emerald-500/10 text-emerald-500' : volatility === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
          detail={`Measures how much your revenue swings daily. ${volatility === 'low' ? 'Low volatility means your revenue is consistent, making it easier to forecast and plan.' : 'High volatility means large, unpredictable swings. Look for ways to stabilize recurring revenue.'}`}
          t={t} 
        />

        <MetricTile 
          label="Risk Exposure" 
          value={normalizeText(riskLevel)} 
          sub="Vulnerability assessment" 
          badgeText={riskLevel === 'low' ? 'Protected' : riskLevel === 'high' ? 'Vulnerable' : 'Moderate'}
          badgeColor={riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-500' : riskLevel === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
          icon={Shield}
          accentColor={riskLevel === 'low' ? 'bg-emerald-500/10 text-emerald-500' : riskLevel === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
          detail={`Combines volatility, anomaly frequency, and trend stability. ${riskLevel === 'low' ? 'Your business is currently well-insulated from sudden shocks.' : 'Recent instability makes your business vulnerable to disruptions.'}`}
          t={t} 
        />

        {/* ROW 4: Context (4x 1x1 tiles) */}
        <MetricTile 
          label="Relative Perf." 
          value={normalizeText(relPerf)} 
          sub="vs historical baseline" 
          badgeText={relPerf === 'above_average' ? 'Outperforming' : relPerf === 'below_average' ? 'Underperforming' : 'Average'}
          badgeColor={relPerf === 'above_average' ? 'bg-emerald-500/10 text-emerald-500' : relPerf === 'below_average' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}
          icon={Eye}
          accentColor={relPerf === 'above_average' ? 'bg-emerald-500/10 text-emerald-500' : relPerf === 'below_average' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}
          detail={`Compares current performance to what's historically typical for you. ${relPerf === 'above_average' ? 'You are currently beating your own historical averages.' : 'You are trailing your typical performance levels.'}`}
          t={t} 
        />

        <MetricTile 
          label="Anomalies" 
          value={anomalyCount} 
          sub={`${recentAnomalies > 0 ? `${recentAnomalies} recent` : '0 recent'} events`} 
          badgeText={anomalyCount === 0 ? 'Clean' : anomalyCount > 5 ? 'High Noise' : 'Some Noise'}
          badgeColor={anomalyCount === 0 ? 'bg-emerald-500/10 text-emerald-500' : anomalyCount > 5 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
          icon={AlertTriangle}
          accentColor={anomalyCount === 0 ? 'bg-emerald-500/10 text-emerald-500' : anomalyCount > 5 ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
          detail={`Total unusual spikes or drops detected. ${recentAnomalies > 0 ? `${recentAnomalies} of these happened recently and may be actively skewing your numbers.` : 'None are recent, meaning your current data is relatively clean.'}`}
          t={t} 
        />

        <MetricTile 
          label="Seasonality" 
          value={normalizeText(analytics.seasonality?.strength || 'none')} 
          sub={`${normalizeText(analytics.seasonality?.dominant_period || 'No')} cycle`} 
          badgeText={analytics.seasonality?.strength === 'strong' ? 'High Impact' : 'Low Impact'}
          badgeColor="bg-cyan-500/10 text-cyan-500"
          icon={Gauge}
          accentColor="bg-cyan-500/10 text-cyan-500"
          detail={`Measures if your business has a predictable rhythm (like weekly peaks on weekends). ${analytics.seasonality?.strength === 'strong' ? 'A strong pattern exists — align your operations to match these peaks and valleys.' : 'No major recurring pattern detected.'}`}
          t={t} 
        />

        <MetricTile 
          label="Data Stability" 
          value={`${stabilityScore}`} 
          sub="Quality index (0-100)" 
          badgeText={stabilityScore >= 80 ? 'Reliable' : stabilityScore >= 60 ? 'Acceptable' : 'Noisy'}
          badgeColor={stabilityScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' : stabilityScore >= 60 ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}
          icon={ShieldCheck}
          accentColor={stabilityScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' : stabilityScore >= 60 ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}
          detail={`Reflects how clean your data is for analysis, factoring in anomaly frequency and impact. A score of ${stabilityScore} means the AI's conclusions are ${stabilityScore >= 80 ? 'built on very solid, reliable data.' : 'subject to some noise and variance.'}`}
          t={t} 
        />
      </div>
    </div>
  );
};

export default KeyMetricsGrid;
