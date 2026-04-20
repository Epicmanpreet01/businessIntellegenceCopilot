import numpy as np
import pandas as pd
from datetime import timedelta

from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

class DatasetOut(BaseModel):
  id : uuid.UUID
  name : str
  length : int
  freq : str
  created_at : datetime

  model_config = ConfigDict(from_attributes=True)

class AnalyticsEngine:
  def __init__(self, df : pd.DataFrame, forecast_df : pd.DataFrame, dataset_entry : DatasetOut):
    self.df : pd.DataFrame = df.copy()
    self.forecast_df : pd.DataFrame = forecast_df.copy()
    self.dataset_entry : DatasetOut = dataset_entry

    self.df.sort_values('ds')
    self.forecast_df.sort_values('ds')

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
      "strong"
    if abs(slope) > 2:
      'moderate'

    return { 'direction': direction, 'strength': strength }

  def _change(self):
    def calc(window):
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

      return (self.df['y'] - m)/s
    
    self.df['z'] = rolling_zscore(2)
    annomalies = []
    
    for _,row in self.df.iterrows():
      if (abs(row['z']) >= 3):
        annomalies.append({
          'ds': row['ds'],
          'y': float(row['y']),
          'type': 'drop' if row['z'] < 0 else 'spike',
          'severity': 'medium' if row['z'] < 4 else 'high',
          'z_score': row['z']
        })

    return annomalies

  def _annomally_summary(self, annomalies):
    if len(annomalies) == 0:
      return { 'count': 0, 'recent_count': 0 }
    
    cutoff = self.df['ds'].max() - timedelta(days=7)
    recent = [a for a in annomalies if self.df['ds'] >= cutoff]

    return {
      'count': len(annomalies),
      'recent': len(recent)
    }

if __name__ == '__main__':

  dates = pd.date_range(start='2024-01-01', periods=60, freq='D')
  values = np.random.randn(60).cumsum()

  df = pd.DataFrame({
    'ds': dates,
    'y': values
  })