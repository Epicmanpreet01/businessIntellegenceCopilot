from prophet import Prophet
import pandas as pd

from backend.core.exceptions import BadRequestException

class ForecastEngine:
  def __init__(self, dataframe : pd.DataFrame):
    
    try:
      dataframe = dataframe[['ds','y']].copy()
    except KeyError:
      raise BadRequestException(message="dataframe is invalid")
    
    self.df = dataframe
  
  def forecast(self, periods : int = 365, freq : str = 'D', include_history : bool = True) -> pd.DataFrame:
    try:
      model = Prophet()
      model.fit(self.df)

      future = model.make_future_dataframe(periods, freq, include_history)
      forecast = model.predict(future)
    except Exception as e:
      raise BadRequestException(f"Forecasting failed: {str(e)}")
    
    return forecast[['ds','yhat']]

