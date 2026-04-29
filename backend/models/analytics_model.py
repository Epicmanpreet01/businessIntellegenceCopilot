from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import ForeignKey
import uuid

from backend.db.base import Base


class Analytics(Base):
  __tablename__ = "analytics"

  dataset_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("datasets.id", ondelete="CASCADE"),
    primary_key=True,
    index=True
  )

  # {"direction": "downward", "strength": "strong"}
  trend: Mapped[dict] = mapped_column(JSONB, nullable=False)

  # {"last_7d": -12, "last_30d": -18}
  change: Mapped[dict] = mapped_column(JSONB, nullable=False)

  # FULL anomaly objects (NOT just dates)
  anomalies: Mapped[list] = mapped_column(JSONB, nullable=False)

  # {"count": 2, "recent_count": 1}
  anomaly_summary: Mapped[dict] = mapped_column(JSONB, nullable=False)

  # {
  #   "pattern": "",
  #   "strength": "",
  #   "seasonal_strength_score": ,
  #   "dominant_period": ,
  #   "distribution": {}
  # }
  seasonality: Mapped[dict] = mapped_column(JSONB, nullable=False)

  # {"trend": "downward", "change_pct": -5}
  forecast: Mapped[dict] = mapped_column(JSONB, nullable=False)
