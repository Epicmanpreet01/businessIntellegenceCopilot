import { useMemo } from "react";
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Calendar,
  Activity,
  Download,
  Trash2,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../../context/GlobalContext";
import useDashboardQuery from "../../hooks/queries/useDashboardQuery";
import LoadingSpinner from "../../components/layout/LoadingSpinner";

// Dashboard Components
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Recommendations from "../../components/dashboard/Recommendations";
import WeeklyAverages from "../../components/dashboard/WeeklyAverages";
import AnomaliesLog from "../../components/dashboard/AnomaliesLog";

const DashboardPage = () => {
  const { t } = useTheme();
  const navigate = useNavigate();
  const { datasetId } = useParams();
  const { setActiveSession } = useGlobal();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useDashboardQuery(datasetId);

  const handleClearSession = () => {
    localStorage.removeItem("active_session");
    setActiveSession(false);
    navigate("/");
  };

  const chartData = useMemo(() => {
    if (!dashboardData) return [];
    const { analytics, forecast, processed_data } = dashboardData;
    const combined = [];

    // Add historical data
    processed_data.forEach((item) => {
      const date = new Date(item.ds);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const anomaly = analytics.anomalies.find((a) => {
        const aDate = new Date(a.ds);
        return aDate.toDateString() === date.toDateString();
      });

      combined.push({
        date: dateStr,
        historical: item.y,
        forecast: null,
        anomaly: anomaly ? item.y : null,
        anomalyType: anomaly ? anomaly.type : null,
        anomalyStrength: anomaly ? anomaly.strength : null,
        fullDate: date,
      });
    });

    // Add forecast data
    const lastHistoricalItem = processed_data[processed_data.length - 1];
    const lastHistoricalDate = new Date(lastHistoricalItem.ds);

    forecast.forEach((item) => {
      const date = new Date(item.ds);

      if (date.toDateString() === lastHistoricalDate.toDateString()) {
        const lastCombinedItem = combined[combined.length - 1];
        if (lastCombinedItem) {
          lastCombinedItem.forecast = lastCombinedItem.historical;
        }
      } else if (date > lastHistoricalDate) {
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        combined.push({
          date: dateStr,
          historical: null,
          forecast: item.yhat,
          anomaly: null,
          fullDate: date,
        });
      }
    });

    return combined;
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div>
          <h3 className={`text-xl font-bold ${t.text}`}>
            Failed to load dashboard
          </h3>
          <p className={t.textMuted}>
            Please check your connection or try again later.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className={`px-6 py-2 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors`}
        >
          Retry
        </button>
      </div>
    );
  }

  const { analytics, insights } = dashboardData;

  // Prepare Seasonality Data
  const seasonalityData = Object.entries(
    analytics.seasonality.distribution,
  ).map(([day, val]) => ({
    day: day.substring(0, 3),
    avg: val,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className={`text-2xl font-bold ${t.text}`}>Active Analysis</h2>
          <p className={`${t.textMuted}`}>
            Reviewing insights for dataset: {datasetId.substring(0, 8)}...
          </p>
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
        <div className={`p-3 rounded-xl mt-1 shrink-0 ${t.primarySoft}`}>
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
            {insights.summary}
          </p>
        </div>
      </div>

      {/* 4 Key Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Trend"
          value={`${analytics.trend.direction.charAt(0).toUpperCase() + analytics.trend.direction.slice(1)} (${analytics.trend.strength})`}
          desc={`Change of ${analytics.change.last_30d.toFixed(1)}% in last 30d`}
          icon={
            analytics.trend.direction === "upwards" ? TrendingUp : TrendingDown
          }
          colorClass={
            analytics.trend.direction === "upwards" ? t.emeraldSoft : t.redSoft
          }
        />
        <StatCard
          title="Anomalies"
          value={`${analytics.anomaly_summary.count} Detected`}
          desc={`${analytics.anomaly_summary.recent_count} in the last 7 days`}
          icon={AlertCircle}
          colorClass={
            analytics.anomaly_summary.count > 0 ? t.redSoft : t.emeraldSoft
          }
        />
        <StatCard
          title="Seasonality"
          value={analytics.seasonality.dominant_period || "none"}
          desc={
            analytics.seasonality.pattern === "none"
              ? "No seasonal pattern found"
              : analytics.seasonality.pattern
          }
          icon={Calendar}
          colorClass={t.blueSoft}
        />
        <StatCard
          title="Forecast"
          value={
            analytics.forecast.trend.charAt(0).toUpperCase() +
            analytics.forecast.trend.slice(1)
          }
          desc={`${analytics.forecast.change_pct.toFixed(1)}% expected change`}
          icon={Activity}
          colorClass={
            analytics.forecast.trend === "upward" ? t.emeraldSoft : t.amberSoft
          }
        />
      </div>

      {/* Chart & Recommendations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={chartData} />
        </div>
        <Recommendations recommendations={insights.recommendations} />
      </div>

      {/* Bottom Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyAverages data={seasonalityData} />
        <AnomaliesLog anomalies={analytics.anomalies} />
      </div>
    </div>
  );
};

export default DashboardPage;
