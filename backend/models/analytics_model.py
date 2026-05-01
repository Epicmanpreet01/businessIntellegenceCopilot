from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
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

  trend: Mapped[dict] = mapped_column(JSONB, nullable=False)
  change: Mapped[dict] = mapped_column(JSONB, nullable=False)
  anomalies: Mapped[list] = mapped_column(JSONB, nullable=False)
  anomaly_summary: Mapped[dict] = mapped_column(JSONB, nullable=False)
  seasonality: Mapped[dict] = mapped_column(JSONB, nullable=False)
  forecast: Mapped[dict] = mapped_column(JSONB, nullable=False)

  # Extended analytics for chat right now
  forecast_reliability: Mapped[str] = mapped_column(String, nullable=False)
  trend_alignment: Mapped[str] = mapped_column(String, nullable=False)
  momentum: Mapped[str] = mapped_column(String, nullable=False)
  volatility: Mapped[str] = mapped_column(String, nullable=False)
  relative_performance: Mapped[str] = mapped_column(String, nullable=False)
  acceleration: Mapped[str] = mapped_column(String, nullable=False)
  anomaly_impact: Mapped[str] = mapped_column(String, nullable=False)
  anomaly_bias: Mapped[str] = mapped_column(String, nullable=False)

  extremes: Mapped[dict] = mapped_column(JSONB, nullable=False)

  risk_level: Mapped[str] = mapped_column(String, nullable=False)
  opportunity_level: Mapped[str] = mapped_column(String, nullable=False)
  recovery_state: Mapped[str] = mapped_column(String, nullable=False)
  behavior_profile: Mapped[str] = mapped_column(String, nullable=False)
  overall_state: Mapped[str] = mapped_column(String, nullable=False)