from redis import Redis
from backend.core.config import settings

if settings.REDIS_URL:
  context_engine = Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True
  )
else:
  context_engine = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    decode_responses=True
  )