import {
  Sparkles,
  BarChart3,
  AlertCircle,
  LineChart as LineChartIcon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const FeaturesGrid = () => {
  const { t } = useTheme();

  const features = [
    {
      icon: LineChartIcon,
      title: "Trend Analysis",
      desc: "Automatically detect trajectories in historical data.",
      color: "text-blue-500",
    },
    {
      icon: Sparkles,
      title: "AI Explanations",
      desc: "Get plain-English reasoning for why metrics change.",
      color: t.primaryText,
    },
    {
      icon: BarChart3,
      title: "Forecasting",
      desc: "See into the future with integrated ML predictions.",
      color: "text-emerald-500",
    },
    {
      icon: AlertCircle,
      title: "Anomaly Spotter",
      desc: "Instantly spot unusual spikes or drops that need attention.",
      color: "text-red-500",
    },
  ];

  return (
    <div>
      <h3 className={`text-xl font-bold ${t.text} mb-6`}>
        System Capabilities
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div
            key={i}
            className={`p-6 ${t.panelBg} border ${t.border} rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-orange-500/30 group`}
          >
            <f.icon
              className={`w-7 h-7 ${f.color} mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
            />
            <h4 className={`text-base font-bold ${t.text} mb-2`}>{f.title}</h4>
            <p className={`text-sm ${t.textMuted} leading-relaxed`}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;
