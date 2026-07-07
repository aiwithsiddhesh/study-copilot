"""FastAPI app entrypoint for the StudyPlanFlow HTTP layer.

Usage:
    uv run uvicorn backend.app:app --reload
"""

import os
import sys

if sys.stdout.encoding.lower() != "utf-8":
    # Windows cp1252 console can't print CrewAI's UTF-8 log output (box-drawing chars, etc.)
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import router

app = FastAPI(title="Adaptive Study Planning System")

# Frontend (Vite dev server, default localhost:5173) is served from a
# different origin than this API — the browser blocks cross-origin fetches
# without this. FRONTEND_ORIGINS lets a deployed frontend's real origin be
# added via env without code changes; the Vite dev origin is always allowed
# so local development works out of the box.
_default_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_extra_origins = [o.strip() for o in os.environ.get("FRONTEND_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_default_origins + _extra_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
