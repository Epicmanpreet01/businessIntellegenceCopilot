import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const LoadingSpinner = ({
  fullScreen = false,
  size = "medium",
  color = "orange-600",
  className = "",
}) => {
  const { t } = useTheme();

  const sizeClasses = {
    xsmall: "w-4 h-4 border-2",
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-14 h-14 border-4",
  };

  const containerClasses = fullScreen
    ? `h-screen w-full flex flex-col items-center justify-center ${t.appBg} fixed inset-0 z-[100]`
    : "flex flex-col items-center justify-center";

  // Using inline styles for dynamic colors to ensure Tailwind/CSS works without safelisting
  const colorMap = {
    "orange-600": "#ea580c",
    "red-500": "#ef4444",
  };

  const selectedColor = colorMap[color] || "#ea580c";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="relative">
        {/* Glow Effect */}
        <div
          className="absolute inset-0 blur-2xl opacity-20 rounded-full"
          style={{ backgroundColor: selectedColor }}
        ></div>

        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-t-transparent rounded-full relative z-10`}
          style={{ borderColor: `${selectedColor} transparent transparent ${selectedColor}` }}
        />
      </div>

      {fullScreen && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 font-bold tracking-widest text-xs uppercase ${t.textMuted}`}
        >
          Initializing Copilot
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
