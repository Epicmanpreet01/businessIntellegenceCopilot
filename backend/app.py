from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

from core.config import settings
from db.base import Base, engine

from api.routes.auth_routes import router as auth_router

from core.exceptions import AppException

from schemas.common import APIResponse

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.get('/health')
def health():
  return {'success': True, 'message': 'Server reached successfully'}

app.include_router(auth_router, prefix='/api/auth')

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