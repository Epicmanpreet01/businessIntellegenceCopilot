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
  
def create_dataset_entry(db : Session, name : str, user_id : uuid.UUID):
  dataset = Datasets(
    name = name,
    user_id = user_id,
    length=0
  )  

  db.add(dataset)
  db.flush()

  return dataset

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