from __future__ import annotations

from collections.abc import Callable
from contextlib import asynccontextmanager
from time import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.db import Base, SessionLocal, engine
from app.routers import auth, catalog, learning, platform
from app.seed import seed_if_empty

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="AI LearnOS API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.cors_origins == "*" else settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_hits: dict[str, list[float]] = {}


@app.middleware("http")
async def rate_limit(request: Request, call_next: Callable):
    if request.url.path.startswith("/v1/ai"):
        ip = request.client.host if request.client else "anon"
        now = time()
        window = [t for t in _hits.get(ip, []) if now - t < 60]
        if len(window) >= 60:
            return JSONResponse({"detail": "Too many AI requests"}, status_code=429)
        window.append(now)
        _hits[ip] = window
    return await call_next(request)


@app.get("/health")
def health():
    return {"ok": True, "service": "ai-learnos", "llm": settings.llm_provider}


app.include_router(auth.router, prefix="/v1")
app.include_router(catalog.router, prefix="/v1")
app.include_router(learning.router, prefix="/v1")
app.include_router(platform.router, prefix="/v1")
