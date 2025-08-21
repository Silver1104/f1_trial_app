from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app import oauth2

from .. import models, schemas, utils
from app.database import get_session


router = APIRouter(prefix="/constructors", tags=["Drivers"])

@router.get("/standings", response_model=List[schemas.CurrentConstructorOut])
async def get_constructor_standings(db: Session = Depends(get_session)):
    constructors = db.exec(select(models.Current_Constructors).order_by(
        models.Current_Constructors.curr_pos
    )).all()
    return constructors