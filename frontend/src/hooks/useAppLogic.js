import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateMockData } from '../utils/mockData';

export const useAppLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMode, setChatMode] = useState('hidden'); // 'sidebar', 'fullscreen', 'hidden'
  const [data, setData] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Business Intelligence Copilot. I have analyzed your data. What would you like to know?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  // Sync sidebar/chat state based on route
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

  const handleFileUpload = (e) => {
    e?.preventDefault();
    setIsAnalyzing(true);
    navigate('/');
    setTimeout(() => {
      setData(generateMockData());
      setIsAnalyzing(false);
      navigate('/dashboard');
    }, 2500);
  };

  const handleClearSession = () => {
    setData([]);
    setChatMessages([{ role: 'assistant', content: 'Hello! I am your AI Business Intelligence Copilot. I have analyzed your data. What would you like to know?' }]);
    setChatMode('hidden');
    setSidebarCollapsed(false);
    navigate('/');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let response = "I'm analyzing that specific metric. Based on the data, we're seeing an overall downward trend.";
      const lowerQ = userMsg.toLowerCase();
      if (lowerQ.includes('why') || lowerQ.includes('drop') || lowerQ.includes('reason')) {
        response = "The primary reason for the recent drop is a strong recurring seasonality pattern. Your sales consistently underperform on weekends (Saturdays and Sundays). Additionally, we detected an uncharacteristic anomaly drop last week that dragged the rolling average down.";
      } else if (lowerQ.includes('forecast') || lowerQ.includes('next') || lowerQ.includes('future')) {
        response = "Our Prophet forecasting model predicts a continued slight decline of about 5% over the next 7 days, largely because the upcoming weekend is expected to see the usual dip. I highly recommend running a weekend promotion to alter this trajectory.";
      } else if (lowerQ.includes('recommend') || lowerQ.includes('action') || lowerQ.includes('do')) {
        response = "Based on the insights, my top recommendation is to shift your marketing budget to launch a 'Weekend Flash Sale' starting this Friday. This directly combats the 'weekend dip' seasonality we've detected.";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (mock)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const mockUser = {
      name: email.split("@")[0],
      email,
      role: "Administrator",
      avatar: null,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return true;
  };

  const signup = (userData) => {
    // Mock signup logic
    const mockUser = {
      ...userData,
      name: userData.email.split("@")[0],
      role: "Administrator",
      avatar: null,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
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
    location
  };
};
