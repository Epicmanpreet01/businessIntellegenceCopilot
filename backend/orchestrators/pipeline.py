import pandas as pd
from sqlalchemy.orm import Session
import uuid

from backend.models.processed_data_model import ProcessedData
from backend.models.dataset_model import Datasets
from backend.models.forecast_model import Forecasts
from backend.models.analytics_model import Analytics
from backend.models.insights_model import Insights

from backend.engines.data_engine import DataEngine
from backend.engines.forecast_engine import ForecastEngine
from backend.engines.analytics_engine import AnalyticsEngine
from backend.engines.insights_engine import InsightsEngine
from backend.core.logging import get_logger

logger = get_logger(__name__)

def run_dataset_pipeline(dataset_id : uuid.UUID,df : pd.DataFrame, db : Session):
  logger.info(f"Starting pipeline for dataset: {dataset_id}")
  try:
    data_engine = DataEngine()
    logger.info("Running data preprocessing...")
    processed = data_engine.preprocess(df)
    freq = data_engine.infer_freq(processed)

    logger.info(f"Inserting {len(processed)} processed records into DB...")
    records = processed.assign(dataset_id=dataset_id)[['dataset_id', 'ds', 'y']].to_dict('records')
    db.bulk_insert_mappings(ProcessedData, records)

    db.query(Datasets).filter(Datasets.id == dataset_id).update({
      "length": len(processed),
      "freq": freq
    })

    length = len(df)
    periods = max(100, length // 20)

    logger.info(f"Generating forecast for {periods} periods with frequency {freq}...")
    forecast = ForecastEngine(processed).forecast(periods=periods,freq=freq, include_history=True)
    forecast_records = forecast.assign(dataset_id=dataset_id)[['dataset_id', 'ds','yhat']].to_dict('records')
    db.bulk_insert_mappings(Forecasts, forecast_records)

    logger.info("Running analytics engine...")
    analytics_result = AnalyticsEngine(processed, forecast, dataset_id,freq).run()
    db.add(Analytics(**analytics_result.model_dump()))

    logger.info("Generating insights...")
    insights_result = InsightsEngine(dataset_id,analytics_result).generate()
    db.add(Insights(**insights_result.model_dump()))

    db.commit()
    logger.info(f"Pipeline completed successfully for dataset: {dataset_id}")
  except Exception as e:
    logger.error(f"Pipeline failed for dataset {dataset_id}: {e}")
    db.rollback()
    raise e