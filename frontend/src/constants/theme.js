export const themeConfig = {
  light: {
    name: 'light',
    appBg: "bg-[#FDFBF7]",
    panelBg: "bg-white",
    border: "border-neutral-200",
    text: "text-neutral-800",
    textMuted: "text-neutral-500",
    
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    primaryText: "text-orange-600",
    primarySoft: "bg-orange-50 text-orange-600",
    
    navHover: "hover:bg-orange-50/70 hover:text-orange-700 text-neutral-600",
    navActive: "bg-orange-100/60 text-orange-700",
    
    redSoft: "bg-red-50 text-red-600",
    blueSoft: "bg-blue-50 text-blue-600",
    amberSoft: "bg-amber-50 text-amber-600",
    emeraldSoft: "bg-emerald-50 text-emerald-600",
    
    userMsg: "bg-neutral-800 text-white",
    botMsg: "bg-white border border-neutral-200 text-neutral-700 shadow-sm",
    inputBg: "bg-neutral-50 border-neutral-200 focus:ring-orange-500 focus:border-transparent text-neutral-800 placeholder:text-neutral-400",
    
    chart: { line: "#ea580c", forecast: "#fdba74", anomaly: "#ef4444", grid: "#e2e8f0", text: "#64748b" }
  },
  dark: {
    name: 'dark',
    appBg: "bg-[#0A0A0A]",
    panelBg: "bg-[#1A1A1A]",
    border: "border-neutral-800",
    text: "text-neutral-100",
    textMuted: "text-neutral-400",
    
    primary: "bg-orange-600 text-white hover:bg-orange-500",
    primaryText: "text-orange-500",
    primarySoft: "bg-orange-900/30 text-orange-400",
    
    navHover: "hover:bg-neutral-800/80 hover:text-orange-400 text-neutral-300",
    navActive: "bg-orange-900/40 text-orange-400",
    
    redSoft: "bg-red-900/20 text-red-400",
    blueSoft: "bg-blue-900/20 text-blue-400",
    amberSoft: "bg-amber-900/20 text-amber-400",
    emeraldSoft: "bg-emerald-900/20 text-emerald-400",
    
    userMsg: "bg-orange-600 text-white",
    botMsg: "bg-[#242424] border border-neutral-800 text-neutral-200 shadow-sm",
    inputBg: "bg-[#121212] border-neutral-800 focus:ring-orange-500 focus:border-transparent text-neutral-100 placeholder:text-neutral-500",
    
    chart: { line: "#f97316", forecast: "#fb923c", anomaly: "#f43f5e", grid: "#333333", text: "#9ca3af" }
  }
};
