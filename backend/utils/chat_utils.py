import json


def create_chat_context(analytics, insights):
  analytics_data = {
    column.name: getattr(analytics, column.name)
    for column in analytics.__table__.columns
  }

  insights_data = {
    column.name: getattr(insights, column.name)
    for column in insights.__table__.columns
  }

  trend = analytics_data.get("trend", {})
  change = analytics_data.get("change", {})
  anomaly_summary = analytics_data.get("anomaly_summary", {})
  seasonality = analytics_data.get("seasonality", {})
  forecast = analytics_data.get("forecast", {})

  summary = insights_data.get("summary", "")
  reasons = insights_data.get("reasons", [])
  recommendations = insights_data.get("recommendations", [])
  confidence = insights_data.get("confidence", "")

  context_parts = [
    "You are an expert analytics assistant.",
    "Answer only using the dashboard data below.",
    "Be concise, practical, and data-driven.",
    "",
    "Dashboard Summary:",
    summary,
    "",
    "Trend Analysis:",
    f"- Direction: {trend.get('direction', 'unknown')}",
    f"- Strength: {trend.get('strength', 'unknown')}",
    "",
    "Performance Change:",
    f"- Last 7 days: {change.get('last_7d', 'n/a')}%",
    f"- Last 30 days: {change.get('last_30d', 'n/a')}%",
    "",
    "Anomalies:",
    f"- Total anomalies: {anomaly_summary.get('count', 0)}",
    f"- Recent anomalies: {anomaly_summary.get('recent_count', 0)}",
    "",
    "Seasonality:",
    f"- Pattern: {seasonality.get('pattern', 'unknown')}",
    f"- Strength: {seasonality.get('strength', 'unknown')}",
    f"- Dominant period: {seasonality.get('dominant_period', 'unknown')}",
    "",
    "Forecast:",
    f"- Expected trend: {forecast.get('trend', 'unknown')}",
    f"- Expected change: {forecast.get('change_pct', 'n/a')}%",
    "",
    "Likely Reasons:"
  ]

  for reason in reasons:
    context_parts.append(f"- {reason}")

  context_parts.append("")
  context_parts.append("Recommended Actions:")

  for recommendation in recommendations:
    context_parts.append(f"- {recommendation}")

  context_parts.extend([
    "",
    f"Confidence Level: {confidence}",
    "",
    "If data is missing, say so clearly."
  ])

  return "\n".join(context_parts)