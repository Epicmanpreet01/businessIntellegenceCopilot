from sqlalchemy import select, and_
from sqlalchemy.orm import Session
import uuid

from backend.models.insights_model import Insights
from backend.models.dataset_model import Datasets

from backend.core.exceptions import NotFoundException

def fetch_insights_report(dataset_id: uuid.UUID, user_id: uuid.UUID,db: Session):
  stmt = select(Insights).join(Datasets,Insights.dataset_id == Datasets.id).where(
    and_(
      Insights.dataset_id == dataset_id,
      Datasets.user_id == user_id
    )
  )
  insights_report = db.execute(stmt).scalar_one_or_none()

  if insights_report is None:
    raise NotFoundException(message="Insights report not found")
  
  return insights_report