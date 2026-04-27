import {
  TrendingDown,
  AlertCircle,
  Calendar,
  Activity,
  Download,
  Trash2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { MOCK_INSIGHTS } from "../../utils/mockData";

// Dashboard Components
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Recommendations from "../../components/dashboard/Recommendations";
import WeeklyAverages from "../../components/dashboard/WeeklyAverages";
import AnomaliesLog from "../../components/dashboard/AnomaliesLog";

const DashboardPage = () => {
  const { t } = useTheme();
  const navigate = useNavigate();

  // User will integrate data fetching here
  const data = []; // Placeholder for actual data
  const handleClearSession = () => {
    localStorage.removeItem("active_session");
    navigate("/");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className={`text-2xl font-bold ${t.text}`}>Active Analysis</h2>
          <p className={`${t.textMuted}`}>Reviewing Q1 Revenue Insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${t.panelBg} border ${t.border} ${t.text} hover:border-orange-500 hover:text-orange-600`}
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button
            onClick={handleClearSession}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
          >
            <Trash2 className="w-4 h-4" /> Clear Session
          </button>
        </div>
      </div>

      {/* Auto Summary */}
      <div
        className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} flex items-start gap-5 transition-all hover:shadow-md`}
      >
        <div className={`p-3 rounded-xl mt-1 shrink-0 ${t.redSoft}`}>
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h2
            className={`text-sm font-semibold ${t.textMuted} uppercase tracking-wider mb-2`}
          >
            Auto-Generated Insight
          </h2>
          <p
            className={`text-xl lg:text-2xl font-medium ${t.text} leading-snug`}
          >
            {MOCK_INSIGHTS.summary}
          </p>
        </div>
      </div>

      {/* 4 Key Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Trend"
          value="Decreasing (-18%)"
          desc={MOCK_INSIGHTS.trend.text}
          icon={TrendingDown}
          colorClass={t.redSoft}
        />
        <StatCard
          title="Anomalies"
          value={`${MOCK_INSIGHTS.anomalies.count} Detected`}
          desc={MOCK_INSIGHTS.anomalies.text}
          icon={AlertCircle}
          colorClass={t.redSoft}
        />
        <StatCard
          title="Seasonality"
          value="Weekly Pattern"
          desc={MOCK_INSIGHTS.seasonality.text}
          icon={Calendar}
          colorClass={t.blueSoft}
        />
        <StatCard
          title="7-Day Forecast"
          value="Continued Drop"
          desc={MOCK_INSIGHTS.forecast.text}
          icon={Activity}
          colorClass={t.amberSoft}
        />
      </div>

      {/* Chart & Recommendations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={data} />
        </div>
        <Recommendations recommendations={MOCK_INSIGHTS.recommendations} />
      </div>

      {/* Bottom Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyAverages />
        <AnomaliesLog data={data} />
      </div>
    </div>
  );
};

export default DashboardPage;
