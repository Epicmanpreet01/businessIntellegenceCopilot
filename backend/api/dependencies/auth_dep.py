from fastapi import Request
from jose import jwt, JWTError
import uuid

from core.exceptions import UnauthorizedException
from core.config import settings

def get_curr_user_id(request : Request):
  token = request.cookies.get('token')

  if not token:
    raise UnauthorizedException(message="No access token found")
  
  try:
    payload = jwt.decode(token, settings.JWT_SECRET_KEY, [settings.JWT_ALGORITHM])
    user_id = payload.get('sub')

    if not user_id:
      raise UnauthorizedException(message="Invalid token")
    
    return uuid.UUID(user_id)
  
  except JWTError:
    raise UnauthorizedException(message="Invalid access token")
  

