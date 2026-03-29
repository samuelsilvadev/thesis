from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import ALLOW_ORIGIN, HSTS_ENABLED
from .database import Base, engine
from .routers import auth_router, notes_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CSR Thesis App - API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOW_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:5173 http://localhost:8000; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    if HSTS_ENABLED:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.include_router(auth_router.router)
app.include_router(notes_router.router)
