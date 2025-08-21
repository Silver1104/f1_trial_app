from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import redis
import redis
from app import schemas
from app.config import settings 
import os

redis_client = redis.Redis(
    host=settings.redis_host,
    port=int(settings.redis_port),
    db=int(settings.redis_db),
    decode_responses=True
)

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict):
    to_encode = data.copy()
    exp = datetime.utcnow() + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": exp})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

def is_blacklisted(token: str)->bool:
    try:
        return redis_client.exists(f"blacklist:{token}") == 1
    except:
        return False

def blacklist_token(token: str):
    """Add token to Redis blacklist with expiration matching token expiry"""
    try:
        # Get token expiration time
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        
        if exp:
            # Calculate remaining seconds until expiration
            exp_datetime = datetime.fromtimestamp(exp)
            now = datetime.utcnow()
            remaining_seconds = int((exp_datetime - now).total_seconds())
            
            if remaining_seconds > 0:
                redis_key = f"blacklist:{token}"
                redis_client.setex(redis_key, remaining_seconds, "blacklisted")
                return True
        return False
    except Exception:
        return False

def verify_access_token(token: str, credentials_exception):
    try:
        if is_blacklisted(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been invalidated",
                headers={"WWW-Authenticate": "Bearer"}
            )
        decoded_jwt = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = decoded_jwt.get("user_id")
        if not id:
            raise credentials_exception
        token_data = schemas.TokenData(id=id)
        return token_data
    except JWTError as e:
        raise credentials_exception from e
    
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return verify_access_token(token, credentials_exception)
    
def get_token_from_request(request: Request) -> str:
    """Extract JWT token from Authorization header"""
    authorization = request.headers.get("Authorization")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid"
        )
    return authorization.split(" ")[1]