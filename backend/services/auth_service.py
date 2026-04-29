from sqlalchemy import select
from sqlalchemy.orm import Session
import uuid

from backend.models.user_model import Users 
from backend.schemas.auth_schemas import LoginRequest, RegisterRequest
from backend.schemas.user_schemas import UserResponse

from backend.core.exceptions import NotFoundException, UnauthorizedException, ConflictException

from backend.utils.auth_utils import check_passwords_match, hash_password

def login_user(credentials : LoginRequest, db : Session) -> uuid.UUID:
  stmt = select(Users).where(Users.email == credentials.email)
  user = db.execute(stmt).scalar_one_or_none()

  if not user:
    raise NotFoundException(message="No user found with these credentials")
  
  if not check_passwords_match(credentials.password, user.password_hash):
    raise UnauthorizedException(message="Unauthorized access : Password incorrect")
  
  return user.id

def register_user(credentials : RegisterRequest, db : Session) -> uuid.UUID:
  stmt = select(Users).where(Users.email == credentials.email)
  user = db.execute(stmt).scalar_one_or_none()

  if user:
    raise ConflictException(message="User with the given email already exists")
  
  pass_hashed = hash_password(credentials.password)
  email = credentials.email.lower()

  user = Users(
    name = credentials.name,
    email = email,
    password_hash = pass_hashed,
  )

  db.add(user)
  db.commit()
  db.refresh(user)

  return user.id

def get_user(user_id : uuid.UUID, db : Session) -> UserResponse:
  stmt = select(Users).where(Users.id == user_id)
  user = db.execute(stmt).scalar_one_or_none()

  if not user:
    raise NotFoundException(message="User not found")
  
  return UserResponse.model_validate(user)