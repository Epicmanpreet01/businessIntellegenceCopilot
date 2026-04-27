import {
  TrendingDown,
  LineChart as LineChartIcon,
  AlertCircle,
  Clock3,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const RecentAnalyses = () => {
  const { t, isDark } = useTheme();

  const analyses = [
    {
      title: "Q1_Marketing_Spend_vs_ROI.csv",
      date: "2 hours ago",
      records: "1,240 rows",
      icon: <TrendingDown className="w-5 h-5 text-red-500" />,
    },
    {
      title: "Weekly_Sales_Data_Mar2024.csv",
      date: "Yesterday",
      records: "365 rows",
      icon: <LineChartIcon className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "SaaS_User_Churn_Metrics.csv",
      date: "Last week",
      records: "8,400 rows",
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${t.text}`}>Recent Analyses</h3>
        <button
          className={`text-sm font-semibold ${t.primaryText} hover:underline`}
        >
          View all
        </button>
      </div>
      <div className="space-y-4">
        {analyses.map((file, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-5 ${t.panelBg} border ${t.border} rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-orange-500/30 cursor-pointer group`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}
              >
                {file.icon}
              </div>
              <div>
                <h4
                  className={`text-base font-bold ${t.text} group-hover:${t.primaryText} transition-colors`}
                >
                  {file.title}
                </h4>
                <div
                  className={`flex items-center gap-2 text-sm mt-1 ${t.textMuted}`}
                >
                  <Clock3 className="w-4 h-4" /> {file.date}
                  <span className="opacity-50">•</span>
                  <span>{file.records}</span>
                </div>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 ${t.textMuted} group-hover:${t.primaryText} transition-colors`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAnalyses;
