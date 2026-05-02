import { Target, ArrowRight } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { useTheme } from "../../context/ThemeContext";
import { formatModelText } from "../../utils/common";

const Recommendations = ({ recommendations }) => {
  const { t, isDark } = useTheme();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className={`${t.panelBg} rounded-[2.5rem] p-10 border ${t.border}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2.5 rounded-xl bg-amber-500/10 text-amber-500`}>
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${t.text}`}>Strategic Action Plan</h3>
          <p className={`text-sm ${t.textMuted}`}>AI-generated recommendations based on your unique data patterns to maximize your momentum.</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-5 rounded-2xl border ${t.border} ${isDark ? "bg-neutral-900/40" : "bg-slate-50"} transition-all duration-300 hover:translate-x-2 hover:border-amber-500/40 hover:shadow-md cursor-default group`}
          >
            <div className={`p-2 rounded-full bg-amber-500/20 text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
              <ArrowRight className={`w-4 h-4`} />
            </div>
            <p className={`${t.text} font-medium text-sm leading-relaxed flex-1`}>
              {formatModelText(rec)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
