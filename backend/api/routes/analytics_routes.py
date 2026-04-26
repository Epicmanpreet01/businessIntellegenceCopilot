from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid

from dependencies.auth_dep import get_curr_user_id
from db.session import get_db

router = APIRouter()

@router.get('/analytics/{dataset_id}')
def get_analytics_report(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  pass

@router.get('/insights/{dataset_id}')
def get_insight_report(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  pass

@router.get('/forecast/{dataset_id}')
def get_forecast_report(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  pass