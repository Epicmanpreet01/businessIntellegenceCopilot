import { useRef } from "react";
import { Activity } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import useUserQuery from "../../hooks/queries/useUserQuery";
import useUploadDatasetMutation from "../../hooks/mutations/useDatasetMutation";

// Upload Components
import UploadHero from "../../components/home/UploadHero";
import FeaturesGrid from "../../components/home/FeaturesGrid";
import RecentAnalyses from "../../components/home/RecentAnalyses";

const HomePage = () => {
  const { t } = useTheme();
  const navigate = useNavigate();
  const { data: user } = useUserQuery();
  const { mutate: uploadDataset, isPending } = useUploadDatasetMutation();

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadDataset(
      { file },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      },
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10 mt-4 animate-in fade-in duration-500">
      <div>
        <h1
          className={`text-3xl lg:text-4xl font-bold ${t.text} mb-3 tracking-tight`}
        >
          Welcome back, {user?.name || "User"}
        </h1>
        <p className={`${t.textMuted} text-lg`}>
          Upload new data to generate insights, or resume a recent analysis.
        </p>
      </div>

      {/* Active Session Cache Banner */}
      {!isPending && localStorage.getItem("active_session") === "true" && (
        <div
          className={`${t.panelBg} border ${t.border} rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm animate-in slide-in-from-bottom-4 duration-500`}
        >
          <div className="mb-4 sm:mb-0 flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${t.primarySoft}`}>
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${t.text}`}>
                Active Session Cached
              </h3>
              <p className={`${t.textMuted} text-sm mt-1`}>
                Your latest Q1 Revenue Analysis is still active in memory.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-5 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap shadow-sm ${t.primary}`}
          >
            Resume Analysis
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".csv"
      />

      <UploadHero isAnalyzing={isPending} handleFileUpload={triggerFileInput} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentAnalyses />
        <FeaturesGrid />
      </div>
    </div>
  );
};

export default HomePage;
