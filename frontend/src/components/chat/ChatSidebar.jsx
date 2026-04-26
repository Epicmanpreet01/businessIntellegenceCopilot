import { Bot, Maximize2, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import ChatInterface from "./ChatInterface";

const ChatSidebar = ({
  chatMessages,
  chatInput,
  setChatInput,
  handleChatSubmit,
  setChatMode,
}) => {
  const { t } = useTheme();

  return (
    <div
      className={`w-80 lg:w-96 ${t.panelBg} border-l ${t.border} flex flex-col shadow-[-8px_0_20px_-5px_rgba(0,0,0,0.05)] z-20 shrink-0 animate-in slide-in-from-right-8 duration-300`}
    >
      <div
        className={`p-4 border-b ${t.border} flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${t.primarySoft}`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold ${t.text}`}>Copilot Chat</h3>
            <p className={`text-xs ${t.textMuted}`}>Ask about your data</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setChatMode("fullscreen")}
            className={`p-1.5 rounded-lg transition-colors ${t.navHover}`}
            title="Fullscreen Chat"
          >
            <Maximize2 className={`w-4 h-4 ${t.textMuted}`} />
          </button>
          <button
            onClick={() => setChatMode("hidden")}
            className={`p-1.5 rounded-lg transition-colors ${t.navHover}`}
            title="Close Chat"
          >
            <X className={`w-4 h-4 ${t.textMuted}`} />
          </button>
        </div>
      </div>
      <ChatInterface
        isFullscreen={false}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleChatSubmit={handleChatSubmit}
        setChatMode={setChatMode}
      />
    </div>
  );
};

export default ChatSidebar;
