from fastapi import APIRouter, Depends, Response, Request
from sqlalchemy.orm import Session
import uuid

from backend.core.config import settings
from backend.db.session import get_db
from backend.schemas.auth_schemas import LoginRequest, RegisterRequest
from backend.schemas.common import APIResponse
from backend.api.dependencies.auth_dep import get_curr_user_id
from backend.utils.auth_utils import create_access_token
from backend.services.auth_service import login_user, register_user, get_user

router = APIRouter()

@router.post('/login', response_model=APIResponse)
def login(credentials : LoginRequest,response : Response, db : Session = Depends(get_db)):
  user_id = login_user(credentials, db)
  token = create_access_token(user_id)

  response.set_cookie(
    key='token',
    value=token,
    max_age=60*60*24,
    httponly=True,
    secure=settings.MODE == 'production',
    samesite= 'lax' if settings.MODE == 'development' else 'none'
  )

  return APIResponse(
    success=True,
    message="Logged in successfully",
    data=str(user_id)
  )

@router.post('/register', response_model=APIResponse)
def register(credentials : RegisterRequest,response : Response, db : Session = Depends(get_db)):
  
  user_id = register_user(credentials, db)
  token = create_access_token(user_id)

  response.set_cookie(
    key='token',
    value=token,
    max_age=60*60*24,
    httponly=True,
    secure=settings.MODE == 'production',
    samesite= 'lax' if settings.MODE == 'development' else 'none'
  )

  return APIResponse(
    success=True,
    message="Registered successfully",
    data=str(user_id)
  )

@router.post('/logout',response_model=APIResponse)
def logout(response : Response, user_id : uuid.UUID = Depends(get_curr_user_id)):
  response.delete_cookie(key='token')

  return APIResponse(
    success=True,
    message="Logged out successfully",
    data=[]
  )

@router.get('/me', response_model=APIResponse)
def me(db : Session = Depends(get_db), user_id : uuid.UUID = Depends(get_curr_user_id)):
  userRes = get_user(user_id, db)

  return APIResponse(
    success=True,
    message="User fetched successfully",
    data=userRes
  )