from schemas.analytics_schema import AnalyticsEngineOut

class InsightsEngine:
  def __init__(self, analytics : AnalyticsEngineOut):
    self.a = analytics

  def _summary(self):
    pass