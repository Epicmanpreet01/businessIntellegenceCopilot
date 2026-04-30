from redis import Redis
from backend.core.config import settings
from backend.core.logging import get_logger

logger = get_logger(__name__)

def get_redis_client():
  try:
    if settings.REDIS_URL:
      client = Redis.from_url(
        settings.REDIS_URL,
        decode_responses=True
      )
    else:
      client = Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        decode_responses=True
      )
    
    # Test connection
    client.ping()
    logger.info("Successfully connected to Redis")
    return client
  except Exception as e:
    logger.error(f"Failed to connect to Redis: {e}")
    # Return client anyway so that other parts of the app don't crash immediately,
    # or handle it gracefully elsewhere.
    return client

context_engine = get_redis_client()