from pydantic import BaseModel, ConfigDict
from typing import Dict, List
import uuid


class AnalyticsEngineOut(BaseModel):
  dataset_id: uuid.UUID

  trend: Dict
  change: Dict

  momentum: str
  volatility: str
  relative_performance: str
  acceleration: str

  anomalies: List
  anomaly_summary: Dict
  anomaly_impact: str
  anomaly_bias: str

  seasonality: Dict

  forecast: Dict
  forecast_reliability: str
  trend_alignment: str

  extremes: Dict

  risk_level: str
  opportunity_level: str
  recovery_state: str
  behavior_profile: str
  overall_state: str

  model_config = ConfigDict(from_attributes=True)