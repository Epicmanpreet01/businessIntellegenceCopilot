from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  NAME : str = "Business Intellegence Copilot"
  DATABASE_URL : str
  MODE : str = 'development'
  PORT : int = 5000
  HOST : str = 'localhost'
  JWT_SECRET_KEY : str
  JWT_ALGORITHM : str = 'HS256'

  model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

settings = Settings()