from sqlalchemy.orm import Session
import pandas as pd

from engines.data_engine import DataEngine

from core.exceptions import BadRequestException

def process_dataset(df : pd.DataFrame, db : Session) -> pd.DataFrame:
  preprocesser = DataEngine()
  
  result = preprocesser.preprocess(df)

  if not result:
    raise BadRequestException(message="Data engine failed to process data, please make sure the data is proper time series data")

  return result