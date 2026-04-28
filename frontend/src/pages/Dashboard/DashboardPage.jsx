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

import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Recommendations from "../../components/dashboard/Recommendations";
import WeeklyAverages from "../../components/dashboard/WeeklyAverages";
import AnomaliesLog from "../../components/dashboard/AnomaliesLog";
import AnalysisReasons from "../../components/dashboard/AnalysisReasons";
import MetricGauges from "../../components/dashboard/MetricGauges";

import InfoTooltip from "../../components/dashboard/InfoTooltip";

const ConfidenceBadge = ({ level }) => {
  const colors = {
    high: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    low: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${colors[level] || colors.medium}`}
    >
      {level} Confidence
    </div>
  );
};

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

  const { analytics, insights, processed_data } = dashboardData;

  // Prepare Seasonality Data
  const seasonalityData = Object.entries(
    analytics.seasonality.distribution,
  ).map(([day, val]) => ({
    day: day.substring(0, 3),
    avg: val,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      {/* 1. Strategic Overview Header */}
      <div
        className={`${t.panelBg} rounded-[2.5rem] p-8 lg:p-10 shadow-sm border ${t.border} flex flex-col lg:flex-row items-start lg:items-center gap-8 transition-all hover:shadow-md`}
      >
        <div className={`p-5 rounded-3xl shrink-0 ${t.primarySoft} hidden lg:block`}>
          <Activity className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${t.primaryText.replace('text', 'bg')}`} />
              <h2 className={`text-xs font-black ${t.textMuted} uppercase tracking-[0.4em]`}>
                Intelligence Executive Summary
              </h2>
              <InfoTooltip text="High-level business intelligence summary generated by our AI after analyzing your complete dataset. It highlights the most critical trend and its impact." />
            </div>
            <ConfidenceBadge level={insights.confidence} />
          </div>
          <p className={`text-2xl lg:text-4xl font-semibold ${t.text} leading-tight tracking-tight max-w-6xl`}>
            {insights.summary}
          </p>
        </div>
      </div>

      {/* 2. Analysis Reliability & Positioning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2">
          <MetricGauges analytics={analytics} totalPoints={processed_data.length} />
        </div>
        <StatCard
          title="Growth Positioning"
          value={analytics.change.last_7d >= analytics.change.last_30d ? "Accelerating" : "Softening"}
          desc={`Current momentum is ${Math.abs(analytics.change.last_7d - analytics.change.last_30d).toFixed(1)}% ${analytics.change.last_7d > analytics.change.last_30d ? "stronger" : "weaker"} than the 30-day baseline.`}
          icon={Activity}
          colorClass={analytics.change.last_7d > analytics.change.last_30d ? t.emeraldSoft : t.amberSoft}
          tooltip="Compares your current week's performance against your monthly average to see if your business is picking up speed or slowing down."
        />
      </div>

      {/* 3. Primary Performance Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Monthly Growth"
          value={`${analytics.change.last_30d >= 0 ? "+" : ""}${analytics.change.last_30d.toFixed(1)}%`}
          desc="30-day performance delta"
          icon={TrendingUp}
          colorClass={analytics.change.last_30d >= 0 ? t.emeraldSoft : t.redSoft}
          tooltip="Shows how much your business has grown or shrunk over the last 30 days compared to the previous period."
        />
        <StatCard
          title="Overall Trend"
          value={analytics.trend.direction.charAt(0).toUpperCase() + analytics.trend.direction.slice(1)}
          desc={`${analytics.trend.strength} intensity trajectory`}
          icon={analytics.trend.direction === "upwards" ? TrendingUp : TrendingDown}
          colorClass={analytics.trend.direction === "upwards" ? t.emeraldSoft : t.redSoft}
          tooltip="The overall direction your business is moving in. It filters out daily fluctuations to show you the long-term path."
        />
        <StatCard
          title="7-Day Momentum"
          value={`${analytics.change.last_7d >= 0 ? "+" : ""}${analytics.change.last_7d.toFixed(1)}%`}
          desc="Short-term velocity velocity"
          icon={Activity}
          colorClass={analytics.change.last_7d >= 0 ? t.emeraldSoft : t.redSoft}
          tooltip="A snapshot of your performance over the last week. Useful for catching sudden changes before they affect your monthly results."
        />
        <StatCard
          title="Seasonality Pattern"
          value={analytics.seasonality.dominant_period || "None Detected"}
          desc={analytics.seasonality.pattern === "none" ? "No recurring cycles" : `${analytics.seasonality.strength} ${analytics.seasonality.pattern}`}
          icon={Calendar}
          colorClass={t.blueSoft}
          tooltip="Identifies recurring patterns in your data, like 'busy weekends' or 'slow Mondays,' so you can plan staffing or inventory."
        />
        <StatCard
          title="Revenue Forecast"
          value={analytics.forecast.trend.charAt(0).toUpperCase() + analytics.forecast.trend.slice(1)}
          desc={`${analytics.forecast.change_pct.toFixed(1)}% expected change`}
          icon={Activity}
          colorClass={analytics.forecast.trend === "upward" ? t.emeraldSoft : t.amberSoft}
          tooltip="AI-predicted performance for the coming weeks based on your historical patterns."
        />
        <StatCard
          title="Data Health"
          value={`${analytics.anomaly_summary.count} Anomalies`}
          desc={`${analytics.anomaly_summary.recent_count} recent disruptions`}
          icon={AlertCircle}
          colorClass={analytics.anomaly_summary.count > 0 ? t.redSoft : t.emeraldSoft}
          tooltip="Tracks unusual spikes or drops in your data. High health means your business performance is consistent and predictable."
        />
      </div>

      {/* 4. Main Visualization Section (Full Width) */}
      <div className="w-full">
        <RevenueChart data={chartData} />
      </div>

      {/* 5. Strategic Guidance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <Recommendations recommendations={insights.recommendations} />
        <AnalysisReasons reasons={insights.reasons} />
      </div>

      {/* 6. Technical Diagnostic Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <WeeklyAverages data={seasonalityData} />
        <AnomaliesLog anomalies={analytics.anomalies} />
      </div>
    </div>
  );
};

export default DashboardPage;
