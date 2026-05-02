import { useState, useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Brush,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

import InfoTooltip from "./InfoTooltip";

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`${t.panelBg} border ${t.border} p-3 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-200`}
      >
        <p className={`text-[10px] font-bold mb-2 ${t.textMuted} uppercase`}>
          {label}
        </p>
        <div className="space-y-1.5">
          {payload
            .filter((entry) =>
              ["Revenue", "Forecast", "Anomaly"].includes(entry.name),
            )
            .map((entry, index) => {
              // eslint-disable-next-line no-useless-assignment
              let displayValue = entry.value;
              let displayLabel = entry.name;

              if (entry.name === "Anomaly") {
                const type = entry.payload.anomalyType || "Anomaly";
                const strength = entry.payload.anomalyStrength || "";
                const combined = `${strength} ${type}`.trim();
                displayValue =
                  combined.charAt(0).toUpperCase() + combined.slice(1);
              } else {
                displayValue = `$${Math.round(entry.value)}`;
              }

              return (
                <p
                  key={index}
                  className="text-[12px] font-bold flex justify-between gap-4"
                  style={{ color: entry.color || entry.fill }}
                >
                  <span>{displayLabel}:</span>
                  <span>{displayValue}</span>
                </p>
              );
            })}
        </div>
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data }) => {
  const { t, isDark } = useTheme();
  const [timeframe, setTimeframe] = useState("3M");
  const chartRef = useRef(null);
  const isInView = useInView(chartRef, { once: true, margin: "-100px" });

  const filteredData = useMemo(() => {
    if (timeframe === "All" || !data || data.length === 0) return data;

    const historyData = data.filter((d) => d.historical !== null);
    const forecastData = data.filter((d) => d.forecast !== null);

    if (historyData.length === 0) return data;

    const targets = { "1M": 30, "3M": 90, "6M": 180 };
    const T = targets[timeframe] || 30;

    const maxForecast = Math.min(
      Math.floor(T / 2),
      forecastData.length,
      historyData.length,
    );

    const targetHistory = T - maxForecast;
    const numHistory = Math.min(targetHistory, historyData.length);

    const historySlice = historyData.slice(-numHistory);
    const forecastSlice = forecastData.slice(0, maxForecast);

    const lastHistoryItem = historySlice[historySlice.length - 1];
    const finalForecastSlice =
      lastHistoryItem &&
      forecastSlice[0] &&
      lastHistoryItem.fullDate.getTime() === forecastSlice[0].fullDate.getTime()
        ? forecastSlice.slice(1)
        : forecastSlice;

    return [...historySlice, ...finalForecastSlice];
  }, [data, timeframe]);

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} transition-all hover:shadow-md`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-bold ${t.text}`}>
              Revenue Performance & Forecast
            </h3>
            <InfoTooltip text="Interactive map of your historical performance (solid line) and AI predictions (dotted line). Hover over points to see exact values and detected anomalies." />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {["1M", "3M", "6M", "All"].map((f) => (
              <button
                key={f}
                onClick={() => setTimeframe(f)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${timeframe === f ? "bg-orange-500 text-white" : `${t.panelBg} border ${t.border} ${t.textMuted} hover:${t.text} hover:border-orange-500/50`}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <span className={`flex items-center gap-2 ${t.textMuted}`}>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: t.chart.line }}
            ></div>{" "}
            Historical
          </span>
          <span className={`flex items-center gap-2 ${t.textMuted}`}>
            <div
              className="w-2.5 h-2.5 rounded-full border-2 border-dashed"
              style={{ borderColor: t.chart.forecast }}
            ></div>{" "}
            Forecast
          </span>
          <span className={`flex items-center gap-2 ${t.textMuted}`}>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: t.chart.anomaly }}
            ></div>{" "}
            Anomaly
          </span>
        </div>
      </div>

      <div className="h-[350px] w-full" ref={chartRef}>
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={t.chart.grid}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: t.chart.text }}
                axisLine={false}
                tickLine={false}
                dy={10}
                minTickGap={50}
              />
              <YAxis
                tick={{ fontSize: 11, fill: t.chart.text }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <RechartsTooltip
                cursor={{ fill: isDark ? "#262626" : "#f1f5f9" }}
                content={<CustomTooltip t={t} />}
              />
              <Line
                type="monotone"
                dataKey="historical"
                name="Revenue"
                stroke={t.chart.line}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke={t.chart.forecast}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
              />
              <Scatter
                dataKey="anomaly"
                name="Anomaly"
                fill={t.chart.anomaly}
                shape="circle"
                r={7}
              />
              <Brush
                dataKey="date"
                height={30}
                stroke={t.chart.line}
                fill={isDark ? "#1A1A1A" : "#fff"}
                tickFormatter={() => ""}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
