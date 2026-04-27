import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMode, setChatMode] = useState('hidden'); // 'sidebar', 'fullscreen', 'hidden'
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-collapse sidebar/chat on route change
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setSidebarCollapsed(true);
      if (chatMode === 'hidden') setChatMode('sidebar');
    } else if (location.pathname === '/chat') {
      setChatMode('fullscreen');
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
      setChatMode('hidden');
    }
  }, [location.pathname]);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY > lastScrollY.current + 8 && currentScrollY > 64) {
      setShowNav(false);
    } else if (currentScrollY < lastScrollY.current - 8) {
      setShowNav(true);
    }
    lastScrollY.current = currentScrollY;
  };

  return (
    <GlobalContext.Provider value={{
      sidebarCollapsed,
      setSidebarCollapsed,
      chatMode,
      setChatMode,
      showNav,
      setShowNav,
      handleScroll
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
