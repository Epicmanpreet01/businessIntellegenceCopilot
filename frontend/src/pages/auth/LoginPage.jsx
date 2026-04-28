import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BrainCircuit,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import { useLoginMutation } from "../../hooks/mutations/useAuthMutation.js";
import LoadingSpinner from "../../components/layout/LoadingSpinner.jsx";
import { themeConfig } from "../../constants/theme";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const t = themeConfig.light;

  const { mutate: login, isPending: isLoginPending } = useLoginMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    login({ email, password });
  };

  return (
    <div className={`min-h-screen flex w-full ${t.appBg} overflow-hidden`}>
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-20 xl:px-32 z-10 relative">
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

        <div className="max-w-md w-full mx-auto lg:mx-0 mt-20 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2
              className={`text-4xl lg:text-5xl font-black mb-3 ${t.text} tracking-tight`}
            >
              Welcome Back
            </h2>
            <p className={`${t.textMuted} text-lg`}>
              Log in to access your AI-powered business insights.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-6"
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
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${t.textMuted} transition-colors group-focus-within:text-orange-500`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${t.border} ${t.inputBg} ${t.text} focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base`}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-14 py-4 rounded-2xl border ${t.border} ${t.inputBg} ${t.text} focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base`}
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

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoginPending}
              className="w-full py-4 rounded-2xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 shadow-[0_20px_40px_-15px_rgba(234,88,12,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.4)] focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoginPending ? (
                <LoadingSpinner fullScreen={false} size="small" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center lg:text-left"
          >
            <p className={`${t.textMuted}`}>
              New to Business Copilot?{" "}
              <Link
                to="/signup"
                className="text-orange-500 font-bold hover:underline ml-1"
              >
                Create an account
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
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-orange-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-sm font-bold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Next-Gen Business Intelligence
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              Analyze your business in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                seconds.
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-neutral-400 text-2xl leading-relaxed font-medium"
            >
              Experience the power of generative AI applied to your sales,
              revenue, and growth data.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-6 pt-12"
            >
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] text-left hover:bg-white/10 transition-all duration-500 group">
                <div className="p-4 rounded-2xl bg-orange-600/20 text-orange-500 w-fit mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">
                  Growth Tracking
                </h4>
                <p className="text-neutral-500 text-base leading-relaxed">
                  Predict future trends with deep learning models.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] text-left hover:bg-white/10 transition-all duration-500 group">
                <div className="p-4 rounded-2xl bg-blue-600/20 text-blue-500 w-fit mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h4 className="text-white font-bold text-xl mb-2">
                  Smart Analytics
                </h4>
                <p className="text-neutral-500 text-base leading-relaxed">
                  Automated reporting for complex multi-source data.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
