from utils.chat_utils import create_chat_context
from services.chat_service import load_message_history, save_chat_state
from db.session import SessionLocal
from schemas.analytics_schema import AnalyticsEngineOut
from schemas.insights_schema import InsightEngineOut

import uuid

def warm_dashboard_chat_state(
  user_id : uuid.UUID,
  dataset_id : uuid.UUID,
  analytics_report : AnalyticsEngineOut,
  insights_report : InsightEngineOut
):
  db = SessionLocal()

  try:
    redis_key = f"dashboard:{user_id}"

    context = create_chat_context(
      analytics_report,
      insights_report
    )

    history = load_message_history(
      dataset_id,
      db
    )

    save_chat_state(
      redis_key,
      dataset_id,
      context,
      history
    )

  finally:
    db.close()