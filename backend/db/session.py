# Module contains main session creation dependency that will be used throughout api to make temp connections to the db when needed
from sqlalchemy.orm import sessionmaker
from backend.db.base import engine

SessionLocal = sessionmaker(
  bind=engine,
  autoflush=False
)

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()