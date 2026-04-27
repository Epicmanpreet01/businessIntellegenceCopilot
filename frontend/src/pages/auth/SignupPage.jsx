import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Zap,
  Globe,
} from "lucide-react";

import { useSignUpMutation } from "../../hooks/mutations/useAuthMutation.js";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTheme();

  const { mutate: signup, isPending: isSignupPending } = useSignUpMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    signup(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`min-h-screen flex w-full ${t.appBg} overflow-hidden`}>
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-20 xl:px-32 z-10 relative overflow-y-auto py-16 scrollbar-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-10 left-10 lg:left-20 flex items-center gap-2"
        >
          <div className="p-2 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className={`font-bold text-xl tracking-tight ${t.text}`}>
            Copilot AI
          </span>
        </motion.div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2
              className={`text-4xl lg:text-5xl font-black mb-3 ${t.text} tracking-tight`}
            >
              Create Account
            </h2>
            <p className={`${t.textMuted} text-lg`}>
              Start your journey with the world's most advanced AI BI tool.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${t.textMuted} ml-1`}>
                Full Name
              </label>
              <div className="relative group">
                <User
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${t.textMuted} transition-colors group-focus-within:text-orange-500`}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${t.border} ${t.inputBg} ${t.text} focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base`}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${t.textMuted} ml-1`}>
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${t.textMuted} transition-colors group-focus-within:text-orange-500`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${t.border} ${t.inputBg} ${t.text} focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base`}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${t.textMuted} ml-1`}>
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${t.textMuted} transition-colors group-focus-within:text-orange-500`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-14 py-3.5 rounded-2xl border ${t.border} ${t.inputBg} ${t.text} focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl ${t.navHover} transition-colors`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-semibold ${t.textMuted} ml-1`}>
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${t.textMuted} transition-colors group-focus-within:text-orange-500`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${t.border} ${t.inputBg} ${t.text} focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-4 rounded-2xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 shadow-[0_20px_40px_-15px_rgba(234,88,12,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.4)] focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all flex items-center justify-center gap-3 mt-4"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center lg:text-left"
          >
            <p className={`${t.textMuted}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 font-bold hover:underline ml-1"
              >
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Decorative Panel */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-[#070707]">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[120px] rounded-full"
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-16 text-center">
          <div className="max-w-xl space-y-10">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              Scale your business with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                Intelligence.
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-400 text-2xl leading-relaxed font-medium"
            >
              Join 10,000+ businesses using AI Copilot to drive revenue growth
              and operational efficiency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 pt-12"
            >
              <div className="flex items-center gap-6 bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl text-left hover:bg-white/10 transition-all duration-500 group">
                <div className="p-4 rounded-2xl bg-orange-600/20 text-orange-500 shrink-0 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">
                    Enterprise Security
                  </h4>
                  <p className="text-neutral-500 text-base leading-relaxed">
                    Your data is encrypted, private, and never used for
                    training.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl text-left hover:bg-white/10 transition-all duration-500 group">
                <div className="p-4 rounded-2xl bg-blue-600/20 text-blue-500 shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">
                    Real-time Insights
                  </h4>
                  <p className="text-neutral-500 text-base leading-relaxed">
                    Get answers to complex business questions in milliseconds.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl text-left hover:bg-white/10 transition-all duration-500 group">
                <div className="p-4 rounded-2xl bg-emerald-600/20 text-emerald-500 shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">
                    Global Availability
                  </h4>
                  <p className="text-neutral-500 text-base leading-relaxed">
                    Supports all major currencies, regions, and data standards.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Abstract Glow */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-orange-600/40 blur-[80px]"
        />
      </div>
    </div>
  );
};

export default SignupPage;
