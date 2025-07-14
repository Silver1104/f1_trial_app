from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users
from app.database import get_session
from app.scraper import fetch_and_insert_new_drivers

async def lifespan(app: FastAPI):
    db_gen = get_session()
    db = next(db_gen)
    try:
        fetch_and_insert_new_drivers(db)
        yield
    finally:
        db_gen.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)

@app.get("/")
def root():
    return {f"message": "This starts here"}

app.include_router(
    users.router)
app.include_router(
    auth.router)