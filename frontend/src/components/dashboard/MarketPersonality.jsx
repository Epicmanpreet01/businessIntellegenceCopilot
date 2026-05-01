import React from "react";
import { Activity, Zap, BarChart3, Wind, ShieldAlert, Target } from "lucide-react";
import InfoTooltip from "./InfoTooltip";

const PersonalityCard = ({ title, value, subValue, icon: Icon, colorClass, t, tooltip }) => (
  <div className={`${t.panelBg} rounded-3xl p-6 border ${t.border} flex items-start gap-4 transition-all hover:shadow-md hover:border-orange-500/30 group`}>
    <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform shadow-sm`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-1 mb-1">
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.textMuted}`}>{title}</h4>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <p className={`text-xl font-black ${t.text} tracking-tight mb-1`}>{value}</p>
      {subValue && <p className={`text-[10px] font-bold ${t.textMuted} uppercase tracking-widest opacity-60`}>{subValue}</p>}
    </div>
  </div>
);

import WeeklyAverages from "./WeeklyAverages";

import { normalizeText } from "../../utils/common";

const MarketPersonality = ({ analytics, t, seasonalityData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={`p-2 rounded-xl bg-orange-500/10 text-orange-500`}>
          <Wind className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Market Personality</h3>
          <p className={`text-xs ${t.textMuted}`}>Deep analysis of your business's behavioral dynamics and rhythm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Behavioral Profile - Major Signal */}
        <div className={`lg:col-span-2 ${t.panelBg} rounded-[2rem] p-10 border ${t.border} relative overflow-hidden group hover:shadow-lg transition-all`}>
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <Activity size={200} />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500`}>
                Behavior Profile
              </span>
              <InfoTooltip 
                text="The overall personality of your business performance, identifying long-term patterns and stability cycles." 
                position="bottom"
              />
            </div>
            
            <h4 className={`text-4xl lg:text-5xl font-black ${t.text} mb-6 uppercase tracking-tighter leading-none`}>
              {normalizeText(analytics.behavior_profile) || "Analyzing..."}
            </h4>
            
            <p className={`text-base ${t.textMuted} leading-relaxed max-w-xl italic opacity-80 mt-auto`}>
              Your business exhibits a {normalizeText(analytics.behavior_profile)?.toLowerCase()} pattern, 
              characterized by {normalizeText(analytics.volatility) === 'Low' ? 'consistent baseline performance' : 'dynamic fluctuations'} 
              and {analytics.trend.direction === 'up' ? 'sustained upward momentum' : 'corrective movements'}.
            </p>
          </div>
        </div>

        {/* Weekly Performance Distribution (The "Rhythm") */}
        <div className="lg:col-span-1">
          <WeeklyAverages data={seasonalityData} />
        </div>
      </div>

      {/* Dynamics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PersonalityCard 
          title="Volatility"
          value={normalizeText(analytics.volatility).toUpperCase()}
          subValue={`${normalizeText(analytics.volatility) === 'Low' ? 'High' : 'Low'} Consistency`}
          icon={BarChart3}
          colorClass={analytics.volatility === 'low' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}
          t={t}
          tooltip="Measures the day-to-day unpredictability. Low volatility means your revenue is steady and predictable."
        />
        <PersonalityCard 
          title="Momentum"
          value={normalizeText(analytics.momentum.split(' ')[0]).toUpperCase()}
          subValue={`${normalizeText(analytics.momentum.split(' ')[1] || '')} Velocity`}
          icon={Zap}
          colorClass={analytics.momentum.includes('positive') ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'}
          t={t}
          tooltip="The short-term speed of your growth (last 7 days). Strong positive momentum suggests an immediate growth spurt."
        />
        <div className={`${t.panelBg} rounded-3xl p-6 border ${t.border} flex items-center justify-between group hover:border-orange-500/30 transition-all sm:col-span-2 lg:col-span-1`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform shadow-sm`}>
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.textMuted}`}>Recovery State</h4>
                <InfoTooltip text="Evaluates how quickly your business bounces back from negative shocks or anomalies. 'Stable' means you maintain performance even after disruptions." />
              </div>
              <p className={`text-xl font-black ${t.text} tracking-tight`}>{normalizeText(analytics.recovery_state).toUpperCase()}</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className={`text-[10px] font-bold ${t.textMuted} opacity-40 uppercase tracking-widest`}>
              Current Phase
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPersonality;
