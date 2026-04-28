import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';
import { useGlobal } from '../../context/GlobalContext';
import { useLogoutMutation } from '../../hooks/mutations/useAuthMutation';
import ChatSidebar from '../chat/ChatSidebar';
import ChatInterface from '../chat/ChatInterface';

const MainLayout = ({ children }) => {
  const { t } = useTheme();
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    showNav, 
    handleScroll, 
    chatMode, 
    setChatMode 
  } = useGlobal();

  const [chatMessages, setChatMessages] = React.useState([
    {
      role: "assistant",
      content:
        "Hi! I am your AI Business Copilot. Ask me anything about your current dataset or revenue trends.",
    },
  ]);
  const [chatInput, setChatInput] = React.useState("");

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulate AI analysis delay
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm analyzing that for you. Based on the current trend, there's a strong correlation between the recent spike and your campaign performance.",
        },
      ]);
    }, 1000);
  };

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
          className="flex-1 overflow-y-auto px-6 lg:px-8 pb-6 lg:pb-8 pt-24 custom-scrollbar"
          onScroll={handleScroll}
        >
          {chatMode === "fullscreen" ? (
            <ChatInterface
              isFullscreen={true}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleChatSubmit={handleChatSubmit}
              setChatMode={setChatMode}
            />
          ) : (
            children
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out border-l ${t.border} ${chatMode === "sidebar" ? "w-80 lg:w-96" : "w-0 border-l-0 opacity-0 overflow-hidden"}`}
      >
        <ChatSidebar
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSubmit={handleChatSubmit}
          setChatMode={setChatMode}
        />
      </div>
    </div>
  );
};

export default MainLayout;
