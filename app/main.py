from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, drivers, constructors
from app.database import get_session
from app.scraper import fetch_and_insert_new_drivers, fetch_current_season_constructors, fetch_current_season_drivers

async def lifespan(app: FastAPI):
    db_gen = get_session()
    db = next(db_gen)
    try:
        # Initialize F1 data
        fetch_current_season_drivers(db)
        fetch_current_season_constructors(db)
        yield
    finally:
        db_gen.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "F1 Platform API is running"}

app.include_router(
    users.router)
app.include_router(
    auth.router)
app.include_router(
    drivers.router)
app.include_router(
    constructors.router)