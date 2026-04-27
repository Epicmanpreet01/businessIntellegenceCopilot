import { useLocation } from "react-router-dom";
import { PanelLeftOpen, Sun, Moon, MessageSquare, LogOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useGlobal } from "../../context/GlobalContext";
import { useLogoutMutation } from "../../hooks/mutations/useAuthMutation";
import LoadingSpinner from "./LoadingSpinner";

const Header = () => {
  const { isDark, toggleTheme, t } = useTheme();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    showNav,
    chatMode,
    setChatMode,
  } = useGlobal();
  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation();
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Q1 Revenue Analysis";
      case "/reports":
        return "Recent Reports";
      case "/chat":
        return "AI Chat";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard Overview";
    }
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 lg:px-8 border-b ${t.border} ${t.panelBg} z-30 transition-transform duration-300 ease-in-out ${showNav ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex items-center gap-4">
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${t.navHover}`}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
        <h1 className={`text-lg font-bold ${t.text}`}>{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${t.navHover}`}
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {location.pathname === "/dashboard" && chatMode === "hidden" && (
          <button
            onClick={() => setChatMode("sidebar")}
            className={`p-2 rounded-full transition-colors ${t.navHover} flex items-center gap-2`}
            title="Open Intelligence Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => logout()}
          disabled={isLogoutPending}
          className={`p-2 rounded-full transition-colors hover:bg-red-500/10 hover:text-red-500 text-gray-500 disabled:opacity-50 flex items-center justify-center`}
          title="Logout"
        >
          {isLogoutPending ? (
            <LoadingSpinner fullScreen={false} size="small" color="red-500" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
