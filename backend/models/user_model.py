# Defines Users mapped class and users table in db
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column 
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from backend.db.base import Base

class Users(Base):
  __tablename__ = "users"

  id : Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True), 
    default=uuid.uuid4, 
    primary_key=True
  )

  name : Mapped[str] = mapped_column(
    String(30), 
    nullable=False
  )

  email : Mapped[str] = mapped_column(
    String(255), 
    nullable=False, 
    unique=True
  )
  
  password_hash : Mapped[str] = mapped_column(
    String(255), 
    nullable=False
  )
  
  created_at : Mapped[datetime] = mapped_column(
    DateTime(timezone=True), 
    nullable=False, 
    server_default=func.now()
  )

  def __repr__(self):
    return f"User(id={self.id!r},name={self.name!r}, email={self.email!r}, created_at={self.created_at!r})"
