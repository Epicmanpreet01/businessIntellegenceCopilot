import { useTheme } from "../../context/ThemeContext";
import InfoTooltip from "./InfoTooltip";

const Gauge = ({ label, value, color, t }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className={t.border
              .replace("border-", "text-")
              .replace("border", "text-neutral-200 dark:text-neutral-800")}
          />
          {/* Progress Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offset }}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${t.text}`}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <span
        className={`text-[11px] font-black uppercase tracking-widest ${t.textMuted}`}
      >
        {label}
      </span>
    </div>
  );
};

const MetricGauges = ({ analytics, totalPoints }) => {
  const { t } = useTheme();

  // Trend Strength Score
  const trendMap = { weak: 35, moderate: 65, strong: 95 };
  const trendScore = trendMap[analytics.trend.strength] || 0;

  // Seasonality Score
  let seasonalityScore =
    (analytics.seasonality.seasonal_strength_score || 0) * 100;
  seasonalityScore = seasonalityScore < 0 ? 0 : seasonalityScore;

  // Data Health (100% - anomaly density)
  const anomalyDensity =
    totalPoints > 0 ? (analytics.anomalies.length / totalPoints) * 100 : 0;
  const healthScore = Math.max(0, 100 - anomalyDensity * 5); // Scaled for visibility

  return (
    <div
      className={`${t.panelBg} rounded-[2rem] p-8 shadow-sm border ${t.border} flex flex-col h-full transition-all hover:shadow-md`}
    >
      <div className="flex items-center gap-2 mb-8">
        <h3 className={`text-lg font-bold ${t.text}`}>Analysis Reliability</h3>
        <InfoTooltip text="Gauges how certain the AI is about its findings. High scores mean the data is very clear, consistent, and follows predictable patterns." />
      </div>
      <div className="flex-1 flex items-center justify-around gap-4">
        <Gauge
          label="Trend Strength"
          value={trendScore}
          color="#f97316"
          t={t}
        />
        <Gauge
          label="Seasonality"
          value={seasonalityScore}
          color="#3b82f6"
          t={t}
        />
        <Gauge label="Data Health" value={healthScore} color="#10b981" t={t} />
      </div>
    </div>
  );
};

export default MetricGauges;
