import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ReportsPage = () => {
  const { t, isDark } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const reports = [
    {
      id: 1,
      title: "Q1_Marketing_Spend_vs_ROI.csv",
      date: "2 hours ago",
      records: "1,240 rows",
      frequency: "Daily",
      type: "Revenue Analysis",
      size: "245 KB",
    },
    {
      id: 2,
      title: "Weekly_Sales_Data_Mar2024.csv",
      date: "Yesterday",
      records: "365 rows",
      frequency: "Weekly",
      type: "Sales Trend",
      size: "128 KB",
    },
    {
      id: 3,
      title: "SaaS_User_Churn_Metrics.csv",
      date: "Last week",
      records: "8,400 rows",
      frequency: "Monthly",
      type: "Churn Analysis",
      size: "1.2 MB",
    },
    {
      id: 4,
      title: "Inventory_Turnover_FY23.csv",
      date: "2 weeks ago",
      records: "12,400 rows",
      frequency: "Quarterly",
      type: "Inventory",
      size: "3.5 MB",
    },
  ];

  const frequencies = ["All", "Daily", "Weekly", "Monthly", "Quarterly"];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFrequency =
      selectedFrequency === "All" || report.frequency === selectedFrequency;
    return matchesSearch && matchesFrequency;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-bold ${t.text} mb-2`}>
            Recent Reports
          </h1>
          <p className={`${t.textMuted}`}>
            Manage and review your previously generated business insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.textMuted}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className={`pl-10 pr-4 py-2.5 rounded-xl border ${t.border} ${t.panelBg} ${t.text} text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all w-64`}
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2.5 rounded-xl border ${t.border} ${t.panelBg} ${showFilterMenu ? t.primaryText + " border-orange-500" : t.textMuted} hover:${t.text} transition-colors flex items-center gap-2`}
            >
              <Filter className="w-5 h-5" />
              {selectedFrequency !== "All" && (
                <span className="text-xs font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
                  1
                </span>
              )}
            </button>

            {showFilterMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border ${t.border} ${t.panelBg} z-50 p-2 animate-in slide-in-from-top-2 duration-200`}
              >
                <div className="px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Filter by Frequency
                </div>
                {frequencies.map((freq) => (
                  <button
                    key={freq}
                    onClick={() => {
                      setSelectedFrequency(freq);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      selectedFrequency === freq
                        ? t.primarySoft + " " + t.primaryText + " font-bold"
                        : t.text + " hover:bg-orange-500/10 hover:text-orange-600"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table/List */}
      <div
        className={`${t.panelBg} border ${t.border} rounded-3xl overflow-hidden shadow-sm`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b ${t.border} ${isDark ? "bg-neutral-900/50" : "bg-neutral-50/50"}`}
              >
                <th
                  className={`px-6 py-4 text-xs font-bold ${t.textMuted} uppercase tracking-wider`}
                >
                  Report Name
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold ${t.textMuted} uppercase tracking-wider`}
                >
                  Metadata
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold ${t.textMuted} uppercase tracking-wider`}
                >
                  Frequency
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold ${t.textMuted} uppercase tracking-wider`}
                >
                  Size
                </th>
                <th
                  className={`px-6 py-4 text-xs font-bold ${t.textMuted} uppercase tracking-wider text-right`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className={`group hover:${isDark ? "bg-neutral-800/30" : "bg-orange-50/30"} transition-colors cursor-pointer`}
                  onClick={() => navigate('/dashboard')}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${t.primarySoft} transition-transform duration-300`}
                      >
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p
                          className={`font-bold ${t.text} group-hover:${t.primaryText} transition-colors`}
                        >
                          {report.title}
                        </p>
                        <p className={`text-xs ${t.textMuted} mt-0.5`}>
                          {report.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div
                        className={`flex items-center gap-2 text-sm ${t.text}`}
                      >
                        <Calendar className="w-3.5 h-3.5 opacity-60" />{" "}
                        {report.date}
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${t.textMuted}`}
                      >
                        <Database className="w-3.5 h-3.5 opacity-60" />{" "}
                        {report.records}
                      </div>
                    </div>
                  </td>
                   <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.primarySoft}`}
                    >
                      {report.frequency}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-sm ${t.textMuted}`}>
                    {report.size}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className={`p-2 rounded-lg hover:${t.primarySoft} transition-colors`}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-2 rounded-lg ${t.textMuted} hover:bg-red-500/10 hover:text-red-500 transition-colors`}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div
                        className={`ml-2 p-2 rounded-lg ${t.primary} shadow-sm`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 ${t.textMuted} group-hover:hidden ml-auto`}
                    />
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div
                      className={`w-12 h-12 rounded-full ${t.primarySoft} flex items-center justify-center mx-auto mb-4`}
                    >
                      <Search className="w-6 h-6" />
                    </div>
                    <p className={`text-lg font-bold ${t.text}`}>
                      No reports found
                    </p>
                    <p className={`${t.textMuted} text-sm`}>
                      Try adjusting your search query or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State Help */}
      <div
        className={`p-8 rounded-3xl border-2 border-dashed ${t.border} text-center`}
      >
        <div
          className={`w-12 h-12 rounded-full ${t.primarySoft} flex items-center justify-center mx-auto mb-4`}
        >
          <Clock className="w-6 h-6" />
        </div>
        <h3 className={`text-lg font-bold ${t.text} mb-2`}>
          Need more historical data?
        </h3>
        <p className={`${t.textMuted} max-w-sm mx-auto text-sm`}>
          All analysis sessions are securely stored in the cloud. You can
          retrieve them from any device by logging into your account.
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
