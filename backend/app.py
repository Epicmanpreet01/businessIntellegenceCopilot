from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from core.config import settings
from db.base import Base, engine

from api.routes.auth_routes import router as auth_router
from api.routes.dataset_routes import router as datasets_router
from api.routes.analytics_routes import router as analytics_router
from api.routes.chat_routes import router as chats_router

from core.exceptions import AppException

app = FastAPI()
Base.metadata.create_all(bind=engine)


@app.get('/health')
def health():
  return {'success': True, 'message': 'Server reached successfully'}

app.include_router(auth_router, prefix='/api/auth')
app.include_router(datasets_router, prefix='/api/datasets')
app.include_router(analytics_router,prefix='/api/analytics')
app.include_router(chats_router, prefix='/api/chats')

# Production: Serve Frontend
if os.path.exists(settings.STATIC_DIR):
    # Serve static assets (js, css, images)
    app.mount("/assets", StaticFiles(directory=os.path.join(settings.STATIC_DIR, "assets")), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Prevent intercepting API routes
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
            
        file_path = os.path.join(settings.STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(settings.STATIC_DIR, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "Backend is running, but frontend build was not found. Please run 'npm run build' in the frontend directory."}

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