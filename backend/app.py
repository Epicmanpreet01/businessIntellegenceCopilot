from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

from core.config import settings
from db.base import Base, engine

from api.routes.auth_routes import router as auth_router
from api.routes.dataset_routes import router as pipeline_router

from core.exceptions import AppException

from models.dataset_model import Datasets
from models.analytics_model import Analytics
from models.forecast_model import Forecasts
from models.insights_model import Insights
from models.processed_data_model import ProcessedData
from models.user_model import Users

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.get('/health')
def health():
  return {'success': True, 'message': 'Server reached successfully'}

app.include_router(auth_router, prefix='/api/auth')
app.include_router(pipeline_router, prefix='/api/datasets')

@app.exception_handler(AppException)
def app_exception_handler(request : Request, exc : AppException):
  return JSONResponse(
    status_code=exc.status_code,
    content={
      'success' : False,
      'error' : exc.message,
      'data' : None
    }
  )

@app.exception_handler(Exception)
def global_exception_handler(request : Request, exc : Exception):
  return JSONResponse(
    status_code=500,
    content={
      'success' : False,
      'error' : str(exc),
      'data' : None
    }
  )

if __name__ == '__main__':
  uvicorn.run(app, host=settings.HOST, port=settings.PORT)