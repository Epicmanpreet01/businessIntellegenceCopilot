import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "../../context/ThemeContext";
import { useGlobal } from "../../context/GlobalContext";
import { useLogoutMutation } from "../../hooks/mutations/useAuthMutation";
import ChatSidebar from "../chat/ChatSidebar";
import ChatInterface from "../chat/ChatInterface";

const MainLayout = ({ children }) => {
  const { t } = useTheme();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    showNav,
    handleScroll,
    chatMode,
    setChatMode,
  } = useGlobal();

  const { mutate: logout } = useLogoutMutation();

  return (
    <div
      className={`h-screen font-sans flex overflow-hidden ${t.appBg} transition-colors duration-300`}
    >
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          showNav={showNav}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          chatMode={chatMode}
          setChatMode={setChatMode}
          logout={logout}
        />

        <div
          className={`flex-1 ${chatMode === "fullscreen" ? "flex flex-col overflow-hidden" : "overflow-y-auto"} px-6 lg:px-8 pb-6 lg:pb-8 pt-24 custom-scrollbar`}
          onScroll={handleScroll}
        >
          {chatMode === "fullscreen" ? (
            <ChatInterface isFullscreen={true} setChatMode={setChatMode} />
          ) : (
            children
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out border-l ${t.border} ${chatMode === "sidebar" ? "w-80 lg:w-96" : "w-0 border-l-0 opacity-0 overflow-hidden"}`}
      >
        <ChatSidebar setChatMode={setChatMode} />
      </div>
    </div>
  );
};

export default MainLayout;
