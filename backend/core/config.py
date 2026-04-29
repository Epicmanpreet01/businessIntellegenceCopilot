from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  NAME : str = "Business Intellegence Copilot"
  DATABASE_URL : str
  MODE : str = 'development'
  PORT : int = 8000
  REDIS_PORT : int = 6379
  REDIS_HOST : str = 'localhost'
  HOST : str = 'localhost'
  JWT_SECRET_KEY : str
  JWT_ALGORITHM : str = 'HS256'
  MAX_SIZE : int = 5 * 1024 * 1024
  GROQ_API : str
  GROQ_MODEL : str = "llama-3.3-70b-versatile"
  STATIC_DIR : str = "../frontend/dist"

  model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

settings = Settings()