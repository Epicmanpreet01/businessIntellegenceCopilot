from pydantic import BaseModel, ConfigDict
import uuid

class InsightEngineOut(BaseModel):
  dataset_id : uuid.UUID
  summary : str
  reasons : list[str]
  recommendations : list[str]
  confidence : str

  model_config = ConfigDict(from_attributes=True)