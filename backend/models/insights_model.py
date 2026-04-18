from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid

from db.base import Base


class Insights(Base):
  __tablename__ = "insights"

  dataset_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("datasets.id", ondelete="CASCADE"),
    primary_key=True,
    index=True
  )

  summary: Mapped[str] = mapped_column(String, nullable=False)

  reasons: Mapped[dict] = mapped_column(JSONB, nullable=False)

  recommendations: Mapped[dict] = mapped_column(JSONB, nullable=False)