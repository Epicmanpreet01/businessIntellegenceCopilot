from pydantic import BaseModel
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
