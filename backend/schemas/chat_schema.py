from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid

class MessageOut(BaseModel):
  id: uuid.UUID
  role: str
  content: str
  created_at: datetime

  model_config = ConfigDict(from_attributes=True)

class MessagesOut(BaseModel):
  dataset_id : uuid.UUID
  messages: list[MessageOut]

class ResponseOut(BaseModel):
  response : str