import json
import uuid

from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException
from groq import Groq

from core.config import settings

from context_engine.redis import context_engine

from models.analytics_model import Analytics
from models.insights_model import Insights
from models.messages_model import Message

from schemas.chat_schema import MessageOut, MessagesOut

from utils.chat_utils import create_chat_context


# Fetches all chat messages for a dataset
# ordered oldest to newest.
def fetch_messages(
  dataset_id: uuid.UUID,
  db: Session
) -> MessagesOut:
  stmt = (
    select(Message)
    .where(
      Message.dataset_id == dataset_id
    )
    .order_by(
      Message.created_at.asc()
    )
  )

  rows = db.execute(stmt).scalars().all()

  messages = []

  for row in rows:
    messages.append(
      MessageOut.model_validate(row)
    )

  return MessagesOut(
    dataset_id=dataset_id,
    messages=messages
  )

# Main chat entry point.
# Loads Redis cache, refreshes context if dataset changed,
# stores user message, gets AI response, stores assistant reply,
# updates cache, returns response.
def fetch_response(
  message: str,
  user_id: uuid.UUID,
  dataset_id: uuid.UUID,
  db: Session
):
  redis_key = f"dashboard:{user_id}"

  try:
    data = context_engine.hgetall(redis_key)
  except Exception:
    data = {}

  context = data.get("context")
  saved_dataset_id = data.get("dataset_id")
  history = json.loads(
    data.get("history", "[]")
  )

  dataset_changed = (
    saved_dataset_id != str(dataset_id)
  )

  if dataset_changed or not context:
    context = load_dataset_context(
      dataset_id,
      db
    )

    history = load_message_history(
      dataset_id,
      db
    )

  save_message(
    dataset_id,
    "user",
    message,
    db,
    commit=False
  )

  try:
    response = generate_chat_response(
      context,
      history,
      message
    )
  except Exception:
    db.rollback()

    raise HTTPException(
      status_code=500,
      detail="AI response failed"
    )

  row = save_message(
    dataset_id,
    "assistant",
    response,
    db,
    commit=False
  )

  db.commit()

  history.append({
    "role": "user",
    "content": message
  })

  history.append({
    "role": "assistant",
    "content": response
  })

  history = history[-10:]

  save_chat_state(
    redis_key,
    dataset_id,
    context,
    history
  )

  return MessageOut.model_validate(row)


# Fetches analytics + insights from DB
# and converts them into reusable LLM context text.
def load_dataset_context(
  dataset_id: uuid.UUID,
  db: Session
):
  stmt = (
    select(Analytics, Insights)
    .join(
      Insights,
      Analytics.dataset_id == Insights.dataset_id
    )
    .where(
      Analytics.dataset_id == dataset_id
    )
  )

  row = db.execute(stmt).first()

  if row is None:
    raise HTTPException(
      status_code=404,
      detail="Dataset not found"
    )

  analytics, insights = row

  return create_chat_context(
    analytics,
    insights
  )


# Loads previous chat messages from DB
# and returns latest 10 messages as history.
def load_message_history(
  dataset_id: uuid.UUID,
  db: Session
):
  stmt = (
    select(Message)
    .where(
      Message.dataset_id == dataset_id
    )
    .order_by(
      Message.created_at.asc()
    )
  )

  rows = db.execute(stmt).scalars().all()

  history = []

  for row in rows[-10:]:
    history.append({
      "role": row.role,
      "content": row.content
    })

  return history


# Builds Groq chat messages using context + history + user input,
# sends request to Groq API, and returns assistant response.
def generate_chat_response(
  context: str,
  history: list,
  message: str
) -> str:
  messages = [
    {
      "role": "system",
      "content": context
    }
  ]

  messages.extend(history)

  messages.append({
    "role": "user",
    "content": message
  })

  client = Groq(
    api_key=settings.GROQ_API
  )

  completion = client.chat.completions.create(
    model=settings.GROQ_MODEL,
    messages=messages,
    temperature=0.4,
    max_tokens=700,
    top_p=0.9,
    stream=False
  )

  return completion.choices[0].message.content


# Saves a single user or assistant message
# into database message history.
def save_message(
  dataset_id: uuid.UUID,
  role: str,
  content: str,
  db: Session,
  commit: bool = True
):
  row = Message(
    dataset_id=dataset_id,
    role=role,
    content=content
  )

  db.add(row)

  if commit:
    db.commit()

  return row

# Saves active dataset context + recent chat history
# into Redis cache for faster future requests.
def save_chat_state(
  redis_key: str,
  dataset_id: uuid.UUID,
  context: str,
  history: list
):
  try:
    context_engine.hset(
      redis_key,
      mapping={
        "dataset_id": str(dataset_id),
        "context": context,
        "history": json.dumps(history)
      }
    )

    context_engine.expire(
      redis_key,
      3600
    )

  except Exception:
    pass