import pandas as pd
from sqlalchemy.orm import Session
import uuid

from models.processed_data_model import ProcessedData
from models.dataset_model import Datasets
from models.forecast_model import Forecasts

from engines.data_engine import DataEngine
from engines.forecast_engine import ForecastEngine

from utils.pipeline_utils import get_default_period

def run_dataset_pipeline(dataset_id : uuid.UUID,df : pd.DataFrame, db : Session):

  data_engine = DataEngine()
  processed = data_engine.preprocess(df)

  records = processed.assign(dataset_id=dataset_id)[['dataset_id', 'ds', 'y']].to_dict('records')
  db.bulk_insert_mappings(ProcessedData, records)

  db.query(Datasets).filter(Datasets.id == dataset_id).update({
    "length": len(processed)
  })

  freq = data_engine.infer_freq(processed)
  db.query(Datasets).filter(Datasets.id == dataset_id).update({
    "freq": freq
  })

  forecast = ForecastEngine(processed).forecast(periods=get_default_period(freq),freq=freq, include_history=True)
  forecast_records = forecast.assign(dataset_id=dataset_id)[['dataset_id', 'ds','yhat']].to_dict('records')
  db.bulk_insert_mappings(Forecasts, forecast_records)

  db.commit()