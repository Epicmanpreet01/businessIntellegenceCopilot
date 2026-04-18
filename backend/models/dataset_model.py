from sqlalchemy import String, DateTime,Integer, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

from db.base import Base

class Datasets(Base):
  __tablename__ = "datasets"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4
  )

  user_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("users.id", ondelete="CASCADE"),
    nullable=False,
    index=True
  )

  name: Mapped[str] = mapped_column(String(30), nullable=False)

  length : Mapped[int] = mapped_column(Integer, nullable=False)

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    nullable=False,
    server_default=func.now()
  )