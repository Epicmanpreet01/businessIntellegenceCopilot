import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';
import { useGlobal } from '../../context/GlobalContext';
import { useLogoutMutation } from '../../hooks/mutations/useAuthMutation';

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

  const { mutate: logout } = useLogoutMutation();

  return (
    <div className={`h-screen font-sans flex overflow-hidden ${t.appBg} transition-colors duration-300`}>
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
