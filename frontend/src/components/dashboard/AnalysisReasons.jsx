import { CheckCircle2, ChevronRight } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { useTheme } from "../../context/ThemeContext";

const AnalysisReasons = ({ reasons }) => {
  const { t } = useTheme();

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} transition-all hover:shadow-md h-full`}
    >
      <div className="flex items-center gap-2 mb-6">
        <h3 className={`text-lg font-bold ${t.text}`}>Root Cause Analysis</h3>
        <InfoTooltip text="The 'Why' behind your numbers. This section explains the logical factors the AI identified as primary drivers for your current performance." />
      </div>
      <div className="space-y-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-4 group">
            <div
              className={`p-1 rounded-full mt-1 ${t.primarySoft} group-hover:scale-110 transition-transform`}
            >
              <CheckCircle2 className={`w-4 h-4 ${t.primaryText}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.text} leading-snug`}>
                {reason}
              </p>
            </div>
            <ChevronRight
              className={`w-4 h-4 ${t.textMuted} opacity-0 group-hover:opacity-100 transition-all`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisReasons;
