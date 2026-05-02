import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
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
import { generateProfessionalPDF } from "../../utils/reportGenerator";
import { formatModelText } from "../../utils/common";

import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import Recommendations from "../../components/dashboard/Recommendations";
import WeeklyAverages from "../../components/dashboard/WeeklyAverages";
import AnomaliesLog from "../../components/dashboard/AnomaliesLog";
import AnalysisReasons from "../../components/dashboard/AnalysisReasons";
import KeyMetricsGrid from "../../components/dashboard/KeyMetricsGrid";
import MarketPersonality from "../../components/dashboard/MarketPersonality";
import StrategicOutlook from "../../components/dashboard/StrategicOutlook";
import PerformanceRecords from "../../components/dashboard/PerformanceRecords";
import { AlertTriangle } from "lucide-react";

import InfoTooltip from "../../components/dashboard/InfoTooltip";

import ForecastIntelligence from "../../components/dashboard/ForecastIntelligence";
import AnomalyIntelligenceStrip from "../../components/dashboard/AnomalyIntelligenceStrip";
import BusinessHealthScorecard from "../../components/dashboard/BusinessHealthScorecard";
import SeasonalityDeepDive from "../../components/dashboard/SeasonalityDeepDive";

import { useDeleteDatasetMutation } from "../../hooks/mutations/useDatasetMutation";
import { useDatasetQuery } from "../../hooks/queries/useDatasetsQuery";

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
  const chartRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useDashboardQuery(datasetId);

  const { data: dataset, isLoading: isDatasetLoading } =
    useDatasetQuery(datasetId);

  const { mutate: deleteDataset, isPending: isDeletePending } =
    useDeleteDatasetMutation();

  const handleClearSession = () => {
    deleteDataset(datasetId);
    setActiveSession(false);
    navigate("/");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generateProfessionalPDF(dashboardData, datasetId, chartRef);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
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

  if (isLoading || isDatasetLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner fullScreen={true} size="large" />
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
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const distribution = analytics?.seasonality?.distribution || {};
  const seasonalityData = Object.entries(distribution)
    .map(([day, val]) => ({
      day: day.substring(0, 3),
      fullName: day,
      avg: val,
    }))
    .sort((a, b) => {
      const order = analytics.seasonality.dominant_period === "yearly" ? monthOrder : dayOrder;
      return order.indexOf(a.fullName) - order.indexOf(b.fullName);
    });

  return (
    <div className={`min-h-screen ${t.bg} p-6 lg:p-10 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-16 pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${t.text}`}>Business Intelligence Dashboard</h2>
            <p className={`${t.textMuted}`}>
              Analyzing insights for dataset: {dataset?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${t.panelBg} border ${t.border} ${t.text} hover:border-orange-500 hover:text-orange-600 disabled:opacity-50`}
            >
              {isExporting ? <LoadingSpinner size="xsmall" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Generating..." : "Export Report"}
            </button>
            <button
              onClick={handleClearSession}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
            >
              {isDeletePending ? <LoadingSpinner size="xsmall" color="red-500" /> : <><Trash2 className="w-4 h-4" /> Clear Session</>}
            </button>
          </div>
        </div>

        {/* --- SECTION 1: STRATEGIC PULSE --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <div className={`${t.panelBg} rounded-[2.5rem] p-10 lg:p-14 shadow-xl border ${t.border} relative overflow-hidden group`}>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-2">
                <h2 className={`text-[10px] font-black ${t.textMuted} uppercase tracking-[0.4em]`}>
                  Intelligence Executive Summary
                </h2>
                <InfoTooltip text="Our AI's high-level interpretation of your data. It synthesizes current trends, recent growth momentum, and identified patterns to provide a unified strategic brief." />
              </div>
              
              <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border ${t.border} ${t.name === 'dark' ? 'bg-neutral-900/40' : 'bg-neutral-100/50'}`}>
                <InfoTooltip 
                  text="Confidence Level: Based on the density and quality of your dataset. High confidence means the AI found strong, consistent patterns."
                  position="bottom"
                >
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${insights.confidence === 'high' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                    Confidence: {insights.confidence}
                  </div>
                </InfoTooltip>
                
                <InfoTooltip 
                  text={`Risk Level: ${analytics.risk_level === 'high' ? 'High potential for revenue decline based on current volatility and downward trends.' : 'Low potential for unexpected declines; the business shows stable foundations.'}`}
                  position="bottom"
                >
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${analytics.risk_level === 'high' ? 'text-red-500 bg-red-500/10 border border-red-500/20' : 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'}`}>
                    Risk: {analytics.risk_level}
                  </div>
                </InfoTooltip>

                <InfoTooltip 
                  text={`Opportunity: ${analytics.opportunity_level === 'high' ? 'Significant growth potential identified from positive momentum and upward forecast alignment.' : 'Moderate growth potential based on current baseline performance.'}`}
                  position="bottom"
                >
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${analytics.opportunity_level === 'high' ? 'text-orange-500 bg-orange-500/10 border border-orange-500/20' : 'text-neutral-500 bg-neutral-500/10 border border-neutral-500/20'}`}>
                    Opportunity: {analytics.opportunity_level}
                  </div>
                </InfoTooltip>

                <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />
                
                <InfoTooltip 
                  text={`Current Status: ${analytics.overall_state === 'growing' ? 'Your business is currently in a sustained period of expansion.' : 'Your business is currently seeing a net decline in performance.'}`}
                  position="bottom"
                >
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${analytics.overall_state === 'growing' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                    Status: {analytics.overall_state}
                  </div>
                </InfoTooltip>
              </div>
            </div>

            <div className="flex items-start gap-8 relative z-10">
              <div className={`hidden md:flex p-6 rounded-3xl ${t.name === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'} text-orange-500 items-center justify-center shrink-0`}>
                <Activity size={40} />
              </div>
              <p className={`text-2xl lg:text-3xl font-black ${t.text} leading-[1.4] tracking-tight italic`}>
                "{formatModelText(insights.summary)}"
              </p>
            </div>
          </div>

          <KeyMetricsGrid analytics={analytics} />
          <AnalysisReasons reasons={insights.reasons} />
        </motion.section>

        {/* ═══════ DEEP DIVE: THE STORY BEHIND YOUR NUMBERS ═══════ */}
        <div className="relative py-4">
          <div className={`absolute inset-x-0 top-1/2 h-px ${t.name === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
          <div className="relative flex justify-center">
            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${t.panelBg} border ${t.border} ${t.textMuted}`}>
              Deep Dive — The Story Behind Your Numbers
            </span>
          </div>
        </div>

        {/* --- SECTION: BUSINESS HEALTH --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <BusinessHealthScorecard analytics={analytics} t={t} />
        </motion.section>

        {/* --- SECTION 3: MARKET DYNAMICS --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <MarketPersonality analytics={analytics} t={t} />
        </motion.section>

        {/* --- SECTION 4: SEASONALITY DEEP DIVE --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <SeasonalityDeepDive analytics={analytics} seasonalityData={seasonalityData} />
        </motion.section>

        {/* --- SECTION 5: CORE INTELLIGENCE --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-12">
          <div className="flex items-center gap-3 px-2">
            <div className={`p-2 rounded-xl bg-orange-500/10 text-orange-500`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${t.text}`}>The Full Picture</h3>
              <p className={`text-xs ${t.textMuted}`}>Your complete revenue timeline with AI predictions and anomaly markers.</p>
            </div>
          </div>
          <div className="w-full" ref={chartRef} ref-id="revenue-chart-container">
            <RevenueChart data={chartData} />
          </div>
        </motion.section>

        {/* --- SECTION 6: FORECAST INTELLIGENCE --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <ForecastIntelligence analytics={analytics} t={t} />
        </motion.section>

        {/* --- SECTION 7: STRATEGIC OUTLOOK --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <StrategicOutlook analytics={analytics} t={t} />
        </motion.section>

        {/* --- SECTION 8: HISTORICAL LANDMARKS --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <PerformanceRecords analytics={analytics} t={t} />
        </motion.section>

        {/* --- SECTION 9: EVENTS THAT NEED ATTENTION --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className={`p-2 rounded-xl bg-red-500/10 text-red-500`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${t.text}`}>Events That Need Your Attention</h3>
              <p className={`text-xs ${t.textMuted}`}>Unusual spikes or drops in your data — and how much they matter.</p>
            </div>
          </div>
          <AnomalyIntelligenceStrip analytics={analytics} t={t} />
          <AnomaliesLog anomalies={analytics.anomalies} analytics={analytics} />
        </motion.section>

        {/* --- SECTION 10: STRATEGIC ACTION PLAN --- */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="space-y-8 pt-8 mt-8 border-t border-dashed border-orange-500/30">
          <Recommendations recommendations={insights.recommendations} />
        </motion.section>

      </div>
    </div>
  );
};

export default DashboardPage;
