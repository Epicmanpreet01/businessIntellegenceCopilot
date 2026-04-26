from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

from schemas.analytics_schema import AnalyticsEngineOut
from schemas.insights_schema import InsightEngineOut



class ProcessedRowOut(BaseModel):
  ds: datetime
  y: float


class ForecastRowOut(BaseModel):
  ds: datetime
  yhat: float

class DashboardOut(BaseModel):
  analytics: AnalyticsEngineOut
  insights: InsightEngineOut
  forecast: List[ForecastRowOut]
  processed_data: List[ProcessedRowOut]

  model_config = ConfigDict(from_attributes=True)