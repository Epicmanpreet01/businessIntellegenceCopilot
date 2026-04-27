import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const LoadingSpinner = ({
  fullScreen = true,
  size = "large",
  color = "orange-600",
  className = "",
}) => {
  const { t } = useTheme();

  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-14 h-14 border-4",
  };

  const containerClasses = fullScreen
    ? `h-screen w-full flex flex-col items-center justify-center ${t.appBg}`
    : "flex flex-col items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="relative">
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 blur-2xl opacity-20 rounded-full bg-${color}`}
        ></div>

        {/* Animated Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-${color} border-t-transparent rounded-full relative z-10`}
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
