import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "../../context/ThemeContext";

const InfoTooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTheme();

  return (
    <div className="relative inline-flex ml-2 align-middle">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`${t.textMuted} hover:text-orange-500 transition-colors cursor-help outline-none`}
        aria-label="More information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-2xl shadow-2xl border ${t.border} ${t.panelBg} z-[100] backdrop-blur-md`}
          >
            <div className="relative">
              <p className={`text-xs leading-relaxed font-medium ${t.text}`}>
                {text}
              </p>
              {/* Pointer Arrow */}
              <div 
                className={`absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b ${t.border} ${t.panelBg}`}
                style={{ marginBottom: '-22px' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoTooltip;
