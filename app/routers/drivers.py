
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app import oauth2

from .. import models, schemas, utils
from app.database import get_session


router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/standings", response_model=List[schemas.CurrentDriverOut])
async def get_driver_standings(db: Session = Depends(get_session)):
    drivers = db.exec(select(models.Current_Drivers).where(
        models.Current_Drivers.active == True
    ).order_by(models.Current_Drivers.curr_pos)).all()
    return drivers