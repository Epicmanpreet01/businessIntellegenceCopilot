import { UploadCloud, CheckCircle2, RefreshCw } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import LoadingSpinner from "../layout/LoadingSpinner";

const UploadHero = ({ isAnalyzing, handleFileUpload, dataLength }) => {
  const { t, isDark } = useTheme();

  if (isAnalyzing) {
    return (
      <div
        className={`${t.panelBg} border ${t.border} rounded-3xl p-14 text-center shadow-sm animate-in zoom-in-95 duration-500`}
      >
        <div className="flex items-center justify-center mx-auto mb-8">
          <div className="relative">
            <LoadingSpinner
              fullScreen={false}
              size="large"
              color="var(--color-orange-600)"
            />
            <div className="absolute inset-0 blur-2xl bg-orange-500/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h3 className={`text-2xl font-bold ${t.text} mb-3 tracking-tight`}>
          Analyzing Dataset...
        </h3>
        <p className={`${t.textMuted} mb-10 text-lg max-w-md mx-auto`}>
          Our AI engine is currently extracting signals, forecasting trends, and
          generating insights.
        </p>

        <div
          className={`max-w-md mx-auto space-y-4 text-left p-6 rounded-2xl border ${t.border} ${
            isDark ? "bg-neutral-900/50" : "bg-neutral-50"
          }`}
        >
          <div className="flex items-center text-sm font-medium text-emerald-500">
            <CheckCircle2 className="w-5 h-5 mr-3" /> Data cleaned & structured
          </div>
          <div className="flex items-center text-sm font-medium text-emerald-500">
            <CheckCircle2 className="w-5 h-5 mr-3" /> Signals extracted (trend,
            seasonality)
          </div>
          <div
            className={`flex items-center text-sm font-medium animate-pulse ${t.primaryText}`}
          >
            <RefreshCw className="w-5 h-5 mr-3 animate-spin" /> Generating AI
            explanations...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleFileUpload}
      className={`${t.panelBg} border-2 border-dashed ${isDark ? "border-neutral-700 hover:border-orange-500" : "border-neutral-300 hover:border-orange-500 hover:bg-orange-50/30"} rounded-3xl p-14 text-center transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md`}
    >
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2 ${t.primarySoft}`}
      >
        <UploadCloud className="w-12 h-12" />
      </div>
      <h3 className={`text-2xl font-bold ${t.text} mb-3`}>
        {dataLength > 0 ? "Start a New Analysis" : "Analyze your Data"}
      </h3>
      <p className={`${t.textMuted} mb-8 max-w-md mx-auto text-lg`}>
        Drag and drop your time-series CSV file here, or click to browse your
        computer.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
        <span className={`flex items-center gap-2 ${t.textMuted}`}>
          <CheckCircle2 className={`w-5 h-5 ${t.primaryText}`} /> Date column
        </span>
        <span className={`flex items-center gap-2 ${t.textMuted}`}>
          <CheckCircle2 className={`w-5 h-5 ${t.primaryText}`} /> Metric column
        </span>
      </div>
    </div>
  );
};

export default UploadHero;
