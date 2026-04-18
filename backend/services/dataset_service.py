from sqlalchemy.orm import Session
from sqlalchemy import select,and_
import pandas as pd
import uuid
from typing import List

from engines.data_engine import DataEngine
from core.exceptions import BadRequestException, NotFoundException
from models.processed_data_model import ProcessedData
from models.dataset_model import Datasets
from schemas.dataset_schemas import DatasetOut


def create_dataset(df : pd.DataFrame, db : Session, name : str, user_id : uuid.UUID) -> DatasetOut:
  preprocesser = DataEngine()
  
  result = preprocesser.preprocess(df)

  if result.empty:
    raise BadRequestException(message="Data engine failed to process data, please make sure the data is proper time series data")

  dataset = Datasets(
    name = name,
    user_id = user_id
  )  

  db.add(dataset)
  db.flush()

  records = result.assign(dataset_id=dataset.id)[['dataset_id', 'ds', 'y']].to_dict('records')
  
  try:
    db.bulk_insert_mappings(ProcessedData, records)
    db.commit()
  except Exception:
    db.rollback()
    raise

  return DatasetOut.model_validate(dataset)

def fetch_datasets(db : Session, user_id : uuid.UUID) -> List[DatasetOut]:
  stmt = select(Datasets).where(Datasets.user_id == user_id)
  datasets = db.execute(stmt).scalars().all()
  return [DatasetOut.model_validate(dataset) for dataset in datasets]

def fetch_dataset_by_id(dataset_id : uuid.UUID, db : Session, user_id : uuid.UUID) -> DatasetOut:
  stmt = select(Datasets).where(
    and_(
      Datasets.id == dataset_id,
      Datasets.user_id == user_id
    )
  )
  dataset = db.execute(stmt).scalar_one_or_none()

  if not dataset:
    raise NotFoundException(message="Could not find any matching dataset")

  return DatasetOut.model_validate(dataset)

def remove_dataset(dataset_id : uuid.UUID, db : Session, user_id : uuid.UUID) -> DatasetOut:
  stmt = select(Datasets).where(
    and_(
      Datasets.id == dataset_id,
      Datasets.user_id == user_id
    )
  )
  dataset = db.execute(stmt).scalar_one_or_none()

  if not dataset:
    raise NotFoundException(message="Could not find any matching dataset")

  db.delete(dataset)
  db.commit()

  return DatasetOut.model_validate(dataset)