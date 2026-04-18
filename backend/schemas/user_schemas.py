from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
import uuid

class UserResponse(BaseModel):
  id : uuid.UUID
  name : str
  email : EmailStr
  created_at : datetime

  model_config = ConfigDict(from_attributes=True)