import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const InfoTooltip = ({ text, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTheme();

  const isTop = position === "top";

  return (
    <div className="relative inline-flex align-middle">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`${!children ? `${t.textMuted} hover:text-orange-500 ml-2` : ""} transition-colors cursor-help outline-none`}
        aria-label="More information"
      >
        {children || <HelpCircle className="w-4 h-4" />}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
            className={`absolute ${isTop ? "bottom-full mb-3" : "top-full mt-3"} left-1/2 -translate-x-1/2 w-72 p-5 rounded-[1.5rem] shadow-2xl border ${t.border} ${t.panelBg} z-[100] backdrop-blur-xl`}
          >
            <div className="relative">
              <p className={`text-[11px] leading-relaxed font-medium whitespace-pre-line ${t.text}`}>
                {text}
              </p>
              {/* Pointer Arrow */}
              <div
                className={`absolute ${isTop ? "top-full -translate-y-1/2" : "bottom-full translate-y-1/2"} left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b ${isTop ? "" : "border-t border-l border-b-0 border-r-0"} ${t.border} ${t.panelBg}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoTooltip;
