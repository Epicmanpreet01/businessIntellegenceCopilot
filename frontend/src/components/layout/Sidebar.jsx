import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Clock,
  Boxes,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  BrainCircuit,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useGlobal } from "../../context/GlobalContext";

export const SidebarItem = ({
  icon: Icon,
  label,
  to,
  onClick,
  disabled,
  collapsed,
}) => {
  const { t } = useTheme();

  const content = (
    <>
      <Icon className="w-5 h-5 shrink-0" />
      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-3"}`}
      >
        {label}
      </span>
    </>
  );

  const baseClasses = `w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${collapsed ? "justify-center" : ""}`;

  if (disabled) {
    return (
      <div
        className={`${baseClasses} opacity-40 cursor-not-allowed text-neutral-400`}
        title={collapsed ? label : ""}
      >
        {content}
      </div>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${t.navHover}`}
        title={collapsed ? label : ""}
      >
        {content}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? t.navActive : t.navHover}`
      }
      title={collapsed ? label : ""}
    >
      {content}
    </NavLink>
  );
};

const Sidebar = () => {
  const { t } = useTheme();
  const { sidebarCollapsed, setSidebarCollapsed, activeSession } = useGlobal();

  return (
    <div
      className={`${sidebarCollapsed ? "w-20" : "w-64"} transition-all duration-300 ${t.panelBg} border-r ${t.border} flex-col z-20 hidden lg:flex shrink-0`}
    >
      <div
        className={`h-16 flex items-center ${sidebarCollapsed ? "justify-center" : "px-6"} border-b ${t.border}`}
      >
        <BrainCircuit
          className={`w-7 h-7 ${t.primaryText} ${sidebarCollapsed ? "" : "mr-3"} shrink-0`}
        />
        {!sidebarCollapsed && (
          <span
            className={`font-bold ${t.text} text-xl tracking-tight whitespace-nowrap`}
          >
            Copilot
          </span>
        )}
      </div>
      <div className="p-4 space-y-1.5 flex-1 overflow-x-hidden">
        <SidebarItem
          icon={Home}
          label="Home Overview"
          to="/"
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={LayoutDashboard}
          label="Active Analysis"
          to="/dashboard"
          disabled={!activeSession}
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={Clock}
          label="Recent Reports"
          to="/reports"
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={Boxes}
          label="Integrations"
          to="/integrations"
          disabled
          collapsed={sidebarCollapsed}
        />
      </div>
      <div className={`p-4 border-t ${t.border} space-y-1.5`}>
        <SidebarItem
          icon={sidebarCollapsed ? PanelLeftOpen : PanelLeftClose}
          label={sidebarCollapsed ? "Expand" : "Collapse"}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          collapsed={sidebarCollapsed}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          to="/settings"
          disabled
          collapsed={sidebarCollapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;
