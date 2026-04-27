import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMode, setChatMode] = useState("hidden"); // 'sidebar', 'fullscreen', 'hidden'
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-collapse sidebar/chat on route change
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarCollapsed(true);
      if (chatMode === "hidden") setChatMode("sidebar");
    } else if (location.pathname === "/chat") {
      setChatMode("fullscreen");
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
      setChatMode("hidden");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <GlobalContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        chatMode,
        setChatMode,
        showNav,
        setShowNav,
        handleScroll,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobal = () => useContext(GlobalContext);
