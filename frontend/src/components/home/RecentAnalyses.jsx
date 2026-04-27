import { Clock3, ChevronRight, Database } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

import { useDatasetsQuery } from "../../hooks/queries/useDatasetsQuery";
import LoadingSpinner from "../layout/LoadingSpinner";

import { timeAgo, parse_frequency, formatFileSize } from "../../utils/common";

const RecentAnalyses = () => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();

  const { data: datasets, isLoading: isDatasetLoading } = useDatasetsQuery();

  const top_four_datasets = datasets.slice(0, 4);

  if (isDatasetLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${t.text}`}>Recent Analyses</h3>
        <button
          className={`text-sm font-semibold ${t.primaryText} hover:underline`}
          onClick={() => navigate("/reports")}
        >
          View all
        </button>
      </div>
      <div className="space-y-4">
        {top_four_datasets?.length > 0 ? (
          top_four_datasets.map((file) => (
            <div
              key={file.dataset_id}
              className={`flex items-center justify-between p-5 ${t.panelBg} border ${t.border} rounded-2xl transition-all duration-300 hover:shadow-md hover:border-orange-500/30 cursor-pointer group`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl transition-transform duration-300 ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}
                >
                  <Database className={`w-5 h-5 ${t.primaryText}`} />
                </div>
                <div className="min-w-0">
                  <h4
                    className={`text-base font-bold ${t.text} group-hover:${t.primaryText} transition-colors truncate`}
                  >
                    {file.name}
                  </h4>
                  <div
                    className={`flex items-center gap-x-3 text-[11px] mt-1.5 ${t.textMuted} whitespace-nowrap overflow-hidden text-ellipsis`}
                  >
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock3 className="w-3 h-3" />
                      <span>{timeAgo(file.created_at)}</span>
                    </div>
                    <span className="opacity-30 shrink-0">•</span>
                    <span className="shrink-0">{`${file.length} rows`}</span>
                    <span className="opacity-30 shrink-0">•</span>
                    <span className="shrink-0">
                      {formatFileSize(file.file_size)}
                    </span>
                    <span className="opacity-30 shrink-0">•</span>
                    <span className="bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0">
                      {parse_frequency(file.freq)}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 ${t.textMuted} group-hover:${t.primaryText} transition-colors`}
              />
            </div>
          ))
        ) : (
          <div
            className={`p-10 text-center ${t.panelBg} border ${t.border} rounded-2xl ${t.textMuted}`}
          >
            <p>No recent analyses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentAnalyses;
