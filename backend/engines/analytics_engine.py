import numpy as np
import pandas as pd
from datetime import timedelta, datetime
from statsmodels.tsa.seasonal import STL
import uuid

from backend.schemas.analytics_schema import AnalyticsEngineOut

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

  def _get_period_size(self):
    if self.freq == 'D':
      return 7 # Weekly
    elif self.freq == 'W':
      return 52 # Yearly
    elif self.freq == 'M':
      return 12 # Yearly
    else:
      return 7

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
    df = self.df.copy()
    df = df.sort_values('ds').dropna(subset=['y'])

    period = self._get_period_size()

    if len(df) < max(period * 2, 8):
      return []

    try:
      series = df['y'].astype(float).reset_index(drop=True)

      result = STL(
        series,
        period=period,
        robust=True
      ).fit()

      resid = pd.Series(result.resid)
      resid_std = resid.std()

      if resid_std == 0 or pd.isna(resid_std):
        return []

      z_scores = resid / resid_std
      df['resid'] = resid
      df['z_score'] = z_scores

      annomalies = []

      for _, row in df.iterrows():
        score = float(row['z_score'])

        if abs(score) >= 2.5:
          if abs(score) >= 4:
            severity = 'high'
          elif abs(score) >= 3:
            severity = 'medium'
          else:
            severity = 'low'

          annomalies.append({
            'ds': row['ds'].isoformat(),
            'y': float(row['y']),
            'type': 'drop' if score < 0 else 'spike',
            'severity': severity,
            'z_score': score
          })

      return annomalies

    except:
      return []
      
  def _anomaly_summary(self, annomalies):
    if len(annomalies) == 0:
      return { 'count': 0, 'recent_count': 0 }
    
    cutoff = self.df['ds'].max() - timedelta(days=7)
    recent = [a for a in annomalies if datetime.fromisoformat(a['ds']) >= cutoff]

    return {
      'count': len(annomalies),
      'recent_count': len(recent)
    }

  def _seasonality(self):
    df : pd.DataFrame = self.df.copy()
    df = df.sort_values('ds').dropna(subset=['ds','y'])

    period = self._get_period_size()

    if len(df) < max(period * 2, 8):
      return {
        "pattern": "insufficient_data",
        "strength": "none",
        "seasonal_strength_score": 0.0,
        "dominant_period": None,
        "distribution": {}
      }

    try:
      series = df['y'].astype(float).reset_index(drop=True)

      results = STL(
        series,
        period=period,
        robust=True
      ).fit()

      seasonal = results.seasonal
      resid = results.resid

      demon = np.var(seasonal + resid)
      num = np.var(resid  )
      score = 0.0 if demon == 0 else (1-num/demon)

      strength = 'none'
      if score > 0.65:
        strength = 'strong'
      elif score > 0.35:
        strength = 'medium'
      elif score > 0.15:
        strength = 'weak'
      
      pattern = 'none'
      distribution = {}
      df['seasonal'] = seasonal

      if self.freq == 'D':
        df['label'] = df['ds'].dt.day_name()

        order = [
          "Monday", "Tuesday", "Wednesday",
          "Thursday", "Friday",
          "Saturday", "Sunday"
        ]

        grouped = (
          df.groupby('label')['seasonal']
          .mean()
          .reindex(order)
          .fillna(0)
        )

        weekday_mean = grouped.iloc[:5].mean()
        weekend_mean = grouped.iloc[5:].mean()

        if abs(weekday_mean) > 1e-9:
          change_pct = ((weekend_mean - weekday_mean) / abs(weekday_mean)) * 100
        else:
          change_pct = 0

        if strength == "none":
          pattern = "none"
        elif change_pct > 10:
          pattern = "weekend spikes"
        elif change_pct < -10:
          pattern = "weekend dips"
        else:
          pattern = "stable weekly pattern"

        dominant_period = 'weekly'
      else:
        df['label'] = df['ds'].dt.month_name()

        order = [
          "January", "February", "March", "April",
          "May", "June", "July", "August",
          "September", "October", "November", "December"
        ]

        grouped = (
          df.groupby('label')['seasonal']
          .mean()
          .reindex(order)
          .fillna(0)
        )

        if strength == 'none':
          pattern = 'none'
        else:
          pattern = f"peaks in {grouped.idxmax()}, dips in {grouped.idxmin()}"

        dominant_period = 'yearly'
  
      distribution = {
        k: float(round(v, 2))
        for k, v in grouped.to_dict().items()
      }

      return {
        "pattern": pattern,
        "strength": strength,
        "seasonal_strength_score": float(round(score, 4)),
        "dominant_period": dominant_period,
        "distribution": distribution
      }
  

    except:
      return {
        "pattern": "error",
        "strength": "none",
        "seasonal_strength_score": 0.0,
        "dominant_period": None,
        "distribution": {}
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
