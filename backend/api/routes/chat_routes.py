from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session
from typing import Annotated
import uuid

from backend.api.dependencies.auth_dep import get_curr_user_id
from backend.db.session import get_db

from backend.schemas.common import APIResponse

from backend.services.chat_service import fetch_response, fetch_messages

router = APIRouter()

@router.get('/{dataset_id}')
def get_messages(dataset_id: uuid.UUID,user_id : uuid.UUID = Depends(get_curr_user_id), db : Session = Depends(get_db)):
  messages = fetch_messages(dataset_id, db)

  return APIResponse(
    success=True,
    message="Fetched messages",
    data=messages
  )

@router.post('/{dataset_id}')
def get_response(message : Annotated[str, Body()], dataset_id : uuid.UUID, user_id : uuid.UUID = Depends(get_curr_user_id), db : Session = Depends(get_db)):
  response = fetch_response(message, user_id, dataset_id, db)

  return APIResponse(
    success=True,
    message="Successfully fetched response",
    data=response
  )

