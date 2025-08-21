from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List

from app import oauth2
from .. import models, schemas, utils
from app.database import get_session

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_session)):
    finduser = db.exec(select(models.User).where(
        (models.User.email == user.email) |
        (models.User.username == user.username)
    )).first()
    
    if finduser:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail=f"User with email id: {user.email} or username: {user.username} already exists"
        )
    
    hashed_password = utils.Hash.bcrypt(user.password)
    user.password = hashed_password
    
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create user details record
    new_user_details = models.UserDetails(user_id=new_user.id)
    db.add(new_user_details)
    db.commit()
    
    return new_user

@router.get("/{user_id}/details", response_model=schemas.UserDetailsOut)
async def get_user_details(
    user_id: int, 
    db: Session = Depends(get_session),
    current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    # Allow users to access their own details or admin access
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    user_details = db.exec(select(models.UserDetails).where(
        models.UserDetails.user_id == user_id
    )).first()
    
    if not user_details:
        # Create default user details if not exists
        user_details = models.UserDetails(user_id=user_id)
        db.add(user_details)
        db.commit()
        db.refresh(user_details)
    
    return user_details

@router.patch("/details", response_model=schemas.UserDetailsOut)
async def update_user_details(
    update: schemas.UserDetails, 
    db: Session = Depends(get_session), 
    current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    user_details = db.exec(select(models.UserDetails).where(
        models.UserDetails.user_id == current_user.id
    )).first()
    
    if not user_details:
        # Create if doesn't exist
        user_details = models.UserDetails(user_id=current_user.id)
        db.add(user_details)
        db.commit()
        db.refresh(user_details)
    
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user_details, key, value)
    
    db.add(user_details)
    db.commit()
    db.refresh(user_details)
    
    return user_details


@router.post("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_creds: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_session), 
    current_user: schemas.TokenData = Depends(oauth2.get_current_user)
):
    finduser = db.exec(select(models.User).where(
        (models.User.email == user_creds.username) &
        (models.User.id == current_user.id)
    )).first()
    
    if not finduser or not utils.Hash.verify(finduser.password, user_creds.password):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, 
            detail="Incorrect email or password. Cannot delete"
        )
    
    db.delete(finduser)
    db.commit()
