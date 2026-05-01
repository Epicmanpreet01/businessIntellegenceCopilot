import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { useTheme } from "../../context/ThemeContext";

const AnomaliesLog = ({ anomalies = [], analytics }) => {
  const { t, isDark } = useTheme();

  // Reverse to show most recent first
  const sortedAnomalies = [...anomalies].reverse();

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} flex flex-col transition-all hover:shadow-md h-full`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h3 className={`text-lg font-bold ${t.text}`}>
            Recent Anomalies Log
          </h3>
          <InfoTooltip text="A detailed history of every time your revenue was significantly higher (spike) or lower (drop) than the AI's expected range." />
        </div>
        {anomalies.length > 0 && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${t.border} ${t.textMuted}`}>
            Recent Bias: <span className={analytics?.anomaly_bias === 'positive_bias' ? 'text-emerald-500' : analytics?.anomaly_bias === 'negative_bias' ? 'text-red-500' : ''}>{analytics?.anomaly_bias?.replace('_', ' ') || 'None'}</span>
          </div>
        )}
      </div>
      <div
        className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2"
        style={{ maxHeight: "260px" }}
      >
        {sortedAnomalies.map((d, i) => {
          const date = new Date(d.ds).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-xl border ${t.border} ${isDark ? "hover:bg-neutral-800" : "hover:bg-slate-50"} transition-colors cursor-default`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-lg ${d.type === "spike" ? t.emeraldSoft : t.redSoft}`}
                >
                  {d.type === "spike" ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${t.text}`}>{date}</p>
                  <p className={`text-xs ${t.textMuted} mt-0.5 capitalize`}>
                    {d.severity} {d.type} detected
                  </p>
                </div>
              </div>
              <div className={`text-base font-bold ${t.text}`}>
                ${Math.round(d.y)}
              </div>
            </div>
          );
        })}
        {sortedAnomalies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <AlertCircle className={`w-8 h-8 ${t.textMuted} mb-2`} />
            <p className={`text-sm ${t.textMuted} text-center`}>
              No anomalies detected in this dataset.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomaliesLog;
