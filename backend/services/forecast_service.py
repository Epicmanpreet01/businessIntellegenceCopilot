from sqlalchemy import select, and_
from sqlalchemy.orm import Session
import uuid

from models.forecast_model import Forecasts
from models.dataset_model import Datasets

from core.exceptions import NotFoundException

def fetch_forecast_report(dataset_id: uuid.UUID, user_id: uuid.UUID,db: Session):
  stmt = (
    select(Forecasts.ds, Forecasts.yhat)
      .join(Datasets,Forecasts.dataset_id == Datasets.id)
      .where(
        and_(
          Forecasts.dataset_id == dataset_id,
          Datasets.user_id == user_id
        )
      )
      .order_by(Forecasts.ds.asc())
  )
  forecasts = db.execute(stmt).all()

  if not forecasts:
    raise NotFoundException(message="Forecasts not found")

  rows = [
    {
      'ds': row.ds,
      'yhat': row.yhat
    } for row in forecasts
  ]
  
  return rows
  