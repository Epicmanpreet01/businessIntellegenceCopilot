from pydantic import BaseModel
import uuid

class InsightEngineOut(BaseModel):
  dataset_id : uuid.UUID
  summary : str
  reasons : list[str]
  recommendations : list[str]
  confidence : str