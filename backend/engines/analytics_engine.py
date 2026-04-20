import numpy as np
import pandas as pd
from datetime import timedelta
import uuid

from schemas.analytics_schema import AnalyticsEngineOut

class AnalyticsEngine:
  def __init__(self, df : pd.DataFrame, forecast_df : pd.DataFrame,dataset_id : uuid.UUID, freq : str):
    self.df : pd.DataFrame = df.copy()
    self.forecast_df : pd.DataFrame = forecast_df.copy()
    self.freq : str = freq
    self.dataset_id = dataset_id

    self.df = self.df.sort_values('ds')
    self.forecast_df = self.forecast_df.sort_values('ds')

  def _get_window_size(self, days: int):
    freq = self.freq

    if freq == 'D':
      return days
    
    elif freq == 'W':
      return max(1, days // 7)
    
    elif freq == 'M': 
      return max(1, days // 30)
    
    else:
      return days

  def _trend(self):
    y = self.df['y']
    x = np.arange(len(y))

    slope = np.polyfit(x,y,1)[0]

    direction = 'flat'
    if slope > 0:
      direction = 'upwards'
    if slope < 0:
      direction = 'downwards'
    
    strength = 'weak'
    if abs(slope) > 5:
      strength = "strong"
    elif abs(slope) > 2:
      strength = 'moderate'

    return { 'direction': direction, 'strength': strength }

  def _change(self):
    def calc(days):
      window = self._get_window_size(days)
      if len(self.df) < window*2:
        return 0
      
      current = self.df['y'].tail(window).mean()
      last = self.df['y'].tail(2 * window).head(window).mean()
      
      if last == 0:
        return 0
      
      return ((current - last)/last)*100
    
    last_7d = calc(7)
    last_30d = calc(30)

    return {
      'last_7d': float(last_7d),
      'last_30d': float(last_30d)
    }
  
  def _detect_annomalies(self):
    def rolling_zscore(window : int):
      r = self.df['y'].rolling(window=window)
      m = r.mean().shift(1)
      s = r.std().shift(1)

      z = (self.df['y'] - m) / s
      z = z.replace([np.inf, -np.inf], np.nan).fillna(0)
      return z
    
    self.df['z'] = rolling_zscore(2)
    annomalies = []
    
    for _,row in self.df.iterrows():
      if (abs(row['z']) >= 3):
        annomalies.append({
          'ds': row['ds'].isoformat(),
          'y': float(row['y']),
          'type': 'drop' if row['z'] < 0 else 'spike',
          'severity': 'medium' if row['z'] < 4 else 'high',
          'z_score': row['z']
        })

    return annomalies

  def _anomaly_summary(self, annomalies):
    if len(annomalies) == 0:
      return { 'count': 0, 'recent_count': 0 }
    
    cutoff = self.df['ds'].max() - timedelta(days=7)
    recent = [a for a in annomalies if a['ds'] >= cutoff]

    return {
      'count': len(annomalies),
      'recent_count': len(recent)
    }

  def _seasonality(self):
    df = self.df.copy()
    df['weekday'] = df['ds'].dt.day_name()

    weekday_avg = df.groupby('weekday')['y'].mean().to_dict()

    weekday_mean = np.mean(list(weekday_avg.values()))

    weekend_mean = (
      weekday_avg.get("Saturday", 0) +
      weekday_avg.get("Sunday", 0)
    ) / 2

    drop_pct = 0
    if weekday_mean != 0:
      drop_pct = ((weekday_mean - weekend_mean) / weekday_mean) * 100

    pattern = "none"
    if drop_pct > 10:
      pattern = "weekend dips"

    return {
      "pattern": pattern,
      "weekend_drop_pct": float(drop_pct),
      "weekday_distribution": weekday_avg
    }

  def _forecast_analysis(self):
    future = self.forecast_df.tail(7)

    if len(future) < 2:
      return {"trend": "flat", "change_pct": 0}

    y = future['yhat'].values
    x = np.arange(len(y))

    slope = np.polyfit(x, y, 1)[0]

    direction = "upward" if slope > 0 else "downward"

    start = y[0]
    end = y[-1]

    change = 0
    if start != 0:
      change = ((end - start) / start) * 100

    return {
      "trend": direction,
      "change_pct": float(change)
    }

  def run(self) -> AnalyticsEngineOut:
    anomalies = self._detect_annomalies()

    return AnalyticsEngineOut(
      dataset_id=self.dataset_id,
      trend=self._trend(),
      change=self._change(),
      anomalies=anomalies,
      anomaly_summary=self._anomaly_summary(anomalies),
      seasonality=self._seasonality(),
      forecast=self._forecast_analysis()
    )
