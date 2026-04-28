import InfoTooltip from "./InfoTooltip";
import { useTheme } from "../../context/ThemeContext";

const StatCard = ({ title, value, icon: Icon, colorClass, desc, tooltip }) => {
  const { t } = useTheme();
  return (
    <div
      className={`${t.panelBg} rounded-2xl p-5 shadow-sm border ${t.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-orange-500/30 group cursor-default`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${colorClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}
        >
          Signal
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1 mb-1">
          <h4 className={`text-sm font-bold ${t.textMuted}`}>{title}</h4>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <p className={`text-lg font-bold ${t.text} leading-snug`}>{value}</p>
        <p className={`text-xs mt-2 ${t.textMuted}`}>{desc}</p>
      </div>
    </div>
  );
};

export default StatCard;
