from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app import models, schemas, utils
from app import oauth2
from app.database import get_session

router = APIRouter(tags=["Authentication"])

@router.post("/login", status_code=status.HTTP_202_ACCEPTED, response_model=schemas.LoginResponse)
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
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Username/Email or password incorrect")
    
    access_token = oauth2.create_access_token(data={"user_id": finduser.id})
    
    # Return both token and user data
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": finduser.id,
            "username": finduser.username,
            "email": finduser.email,
            "created_at": finduser.created_at
        }
    }

@router.get("/me", response_model=schemas.UserOut)
async def get_current_user_info(current_user: schemas.TokenData = Depends(oauth2.get_current_user), db: Session = Depends(get_session)):
    user = db.exec(select(models.User).where(models.User.id == current_user.id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/logout", status_code=status.HTTP_205_RESET_CONTENT)
async def logout_user(request: Request, current_user: schemas.TokenData = Depends(oauth2.get_current_user)):
    try:
        token = oauth2.get_token_from_request(request)
        if oauth2.blacklist_token(token):
            return {
                "message": "Token has been invalidated",
                "current_user": current_user.id
            }
        else:
            return {
                "message": "Token is already invalidated or expired",
                "current_user": current_user.id
            }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )

@router.get("/health/redis")
async def redis_health():
    """Check Redis connection health"""
    try:
        oauth2.redis_client.ping()
        return {"status": "healthy", "redis": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Redis connection failed"
        )
