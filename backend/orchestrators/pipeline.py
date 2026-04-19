import pandas as pd
from sqlalchemy.orm import Session
import uuid

from models.processed_data_model import ProcessedData
from models.dataset_model import Datasets

from engines.data_engine import DataEngine

def run_dataset_pipeline(dataset_id : uuid.UUID,df : pd.DataFrame, db : Session):

  processed = DataEngine().preprocess(df)
  
  records = processed.assign(dataset_id=dataset_id)[['dataset_id', 'ds', 'y']].to_dict('records')
  db.bulk_insert_mappings(ProcessedData, records)

  db.query(Datasets).filter(Datasets.id == dataset_id).update({
    "length": len(processed)
  })

  db.commit()