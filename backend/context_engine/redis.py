from redis import Redis
from core.config import settings

context_engine = Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)