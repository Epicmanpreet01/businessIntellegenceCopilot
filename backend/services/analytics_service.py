from sqlalchemy import select, and_
from sqlalchemy.orm import Session
import uuid

from models.analytics_model import Analytics
from models.dataset_model import Datasets

from core.exceptions import NotFoundException

def fetch_analytics_report(dataset_id: uuid.UUID, user_id: uuid.UUID,db: Session):
  stmt = select(Analytics).join(Datasets,Analytics.dataset_id == Datasets.id).where(
    and_(
      Analytics.dataset_id == dataset_id,
      Datasets.user_id == user_id
    )
  )
  analytics_report = db.execute(stmt).scalar_one_or_none()

  if analytics_report is None:
    raise NotFoundException(message="Analytics report not found")
  
  return analytics_report