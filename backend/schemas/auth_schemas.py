from pydantic import BaseModel, EmailStr, field_validator, model_validator
import re

def is_password_valid(password : str) -> bool:
  return bool(re.match(r'^(?=.*\d).{8,}$', password))

class LoginRequest(BaseModel):
  email : EmailStr
  password : str

  @field_validator('password')
  @classmethod
  def validate_password(cls,v):
    if not is_password_valid(v):
      raise ValueError("Invalid password")
    return v
  
class RegisterRequest(BaseModel):
  name : str
  email : EmailStr
  password : str
  confirm_password : str

  @field_validator('password', 'confirm_password')
  @classmethod
  def validate_password(cls,v):
    if not is_password_valid(v):
      raise ValueError("Invalid password")
    return v
  
  @model_validator(mode='after')
  def match_passwords(self):
    if self.password != self.confirm_password:
      raise ValueError("Passwords do not match")
    return self