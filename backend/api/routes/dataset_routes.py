from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from io import BytesIO
import pandas as pd

from db.session import get_db

router = APIRouter()


@router.post('/upload')
async def upload(file : UploadFile, db : Session = Depends(get_db)):
  data = await file.read()
  data = pd.read_csv(BytesIO(data))