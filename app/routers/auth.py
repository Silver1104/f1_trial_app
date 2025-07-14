from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app import models, schemas, utils
from app import oauth2
from app.database import get_session


router = APIRouter(tags=["Authentication"])

@router.post("/login", status_code=status.HTTP_202_ACCEPTED, response_model = schemas.Token)
async def login_user(user_creds: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session)):
    finduser = db.exec(
        select(models.User).where(
            (
                (models.User.username == user_creds.username) |
                (models.User.email == user_creds.username)
            )
        )
    ).first()
    if not finduser or not utils.Hash.verify(finduser.password, user_creds.password):
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Username or password incorrect")
    access_token = oauth2.create_access_token(data = {"user_id": finduser.id})
    response = {"access_token": access_token, "token_type": "bearer"}
    return response
