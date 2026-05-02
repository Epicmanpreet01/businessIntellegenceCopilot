import { Search, ChevronRight } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { useTheme } from "../../context/ThemeContext";
import { formatModelText } from "../../utils/common";

const AnalysisReasons = ({ reasons }) => {
  const { t } = useTheme();

  if (!reasons || reasons.length === 0) return null;

  return (
    <div className={`${t.panelBg} rounded-[2rem] p-8 border ${t.border} mt-8`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl bg-blue-500/10 text-blue-500`}>
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Why This Is Happening</h3>
          <p className={`text-xs ${t.textMuted}`}>The core drivers and behavioral patterns fueling your current performance.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border ${t.border} hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group`}>
            <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 font-bold text-xs shrink-0 mt-0.5`}>
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.text} leading-relaxed`}>
                {formatModelText(reason)}
              </p>
            </div>
            <ChevronRight className={`w-4 h-4 ${t.textMuted} opacity-0 group-hover:opacity-100 transition-all`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisReasons;
