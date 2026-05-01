import React from "react";
import { Trophy, ArrowDownCircle, Calendar, DollarSign, History } from "lucide-react";

const RecordCard = ({ title, value, date, icon: Icon, colorClass, t, label }) => (
  <div className={`${t.panelBg} rounded-[2rem] p-8 border ${t.border} flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-lg hover:border-orange-500/30 group relative overflow-hidden`}>
    <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none`}>
      <Icon size={100} />
    </div>

    <div className={`p-6 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform shadow-sm`}>
      <Icon className="w-10 h-10" />
    </div>
    
    <div className="flex-1 text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colorClass}`}>
          {label}
        </span>
      </div>
      <h4 className={`text-sm font-bold ${t.textMuted} mb-1 uppercase tracking-tight`}>{title}</h4>
      <p className={`text-4xl font-black ${t.text} tracking-tighter mb-2`}>
        ${value.toLocaleString()}
      </p>
      <div className={`flex items-center justify-center md:justify-start gap-2 text-[11px] font-bold ${t.textMuted} opacity-70`}>
        <Calendar className="w-3 h-3" />
        <span>RECORDED ON {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
      </div>
    </div>
  </div>
);

const PerformanceRecords = ({ analytics, t }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={`p-2 rounded-xl bg-amber-500/10 text-amber-500`}>
          <History className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Historical Landmarks</h3>
          <p className={`text-xs ${t.textMuted}`}>All-time records and performance benchmarks across your business history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecordCard 
          title="All-Time Performance Peak"
          value={analytics.extremes.peak.value}
          date={analytics.extremes.peak.date}
          icon={Trophy}
          colorClass="bg-amber-500/10 text-amber-500"
          label="Performance Peak"
          t={t}
        />

        <RecordCard 
          title="All-Time Performance Floor"
          value={analytics.extremes.trough.value}
          date={analytics.extremes.trough.date}
          icon={ArrowDownCircle}
          colorClass="bg-red-500/10 text-red-500"
          label="Historical Base"
          t={t}
        />
      </div>
    </div>
  );
};

export default PerformanceRecords;
