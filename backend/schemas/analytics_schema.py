from pydantic import BaseModel, ConfigDict
from typing import Dict, List
import uuid

class AnalyticsEngineOut(BaseModel):
  dataset_id: uuid.UUID
  trend : Dict
  change: Dict
  anomalies: List
  anomaly_summary : Dict
  seasonality : Dict
  forecast: Dict

  model_config = ConfigDict(from_attributes=True)