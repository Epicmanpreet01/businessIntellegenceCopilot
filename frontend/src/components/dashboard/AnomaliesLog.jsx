import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AnomaliesLog = ({ data }) => {
  const { t, isDark } = useTheme();
  const anomalies = data.filter((d) => d.anomaly !== null).reverse();

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} flex flex-col transition-all hover:shadow-md`}
    >
      <h3 className={`text-lg font-bold ${t.text} mb-6`}>
        Recent Anomalies Log
      </h3>
      <div
        className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2"
        style={{ maxHeight: "260px" }}
      >
        {anomalies.map((d, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-4 rounded-xl border ${t.border} ${isDark ? "hover:bg-neutral-800" : "hover:bg-slate-50"} transition-colors cursor-default`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2.5 rounded-lg ${d.anomaly > d.historical ? t.emeraldSoft : t.redSoft}`}
              >
                {d.anomaly > d.historical ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${t.text}`}>{d.date}</p>
                <p className={`text-xs ${t.textMuted} mt-0.5`}>
                  {d.anomaly > d.historical
                    ? "Unexpected Spike Detected"
                    : "Severe Drop Detected"}
                </p>
              </div>
            </div>
            <div className={`text-base font-bold ${t.text}`}>
              ${Math.round(d.anomaly)}
            </div>
          </div>
        ))}
        {anomalies.length === 0 && (
          <p className={`text-sm ${t.textMuted} text-center py-10`}>
            No anomalies detected in the selected period.
          </p>
        )}
      </div>
    </div>
  );
};

export default AnomaliesLog;
