from backend.schemas.analytics_schema import AnalyticsEngineOut
from backend.schemas.insights_schema import InsightEngineOut
import uuid

class InsightsEngine:
  def __init__(self, dataset_id: uuid.UUID,analytics : AnalyticsEngineOut):
    self.a = analytics
    self.dataset_id = dataset_id
  def generate(self):
    return InsightEngineOut(
      dataset_id=self.dataset_id,
      summary=self._summary(),
      reasons=self._reasons(),
      recommendations=self._recommendations(),
      confidence=self._confidence()
    )

  def _summary(self) -> str:
    trend = self.a.trend
    seasonality = self.a.seasonality
    chnage = self.a.change

    text = f"Your business is experiencing a {trend['strength']} {trend['direction']} trend"

    if seasonality['strength'] != 'none':
      text += f", driven by {seasonality['strength']} {seasonality['pattern']}"
    
    text += f" ({round(chnage['last_30d'], 1)}% over last 30 days)"

    return text
  
  def _reasons(self):
    reasons = []

    trend = self.a.trend or {}
    change = self.a.change or {}
    seasonality = self.a.seasonality or {}
    anomaly_summary = self.a.anomaly_summary or {}
    forecast = self.a.forecast or {}
    anomalies = self.a.anomalies or {}

    # trend analysis
    direction = trend.get("direction")
    strength = trend.get("strength")

    if direction == "downwards":
      if strength == "strong":
        reasons.append("Strong long-term decline in baseline performance")
      elif strength == "moderate":
        reasons.append("Moderate downward trend over time")
      else:
        reasons.append("Gradual decline in overall performance")

    elif direction == "upwards":
      if strength == "strong":
        reasons.append("Strong sustained growth trend")
      elif strength == "moderate":
        reasons.append("Moderate upward growth trend")
      else:
        reasons.append("Slow improvement over time")

    elif direction == "flat":
      reasons.append("No meaningful long-term trend detected")

    # recent performance changes
    last_7d = change.get("last_7d", 0)
    last_30d = change.get("last_30d", 0)

    if last_7d <= -25:
      reasons.append("Severe short-term drop in the last 7 days")
    elif last_7d <= -10:
      reasons.append("Recent sharp decline in the last 7 days")
    elif last_7d >= 25:
      reasons.append("Exceptional short-term growth in the last 7 days")
    elif last_7d >= 10:
      reasons.append("Strong recent improvement in the last 7 days")

    if last_30d <= -25:
      reasons.append("Major monthly decline in the last 30 days")
    elif last_30d <= -10:
      reasons.append("Noticeable monthly slowdown in the last 30 days")
    elif last_30d >= 25:
      reasons.append("Major monthly growth in the last 30 days")
    elif last_30d >= 10:
      reasons.append("Steady monthly improvement in the last 30 days")

    if last_7d > last_30d + 5:
      reasons.append("Momentum is improving recently compared with the monthly average")

    if last_7d < last_30d - 5:
      reasons.append("Recent momentum is weaker than the broader monthly trend")

    # seasonality
    seasonal_pattern = seasonality.get("pattern")
    seasonal_strength = seasonality.get("strength")
    score = seasonality.get("seasonal_strength_score", 0)

    if seasonal_strength == "strong":
      reasons.append("Performance is heavily influenced by recurring seasonal behavior")
    elif seasonal_strength == "medium":
      reasons.append("Moderate recurring seasonal effects are present")
    elif seasonal_strength == "weak":
      reasons.append("Mild seasonal behavior detected")

    if seasonal_pattern == "weekend dips":
      reasons.append("Consistent underperformance during weekends")
    elif seasonal_pattern == "weekend spikes":
      reasons.append("Performance regularly peaks during weekends")
    elif seasonal_pattern == "stable weekly pattern":
      reasons.append("Stable weekly recurring usage pattern")
    elif isinstance(seasonal_pattern, str):
      if seasonal_pattern.startswith("peaks in"):
        reasons.append(f"Recurring yearly seasonality detected ({seasonal_pattern})")

    if score >= 0.75:
      reasons.append("Seasonality is a dominant driver of fluctuations")

    # anomalies
    anomaly_count = anomaly_summary.get("count", 0)
    recent_count = anomaly_summary.get("recent_count", 0)

    if anomaly_count > 0:
      reasons.append("Irregular spikes or drops detected in historical data")

    if anomaly_count >= 5:
      reasons.append("Frequent abnormal movements suggest unstable performance")

    if recent_count > 0:
      reasons.append("Recent anomalies may be impacting current results")

    high_spikes = 0
    high_drops = 0

    for item in anomalies:
      if item.get("severity") == "high":
        if item.get("type") == "spike":
          high_spikes += 1
        elif item.get("type") == "drop":
          high_drops += 1

    if high_drops > 0:
      reasons.append("One or more severe drops were detected")

    if high_spikes > 0:
      reasons.append("One or more extreme spikes were detected")

    # forecast
    future_trend = forecast.get("trend")
    future_change = forecast.get("change_pct", 0)

    if future_trend == "downward":
      if future_change <= -15:
        reasons.append("Forecast suggests continued strong decline ahead")
      else:
        reasons.append("Forecast indicates near-term softening")

    elif future_trend == "upward":
      if future_change >= 15:
        reasons.append("Forecast suggests strong near-term growth")
      else:
        reasons.append("Forecast indicates mild near-term improvement")

    # combined signals
    if direction == "downwards" and last_7d < 0 and future_trend == "downward":
      reasons.append("Decline is visible historically, recently, and in the forecast")

    if direction == "upwards" and last_7d > 0 and future_trend == "upward":
      reasons.append("Growth is consistent across historical, recent, and forecast signals")

    if anomaly_count > 0 and seasonal_strength in ["strong", "medium"]:
      reasons.append("Both seasonality and anomalies are contributing to volatility")

    if direction == "flat" and anomaly_count > 0:
      reasons.append("Overall performance is stable, but disrupted by irregular events")

    # CLEAN DUPLICATES
    cleaned = []
    seen = set()

    for reason in reasons:
      if reason and reason not in seen:
        cleaned.append(reason)
        seen.add(reason)

    return cleaned

  def _recommendations(self):
    recs = []

    trend = self.a.trend or {}
    change = self.a.change or {}
    seasonality = self.a.seasonality or {}
    anomaly_summary = self.a.anomaly_summary or {}
    forecast = self.a.forecast or {}
    anomalies = self.a.anomalies or {}

    direction = trend.get("direction")
    strength = trend.get("strength")

    last_7d = change.get("last_7d", 0)
    last_30d = change.get("last_30d", 0)

    seasonal_pattern = seasonality.get("pattern")
    seasonal_strength = seasonality.get("strength")

    anomaly_count = anomaly_summary.get("count", 0)
    recent_count = anomaly_summary.get("recent_count", 0)

    future_trend = forecast.get("trend")
    future_change = forecast.get("change_pct", 0)

    # trend actions
    if direction == "downwards":
      recs.append("Increase acquisition and retention efforts to reverse declining performance")

      if strength == "strong":
        recs.append("Urgently review pricing, product value, and channel performance")

      elif strength == "moderate":
        recs.append("Audit recent campaigns and funnel conversion points")

    elif direction == "upwards":
      recs.append("Scale successful channels and campaigns driving growth")

      if strength == "strong":
        recs.append("Increase capacity and budget allocation to sustain momentum")

    elif direction == "flat":
      recs.append("Test new growth initiatives to break stagnant performance")

    # recent change actions
    if last_7d <= -10:
      recs.append("Investigate recent changes in traffic, pricing, product, or operations")

    if last_30d <= -10:
      recs.append("Review monthly strategy and identify sustained decline drivers")

    if last_7d >= 10:
      recs.append("Replicate tactics responsible for recent short-term gains")

    if last_30d >= 10:
      recs.append("Double down on strategies contributing to monthly growth")

    if last_7d < last_30d - 5:
      recs.append("Address weakening short-term momentum before it impacts monthly results")

    if last_7d > last_30d + 5:
      recs.append("Capitalize on improving momentum with additional campaigns")

    # seasonality actions
    if seasonal_pattern == "weekend dips":
      recs.append("Run targeted weekend promotions and improve weekend staffing")

    elif seasonal_pattern == "weekend spikes":
      recs.append("Prepare inventory, support, and ad spend ahead of weekends")

    elif seasonal_pattern == "stable weekly pattern":
      recs.append("Align staffing and budgets with the recurring weekly demand cycle")

    if isinstance(seasonal_pattern, str) and seasonal_pattern.startswith("peaks in"):
      recs.append("Plan yearly campaigns around seasonal peak months and slow periods")

    if seasonal_strength == "strong":
      recs.append("Use forecasting and budgeting that heavily accounts for seasonality")

    elif seasonal_strength == "medium":
      recs.append("Adjust campaigns periodically based on seasonal demand")

    # anomaly actions
    if anomaly_count > 0:
      recs.append("Investigate anomaly dates for operational, campaign, or tracking issues")

    if anomaly_count >= 5:
      recs.append("Implement automated monitoring alerts for abnormal movements")

    if recent_count > 0:
      recs.append("Prioritize recent anomalies as they may still be affecting performance")

    high_drop_count = 0

    for item in anomalies:
      if item.get("type") == "drop" and item.get("severity") == "high":
        high_drop_count += 1

    if high_drop_count > 0:
      recs.append("Perform root-cause analysis on severe drops immediately")

    # forecast actions
    if future_trend == "downward":
      recs.append("Take corrective action as decline is expected to continue")

      if future_change <= -15:
        recs.append("Prepare contingency plans for a significant near-term slowdown")

    elif future_trend == "upward":
      recs.append("Prepare to capture forecasted growth with added resources")

      if future_change >= 15:
        recs.append("Expand inventory, staffing, or capacity for projected demand")

    # combined intellegence
    if direction == "downwards" and future_trend == "downward":
      recs.append("Execute a turnaround plan since both history and forecast are negative")

    if direction == "upwards" and future_trend == "upward":
      recs.append("Invest confidently while both historical and forecast signals are positive")

    if anomaly_count > 0 and seasonal_strength in ["strong", "medium"]:
      recs.append("Separate recurring seasonal effects from true anomalies in reporting")

    if direction == "flat" and anomaly_count == 0:
      recs.append("Use controlled experiments to unlock new growth opportunities")

    # clean duplicates
    cleaned = []
    seen = set()

    for rec in recs:
      if rec and rec not in seen:
        cleaned.append(rec)
        seen.add(rec)

    return cleaned
  
  def _confidence(self):
    score = 0

    if self.a.trend["strength"] == "strong":
      score += 1

    if self.a.seasonality["pattern"] != "none":
      score += 1

    if self.a.anomaly_summary["count"] > 0:
      score += 1

    if score >= 2:
      return "high"
    elif score == 1:
      return "medium"
    return "low"