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


  # Extended analytics for chat intellegence, dashboard already extracts most of them automatically
  def _forecast_analysis(self):
    future = self.forecast_df.tail(7)

    if len(future) < 2:
      return {
        "trend": "flat",
        "change_pct": 0,
        "strength": "weak",
        "volatility": "low",
        "confidence": "low",
        "consistency": "mixed"
      }

    y = future['yhat'].values
    x = np.arange(len(y))

    slope = np.polyfit(x, y, 1)[0]

    direction = "upward" if slope > 0 else "downward"

    start = y[0]
    end = y[-1]

    change = 0
    if start != 0:
      change = ((end - start) / start) * 100

    # strength
    if abs(slope) > 0.05:
      strength = "strong"
    elif abs(slope) > 0.02:
      strength = "moderate"
    else:
      strength = "weak"

    # volatility
    volatility_ratio = np.std(y) / (np.mean(y) + 1e-9)
    if volatility_ratio > 0.3:
      volatility = "high"
    elif volatility_ratio > 0.1:
      volatility = "medium"
    else:
      volatility = "low"

    # consistency
    diffs = np.diff(y)
    positive_ratio = np.sum(diffs > 0) / len(diffs)
    if positive_ratio > 0.7:
      consistency = "consistent_growth"
    elif positive_ratio < 0.3:
      consistency = "consistent_decline"
    else:
      consistency = "mixed"

    # confidence
    if abs(change) > 15:
      confidence = "high"
    elif abs(change) > 5:
      confidence = "medium"
    else:
      confidence = "low"

    # extremes
    peak_idx = np.argmax(y)
    dip_idx = np.argmin(y)

    return {
      "trend": direction,
      "change_pct": float(change),
      "strength": strength,
      "volatility": volatility,
      "consistency": consistency,
      "confidence": confidence,
      "peak": {
        "index": int(peak_idx),
        "value": float(y[peak_idx])
      },
      "dip": {
        "index": int(dip_idx),
        "value": float(y[dip_idx])
      }
    }

  def _momentum(self):
    change = self._change()['last_7d']

    if change > 10:
      return "strong_positive"
    elif change > 3:
      return "positive"
    elif change < -10:
      return "strong_negative"
    elif change < -3:
      return "negative"
    return "flat"

  def _volatility(self):
    y = self.df['y']
    ratio = y.std() / (y.mean() + 1e-9)

    if ratio > 0.5:
      return "high"
    elif ratio > 0.2:
      return "medium"
    return "low"

  def _relative_performance(self):
    window = self._get_window_size(7)

    recent = self.df['y'].tail(window).mean()
    overall = self.df['y'].mean()

    if recent > overall * 1.1:
      return "above_average"
    elif recent < overall * 0.9:
      return "below_average"
    return "average"
  
  def _acceleration(self):
    short = self._change()['last_7d']
    long = self._change()['last_30d']

    if short > long:
      return "accelerating"
    elif short < long:
      return "decelerating"
    return "stable"

  def _anomaly_impact(self, anomalies):
    if len(anomalies) == 0:
      return "none"

    high = sum(1 for a in anomalies if a['severity'] == 'high')

    if high > 2:
      return "high"
    elif len(anomalies) > 3:
      return "moderate"
    return "low"

  def _forecast_reliability(self, volatility, anomaly_impact):
    if volatility == "high" or anomaly_impact == "high":
      return "low"
    elif volatility == "medium":
      return "medium"
    return "high"

  def _extremes(self):
    idx_max = self.df['y'].idxmax()
    idx_min = self.df['y'].idxmin()

    return {
      "peak": {
        "date": self.df.loc[idx_max, 'ds'].isoformat(),
        "value": float(self.df.loc[idx_max, 'y'])
      },
      "trough": {
        "date": self.df.loc[idx_min, 'ds'].isoformat(),
        "value": float(self.df.loc[idx_min, 'y'])
      }
    }

  def _risk_level(self, volatility, anomaly_impact, forecast):
    if forecast['trend'] == 'downward' and anomaly_impact == 'high':
      return "high"
    elif volatility == "high":
      return "medium"
    return "low"

  def _opportunity(self, forecast):
    momentum = self._momentum()

    if momentum in ["positive", "strong_positive"] and forecast['trend'] == "upward":
      return "high"
    elif momentum == "positive":
      return "medium"
    return "low"
  
  def _recovery(self):
    change = self._change()['last_7d']
    prev = self._change()['last_30d']

    if prev < 0 and change > 0:
      return "recovering"
    return "stable"
    
  def _behavior_profile(self):
    volatility = self._volatility()
    trend = self._trend()['direction']

    if volatility == "low" and trend == "upwards":
      return "stable_growth"
    elif volatility == "high" and trend == "upwards":
      return "volatile_growth"
    elif volatility == "high" and trend == "downwards":
      return "unstable_decline"
    return "stable"
  
  def _recent_anomaly_bias(self, anomalies):
    if not anomalies:
      return "none"

    recent = sorted(anomalies, key=lambda x: x['ds'], reverse=True)[:3]

    drops = sum(1 for a in recent if a['type'] == 'drop')
    spikes = sum(1 for a in recent if a['type'] == 'spike')

    if drops > spikes:
      return "negative_bias"
    elif spikes > drops:
      return "positive_bias"
    return "neutral"
  
  def _trend_alignment(self, forecast):
    past = self._trend()['direction']
    future = forecast['trend']

    if past == future:
      return "aligned"
    return "reversal_expected"

  def _overall_state(self):
    trend = self._trend()['direction']
    momentum = self._momentum()

    if trend == "downwards":
      return "declining"
    elif momentum in ["strong_positive", "positive"]:
      return "growing"
    return "stable"

  def run(self) -> AnalyticsEngineOut:
    anomalies = self._detect_annomalies()

    trend = self._trend()
    change = self._change()
    forecast = self._forecast_analysis()
    momentum = self._momentum()
    volatility = self._volatility()
    anomaly_impact = self._anomaly_impact(anomalies)

    return AnalyticsEngineOut(
      dataset_id=self.dataset_id,

      # Core
      trend=trend,
      change=change,

      # Derived
      momentum=momentum,
      volatility=volatility,
      relative_performance=self._relative_performance(),
      acceleration=self._acceleration(),

      # Anomalies
      anomalies=anomalies,
      anomaly_summary=self._anomaly_summary(anomalies),
      anomaly_impact=anomaly_impact,
      anomaly_bias=self._recent_anomaly_bias(anomalies),

      # Seasonality
      seasonality=self._seasonality(),

      # Forecast
      forecast=forecast,
      forecast_reliability=self._forecast_reliability(volatility, anomaly_impact),
      trend_alignment=self._trend_alignment(forecast),

      # Extremes
      extremes=self._extremes(),

      # High-level signals
      risk_level=self._risk_level(volatility, anomaly_impact, forecast),
      opportunity_level=self._opportunity(forecast),
      recovery_state=self._recovery(),
      behavior_profile=self._behavior_profile(),
      overall_state=self._overall_state()
    )