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
import { useTheme } from "../../context/ThemeContext";
import { weeklyMockData } from "../../utils/mockData";

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

  const chartData = data || weeklyMockData;

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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={t.chart.grid}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: t.chart.text }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 12, fill: t.chart.text }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val.toFixed(0)}`}
            />
            <RechartsTooltip
              cursor={{ fill: isDark ? "#262626" : "#f1f5f9" }}
              content={<CustomTooltip t={t} />}
            />
            <ReferenceLine y={0} stroke={isDark ? "#444" : "#ccc"} />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.avg >= 0 ? t.chart.line : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyAverages;
