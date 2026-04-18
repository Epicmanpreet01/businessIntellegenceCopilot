import bcrypt
from jose import jwt
import uuid
from datetime import datetime, timedelta, timezone

from core.config import settings

def check_passwords_match(password : str, hashed_password : str) -> bool:
  return bcrypt.checkpw(password.encode(), hashed_password.encode())

def hash_password(password : str) -> str:
  return bcrypt.hashpw(password.encode(), salt=bcrypt.gensalt()).decode()

def create_access_token(user_id : uuid.UUID) -> str:
  expire = datetime.now(timezone.utc) + timedelta(hours=24)

  payload = {
    'sub': str(user_id),
    'exp': expire
  }
  
  token = jwt.encode(payload, key=settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
  
  return token