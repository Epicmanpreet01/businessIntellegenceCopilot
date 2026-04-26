import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { useAppLogic } from "./hooks/useAppLogic";

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ChatSidebar from "./components/chat/ChatSidebar";
import ChatInterface from "./components/chat/ChatInterface";

// Pages
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  const { t } = useTheme();

  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    chatMode,
    setChatMode,
    data,
    isAnalyzing,
    chatMessages,
    chatInput,
    setChatInput,
    showNav,
    handleScroll,
    handleFileUpload,
    handleClearSession,
    handleChatSubmit,
    navigate,
    location,
  } = useAppLogic();

  const user = {
    name: "Alex",
    role: "Administrator",
    avatar: null,
  };

  return (
    <div
      className={`h-screen font-sans flex overflow-hidden ${t.appBg} transition-colors duration-300`}
    >
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        dataLength={data.length}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          showNav={showNav}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          chatMode={chatMode}
          setChatMode={setChatMode}
        />

        <div
          className="flex-1 overflow-y-auto px-6 lg:px-8 pb-6 lg:pb-8 pt-24 custom-scrollbar"
          onScroll={handleScroll}
        >
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  data={data}
                  isAnalyzing={isAnalyzing}
                  handleFileUpload={handleFileUpload}
                  navigateTo={navigate}
                />
              }
            />

            <Route
              path="/dashboard"
              element={
                data.length > 0 ? (
                  <DashboardPage
                    data={data}
                    handleClearSession={handleClearSession}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/reports"
              element={
                <ReportsPage
                  onNavigateToDashboard={() => navigate("/dashboard")}
                />
              }
            />

            <Route
              path="/chat"
              element={
                <div className="max-w-5xl mx-auto h-full animate-in fade-in duration-300">
                  <ChatInterface
                    isFullscreen={true}
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    handleChatSubmit={handleChatSubmit}
                    setChatMode={(mode) => {
                      if (mode === "hidden") navigate(-1);
                      else setChatMode(mode);
                    }}
                  />
                </div>
              }
            />
          </Routes>
        </div>
      </div>

      {location.pathname === "/dashboard" && chatMode === "sidebar" && (
        <ChatSidebar
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSubmit={handleChatSubmit}
          setChatMode={setChatMode}
        />
      )}
    </div>
  );
}
