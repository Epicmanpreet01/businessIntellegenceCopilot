from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid

from api.dependencies.auth_dep import get_curr_user_id
from db.session import get_db

from services.analytics_service import fetch_analytics_report
from services.insights_service import fetch_insights_report
from services.forecast_service import fetch_forecast_data
from services.dataset_service import fetch_processed_data

from schemas.common import APIResponse
from schemas.analytics_schema import AnalyticsEngineOut
from schemas.insights_schema import InsightEngineOut
from schemas.dashboard_schema import DashboardOut

router = APIRouter()

@router.get('/{dataset_id}/analytics', response_model=APIResponse)
def get_analytics_report(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  analytics_report = fetch_analytics_report(dataset_id, user_id, db)
  return APIResponse(
    success=True,
    message="Fetched analytics report successfully",
    data=AnalyticsEngineOut.model_validate(analytics_report)
  )

@router.get('/{dataset_id}/insights', response_model=APIResponse)
def get_insight_report(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  insight_report = fetch_insights_report(dataset_id, user_id, db)
  return APIResponse(
    success=True,
    message="Fetched insights report successfully",
    data=InsightEngineOut.model_validate(insight_report)
  )

@router.get('/{dataset_id}/forecast', response_model=APIResponse)
def get_forecast_report(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  forecasted_rows = fetch_forecast_data(dataset_id, user_id, db)
  
  return APIResponse(
    success=True,
    message="Fetched forecast rows successfully",
    data=forecasted_rows
  )

@router.get('/{dataset_id}/processed-data', response_model=APIResponse)
def get_processed_data(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  processed_data = fetch_processed_data(dataset_id, db, user_id)

  return APIResponse(
    success=True,
    message="Fetched processed data rows successfully",
    data=processed_data
  )

@router.get('/{dataset_id}/dashboard', response_model=APIResponse)
def get_dashboard(dataset_id: uuid.UUID, user_id: uuid.UUID = Depends(get_curr_user_id), db: Session = Depends(get_db)):
  analytics_report = fetch_analytics_report(dataset_id, user_id, db)
  insights_report = fetch_insights_report(dataset_id, user_id, db)
  forecasted_rows = fetch_forecast_data(dataset_id, user_id, db)
  processed_data = fetch_processed_data(dataset_id, db, user_id)

  return APIResponse(
    success=True,
    message="Fetched dashboard metrics successfully",
    data=DashboardOut(
      analytics= AnalyticsEngineOut.model_validate(analytics_report),
      insights= InsightEngineOut.model_validate(insights_report),
      forecast= forecasted_rows,
      processed_data= processed_data
    )
  )