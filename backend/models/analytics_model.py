from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import ForeignKey, String, Float
import uuid

from db.base import Base

class Analytics(Base):
  __tablename__ = "analytics"

  dataset_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("datasets.id", ondelete="CASCADE"),
    primary_key=True,
    index=True
  )

  trend: Mapped[str] = mapped_column(String, nullable=False)

  change_pct: Mapped[float] = mapped_column(
    Float,
    nullable=False
  )

  seasonality: Mapped[str] = mapped_column(
    String,
    nullable=False
  )

  anomalies: Mapped[dict] = mapped_column(
    JSONB,
    nullable=False
  )