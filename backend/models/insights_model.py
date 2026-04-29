from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from backend.db.base import Base


class Insights(Base):
  __tablename__ = "insights"

  dataset_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("datasets.id", ondelete="CASCADE"),
    primary_key=True,
    index=True
  )

  summary: Mapped[str] = mapped_column(String, nullable=False)

  # ["Overall decline", "Weekend dips"]
  reasons: Mapped[list] = mapped_column(JSONB, nullable=False)

  # ["Run weekend promotions", "Increase marketing"]
  recommendations: Mapped[list] = mapped_column(JSONB, nullable=False)

  # "high" | "medium" | "low"
  confidence: Mapped[str] = mapped_column(String, nullable=False)
