import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const RevenueChart = ({ data }) => {
  const { t, isDark } = useTheme();

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className={`text-lg font-bold ${t.text}`}>
          Revenue Performance & Forecast
        </h3>
        <div className="flex items-center gap-5 text-sm hidden sm:flex">
          <span className={`flex items-center gap-2 ${t.textMuted}`}>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: t.chart.line }}
            ></div>{" "}
            Historical
          </span>
          <span className={`flex items-center gap-2 ${t.textMuted}`}>
            <div
              className="w-3 h-3 rounded-full border-2 border-dashed"
              style={{ borderColor: t.chart.forecast }}
            ></div>{" "}
            Forecast
          </span>
          <span className={`flex items-center gap-2 ${t.textMuted}`}>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: t.chart.anomaly }}
            ></div>{" "}
            Anomaly
          </span>
        </div>
      </div>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={t.chart.grid}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: t.chart.text }}
              axisLine={false}
              tickLine={false}
              dy={10}
              minTickGap={30}
            />
            <YAxis
              tick={{ fontSize: 12, fill: t.chart.text }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <RechartsTooltip
              cursor={{ fill: isDark ? "#262626" : "#f1f5f9" }}
              contentStyle={{
                backgroundColor: isDark ? "#1A1A1A" : "#fff",
                borderRadius: "12px",
                border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
                color: isDark ? "#fff" : "#000",
              }}
              formatter={(value, name) => [
                `$${Math.round(value)}`,
                name === "historical"
                  ? "Revenue"
                  : name === "forecast"
                    ? "Forecast"
                    : "Anomaly",
              ]}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke={t.chart.line}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke={t.chart.forecast}
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
            />
            <Scatter
              dataKey="anomaly"
              fill={t.chart.anomaly}
              shape="circle"
              r={7}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
