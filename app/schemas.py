from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    id: Optional[int] = None

class UserDetails(BaseModel):
    name: Optional[str] = None
    dob: Optional[date] = None
    fav_driver: Optional[str] = None
    fav_constructor: Optional[str] = None
    country: Optional[str] = None

class UserDetailsOut(UserDetails):
    user_id: int
    model_config = {
        "from_attributes": True
    }

class CurrentDriverOut(BaseModel):
    id: str
    perm_number: int
    code: str
    full_name: str
    dob: str
    nationality: str
    active: bool
    curr_points: int
    curr_pos: int
    curr_team: str
    model_config = {
        "from_attributes": True
    }

class CurrentConstructorOut(BaseModel):
    id: str
    name: str
    nationality: str
    curr_points: int
    curr_pos: int
    model_config = {
        "from_attributes": True
    }