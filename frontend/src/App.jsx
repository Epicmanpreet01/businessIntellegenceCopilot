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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  const { t } = useTheme();
  const {
    user,
    loading,
    login,
    signup,
    logout,
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

  if (loading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${t.appBg}`}>
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated and not on login/signup pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  if (user && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // If on auth page, render without layout
  if (isAuthPage) {
    return (
      <div
        className={`min-h-screen font-sans ${t.appBg} transition-colors duration-300 flex flex-col justify-center`}
      >
        <Routes>
          <Route path="/login" element={<LoginPage login={login} />} />
          <Route path="/signup" element={<SignupPage signup={signup} />} />
        </Routes>
      </div>
    );
  }

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
          logout={logout}
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
