import React from "react";
import { ShieldAlert, Compass, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import InfoTooltip from "./InfoTooltip";
import { normalizeText } from "../../utils/common";

const OutlookCard = ({ title, value, desc, icon: Icon, colorClass, t, tooltip, status }) => (
  <div className={`${t.panelBg} rounded-[2rem] p-8 border ${t.border} flex flex-col h-full transition-all hover:shadow-md hover:border-orange-500/30 group`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
      {status && (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colorClass}`}>
          {status}
        </span>
      )}
    </div>
    
    <div className="flex-1">
      <div className="flex items-center gap-1 mb-2">
        <h4 className={`text-sm font-bold ${t.textMuted}`}>{title}</h4>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <p className={`text-2xl font-black ${t.text} tracking-tight mb-4 uppercase`}>{value}</p>
      <p className={`text-xs ${t.textMuted} leading-relaxed opacity-80 italic`}>{desc}</p>
    </div>
  </div>
);

const StrategicOutlook = ({ analytics, t }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className={`p-2 rounded-xl bg-indigo-500/10 text-indigo-500`}>
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${t.text}`}>Strategic Outlook</h3>
          <p className={`text-xs ${t.textMuted}`}>Future-focused intelligence on risks, alignment, and identified growth avenues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OutlookCard 
          title="Risk Profile"
          value={`${normalizeText(analytics.risk_level)} Risk`}
          status={analytics.risk_level === 'low' ? 'Protected' : 'Warning'}
          desc={analytics.risk_level === 'low' 
            ? "Your business shows strong resistance to market volatility and anomalous shocks." 
            : "Increased vulnerability detected due to recent pattern shifts or high volatility."}
          icon={analytics.risk_level === 'low' ? CheckCircle2 : ShieldAlert}
          colorClass={analytics.risk_level === 'low' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
          t={t}
          tooltip="Overall vulnerability assessment based on historical anomalies and current trend stability."
        />

        <OutlookCard 
          title="Trend Alignment"
          value={normalizeText(analytics.trend_alignment).toUpperCase()}
          status="AI Projection"
          desc={analytics.trend_alignment === 'aligned' 
            ? "Forecasted trends are in perfect sync with your long-term historical performance." 
            : "A potential reversal or divergence from historical patterns is expected in the coming period."}
          icon={TrendingUp}
          colorClass="bg-blue-500/10 text-blue-500"
          t={t}
          tooltip="Compares historical patterns with future predictions. Aligned means the future follows the past."
        />

        <OutlookCard 
          title="Growth Opportunity"
          value={`${normalizeText(analytics.opportunity_level)} Potential`}
          status="Market Edge"
          desc={analytics.opportunity_level === 'high' 
            ? "Substantial growth headwind detected. Strategic expansion is highly recommended." 
            : "Moderate opportunity window. Focus on maintaining current stability benchmarks."}
          icon={Lightbulb}
          colorClass="bg-orange-500/10 text-orange-500"
          t={t}
          tooltip="Identifies untapped growth potential by synthesizing momentum, seasonality, and market gaps."
        />
      </div>
    </div>
  );
};

export default StrategicOutlook;
