import { Lightbulb, ArrowRight } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { useTheme } from "../../context/ThemeContext";

const Recommendations = ({ recommendations }) => {
  const { t, isDark } = useTheme();

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} flex flex-col transition-all hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${t.amberSoft}`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className={`text-lg font-bold ${t.text}`}>Actionable Steps</h3>
          <InfoTooltip text="AI-suggested improvements and strategies based on your data patterns to help you capitalize on growth or mitigate risks." />
        </div>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 max-h-[480px] custom-scrollbar scroll-smooth">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 p-4 rounded-xl border ${t.border} ${isDark ? "bg-neutral-900/40" : "bg-slate-50"} transition-all duration-300 hover:translate-x-1 hover:border-orange-500/30 hover:shadow-sm cursor-default`}
          >
            <ArrowRight
              className={`w-5 h-5 ${t.primaryText} shrink-0 mt-0.5`}
            />
            <p className={`${t.text} font-medium text-sm leading-relaxed`}>
              {rec}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
