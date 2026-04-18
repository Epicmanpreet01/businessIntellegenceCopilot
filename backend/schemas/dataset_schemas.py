from pydantic import BaseModel, ConfigDict
import uuid
from datetime import datetime

class DatasetOut(BaseModel):
  id : uuid.UUID
  name : str
  created_at : datetime

  model_config = ConfigDict(from_attributes=True)