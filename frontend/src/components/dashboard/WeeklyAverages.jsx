import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import InfoTooltip from "./InfoTooltip";

const CustomTooltip = ({ active, payload, label, t }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const color = value >= 0 ? t.chart.line : "#ef4444";
    return (
      <div
        className={`${t.panelBg} border ${t.border} p-3 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-200`}
      >
        <p className={`text-[10px] font-bold mb-1 ${t.textMuted} uppercase`}>
          {label}
        </p>
        <p className="text-sm font-bold" style={{ color }}>
          Impact: {value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const WeeklyAverages = ({ data }) => {
  const { t, isDark } = useTheme();

  const chartData = data;

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} transition-all hover:shadow-md h-full`}
    >
      <div className="flex items-center gap-2 mb-6">
        <h3 className={`text-lg font-bold ${t.text}`}>
          Performance Distribution
        </h3>
        <InfoTooltip text="Visualizes your typical performance for each day of the week. Bars above the zero line indicate stronger-than-average days, while bars below show slower days." />
      </div>
      <div className="h-[260px] w-full">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={t.chart.grid}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: t.chart.text, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fill: t.chart.text, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val > 0 ? '+' : ''}${val.toFixed(0)}`}
              />
              <RechartsTooltip
                cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
                content={<CustomTooltip t={t} />}
              />
              <ReferenceLine y={0} stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              <Bar dataKey="avg" radius={[3, 3, 0, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.avg >= 0 ? t.chart.line : "#f43f5e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <AlertCircle className={`w-8 h-8 ${t.textMuted} mb-2`} />
            <p className={`text-sm ${t.textMuted} text-center`}>
              Insufficient data to calculate <br /> performance distribution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyAverages;
