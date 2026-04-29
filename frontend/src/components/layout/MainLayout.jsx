import { useState, useCallback, useEffect } from "react";
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
  const [chatSidebarWidth, setChatSidebarWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  const startResizing = useCallback(() => {
    setIsDragging(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resize = useCallback((e) => {
    if (!isDragging) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 300 && newWidth < 800) {
      setChatSidebarWidth(newWidth);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDragging, resize, stopResizing]);

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
        className={`relative border-l ${t.border} ${chatMode === "sidebar" ? "" : "w-0 border-l-0 opacity-0 overflow-hidden"} ${!isDragging ? "transition-all duration-300" : ""}`}
        style={{ width: chatMode === "sidebar" ? `${chatSidebarWidth}px` : "0px" }}
      >
        {chatMode === "sidebar" && (
          <div
            onMouseDown={startResizing}
            className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-orange-500/40 transition-colors z-30"
          />
        )}
        <ChatSidebar setChatMode={setChatMode} />
      </div>
    </div>
  );
};

export default MainLayout;
