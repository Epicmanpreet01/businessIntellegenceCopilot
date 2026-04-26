import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { weeklyMockData } from "../../utils/mockData";

const WeeklyAverages = () => {
  const { t, isDark } = useTheme();

  return (
    <div
      className={`${t.panelBg} rounded-2xl p-6 shadow-sm border ${t.border} transition-all hover:shadow-md`}
    >
      <h3 className={`text-lg font-bold ${t.text} mb-6`}>
        Performance by Day of Week
      </h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyMockData}
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
              formatter={(value) => [`$${value}`, "Avg Revenue"]}
            />
            <Bar
              dataKey="avg"
              fill={t.chart.line}
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyAverages;
