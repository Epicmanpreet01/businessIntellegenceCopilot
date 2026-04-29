from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]  
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
  NAME: str = "Business Intelligence Copilot"
  DATABASE_URL: str
  MODE: str = "development"
  PORT: int = 8000
  HOST: str = "localhost"
  REDIS_PORT: int = 6379
  REDIS_HOST: str = "localhost"
  JWT_SECRET_KEY: str
  JWT_ALGORITHM: str = "HS256"
  MAX_SIZE: int = 5 * 1024 * 1024
  GROQ_API: str
  GROQ_MODEL: str = "llama-3.3-70b-versatile"
  STATIC_DIR: str = str(BASE_DIR / "frontend" / "dist")

  model_config = SettingsConfigDict(
    env_file=str(ENV_FILE),
    env_file_encoding="utf-8",
    extra="ignore"
  )


settings = Settings()