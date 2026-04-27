from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from io import BytesIO
import pandas as pd
import uuid

from core.config import settings
from core.exceptions import BadRequestException
from db.session import get_db
from api.dependencies.auth_dep import get_curr_user_id
from services.dataset_service import (
  create_dataset_entry,
  fetch_dataset_by_id,
  fetch_datasets,
  remove_dataset
)
from schemas.common import APIResponse
from orchestrators.pipeline import run_dataset_pipeline
from schemas.dataset_schemas import DatasetOut

router = APIRouter()

@router.post('/upload', response_model=APIResponse)
async def upload(file : UploadFile, db : Session = Depends(get_db), user_id : uuid.UUID = Depends(get_curr_user_id)):

  if not file.filename.endswith(".csv"):
    raise BadRequestException(message="Only CSV files are allowed")

  try:
    content = await file.read()
    if len(content) > settings.MAX_SIZE:
      raise BadRequestException(message="File too large")
    data = pd.read_csv(BytesIO(content))
  except Exception:
    raise BadRequestException(message="Invalid CSV file")
  
  filename = file.filename
  file_size = file.size

  # Adds dataset entry to the database without commiting to initialize metadata about dataset and getting unique id for the session before starting analytical pipeline
  dataset = create_dataset_entry(db, filename,file_size, user_id)

  # Running pipeline
  run_dataset_pipeline(dataset.id,data, db)

  db.refresh(dataset)

  return APIResponse(
    success=True,
    message="Successfully created dataset",
    data=DatasetOut.model_validate(dataset)
  )

@router.get('/', response_model=APIResponse)
def get_datasets(db : Session = Depends(get_db), user_id : uuid.UUID = Depends(get_curr_user_id)):
  datasets = fetch_datasets(db, user_id)

  return APIResponse(
    success=True,
    message="Successfully fetched all the dataset records",
    data=datasets
  )

@router.get('/{dataset_id}', response_model=APIResponse)
def get_dataset_by_id(dataset_id : uuid.UUID, db : Session = Depends(get_db), user_id : uuid.UUID = Depends(get_curr_user_id)):
  dataset = fetch_dataset_by_id(dataset_id, db, user_id)

  return APIResponse(
    success=True,
    message="Successfully fetched the dataset",
    data=dataset
  )

@router.delete('/{dataset_id}')
def delete_dataset(dataset_id : uuid.UUID, db : Session = Depends(get_db), user_id : uuid.UUID = Depends(get_curr_user_id)):
  dataset = remove_dataset(dataset_id, db, user_id)

  return APIResponse(
    success=True,
    message="Successfully deleted the dataset",
    data=dataset
  )