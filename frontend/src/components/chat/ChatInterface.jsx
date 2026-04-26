import { useRef, useEffect } from "react";
import { Send, Bot, User, Minimize2, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ChatInterface = ({
  isFullscreen,
  chatMessages,
  chatInput,
  setChatInput,
  handleChatSubmit,
  setChatMode,
}) => {
  const { t } = useTheme();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className={`flex flex-col h-full bg-transparent`}>
      {isFullscreen && (
        <div
          className={`flex items-start justify-between mb-6 pb-6 border-b ${t.border}`}
        >
          <div>
            <h2 className={`text-2xl font-bold ${t.text} mb-2`}>
              Intelligence Chat
            </h2>
            <p className={`${t.textMuted}`}>
              Ask natural language questions about your business data.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChatMode("sidebar")}
              className={`p-2 rounded-xl transition-colors ${t.navHover} border ${t.border}`}
              title="Minimize to Sidebar"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChatMode("hidden")}
              className={`p-2 rounded-xl transition-colors ${t.navHover} border ${t.border}`}
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto ${isFullscreen ? "pr-4" : "p-5 space-y-4"} custom-scrollbar`}
      >
        {isFullscreen && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === "user" ? t.primary : t.primarySoft
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl text-base leading-relaxed ${
                    msg.role === "user"
                      ? `${t.userMsg} rounded-tr-none`
                      : `${t.botMsg} rounded-tl-none`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {!isFullscreen &&
          chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user" ? t.primary : t.primarySoft
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? `${t.userMsg} rounded-tr-none`
                    : `${t.botMsg} rounded-tl-none`
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        {!isFullscreen && <div ref={chatEndRef} />}
      </div>

      <div
        className={`${isFullscreen ? "mt-6 max-w-4xl mx-auto w-full" : "p-4 border-t " + t.border}`}
      >
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setChatInput("Why did sales drop?")}
            className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${t.border} border ${t.textMuted} hover:${t.primaryText} hover:border-orange-300 hover:-translate-y-0.5`}
          >
            "Why did sales drop?"
          </button>
          <button
            onClick={() => setChatInput("What will happen next week?")}
            className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${t.border} border ${t.textMuted} hover:${t.primaryText} hover:border-orange-300 hover:-translate-y-0.5`}
          >
            "Forecast for next week?"
          </button>
        </div>
        <form onSubmit={handleChatSubmit} className="relative group">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className={`w-full pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm ${t.inputBg}`}
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors disabled:opacity-50 ${t.primary}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
