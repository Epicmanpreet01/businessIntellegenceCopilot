export const generateMockData = () => {
  const data = [];
  let currentVal = 1200;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    let change = (Math.random() - 0.4) * 50; 
    if (isWeekend) change -= 150; 
    currentVal += change;
    
    let anomalyVal = null;
    if (i === 18) anomalyVal = currentVal + 400; 
    if (i === 7) anomalyVal = currentVal - 350;  
    
    data.push({
      date: dateStr,
      historical: anomalyVal !== null ? anomalyVal : Math.max(currentVal, 100),
      forecast: i === 0 ? Math.max(currentVal, 100) : null, 
      anomaly: anomalyVal,
    });
    if (anomalyVal !== null) currentVal = anomalyVal;
  }
  let forecastVal = data[data.length - 1].historical;
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    let change = -20 + (Math.random() * 10); 
    if (isWeekend) change -= 100;
    forecastVal += change;
    data.push({
      date: dateStr, historical: null, forecast: Math.max(forecastVal, 50), anomaly: null,
    });
  }
  return data;
};

export const weeklyMockData = [
  { day: 'Mon', avg: 1450 },
  { day: 'Tue', avg: 1520 },
  { day: 'Wed', avg: 1580 },
  { day: 'Thu', avg: 1610 },
  { day: 'Fri', avg: 1650 },
  { day: 'Sat', avg: 980 },
  { day: 'Sun', avg: 920 },
];

export const MOCK_INSIGHTS = {
  summary: "Your business is currently experiencing a declining trend, primarily driven by severe weekend underperformance.",
  trend: { status: "downward", text: "Sales decreased 18% over the last 30 days.", color: "red" },
  anomalies: { count: 2, text: "Sudden drops & spikes detected recently.", color: "red" },
  seasonality: { pattern: "weekend dips", text: "Revenue consistently drops by ~35% on weekends.", color: "blue" },
  forecast: { trend: "downward", text: "Expected to decline a further 5% next week.", color: "amber" },
  recommendations: [
    "Run targeted weekend promotions to offset the consistent Saturday/Sunday dips.",
    "Investigate the sudden drop on Mar 25 to ensure no technical outages occurred.",
    "Increase mid-week marketing spend to capture higher-converting weekday traffic."
  ]
};
