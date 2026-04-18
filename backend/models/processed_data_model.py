from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, DateTime, Float, Index
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from db.base import Base


class ProcessedData(Base):
  __tablename__ = "processed_data"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4
  )

  dataset_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("datasets.id", ondelete="CASCADE"),
    nullable=False
  )

  ds: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    nullable=False
  )

  y: Mapped[float] = mapped_column(
    Float,
    nullable=False
  )

  __table_args__ = (
    Index("idx_processed_dataset_time", "dataset_id", "ds"),
  )