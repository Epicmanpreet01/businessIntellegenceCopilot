from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID, ForeignKey, String, DateTime, func
from db.base import Base
import uuid

from datetime import datetime

class Message(Base):
  __tablename__ = 'messages'

  id : Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4  
  ) 

  dataset_id : Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True), 
    ForeignKey('datasets.id', ondelete='CASCADE'),
    nullable=False
  )

  content: Mapped[str] = mapped_column(
    String,
    nullable=False
  )

  role : Mapped[str] = mapped_column(
    String,
    nullable=False
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    nullable=False,
    server_default=func.now()
  )