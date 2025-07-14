
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app import oauth2

from .. import models, schemas, utils
from app.database import get_session


router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_session)):
    finduser = db.exec(select(models.User).filter(models.User.email == user.email)).first()
    if finduser:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"User with email id: {user.email} already exists")
    hashed_password = utils.Hash.bcrypt(user.password)
    user.password = hashed_password
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_creds: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session), current_user: int = Depends(oauth2.get_current_user)):
    finduser = db.exec(select(models.User).where(
        (models.User.email == user_creds.username) &
        (models.User.id == current_user.id)
        )).first()
    if not finduser or not utils.Hash.verify(finduser.password,user_creds.password):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Incorrect email or password. Cannot delete")
    db.delete(finduser)
    db.commit()

