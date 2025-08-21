

import datetime
from decimal import Decimal
from typing import Optional
from pydantic import EmailStr, Field
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, text
from sqlmodel import SQLModel, Field
from datetime import date

class User(SQLModel, table=True):
    __tablename__ = 'users'
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False)
    email: EmailStr = Field(index=True, nullable=False)
    password: str = Field(index=True, nullable=False)
    created_at: Optional[datetime.datetime] = Field(
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False)
    )

class Current_Drivers(SQLModel, table=True):
    __tablename__ = 'current_drivers'
    id: str = Field(default=None, primary_key=True)
    perm_number: int = Field(index=True, default=None, nullable=False)
    code: str = Field(index=True, default=None, nullable=False)
    full_name: str = Field(index=True, default=None, nullable=False)
    dob: str = Field(index=True, default=None, nullable=False)
    nationality: str = Field(index=True, default=None, nullable=False)
    active: bool = Field(sa_column=Column(Boolean, server_default=text("true"), nullable=False))
    curr_points: int = Field(index=True, default=0, nullable=False)
    curr_pos: int = Field(index=True, default=0, nullable=False)
    curr_team: str = Field(index=True, default=None, nullable=False)

class Current_Constructors(SQLModel, table=True):
    __tablename__ = 'current_constructors'
    id: str = Field(default=None, primary_key=True)
    name: str = Field(index=True, default=None, nullable=False)
    nationality: str = Field(index=True, default=None, nullable=False)
    curr_points: int = Field(index=True, default=0, nullable=False)
    curr_pos: int = Field(index=True, default=0, nullable=False)

class UserDetails(SQLModel, table=True):
    __tablename__ = 'user_details'
    user_id: Optional[int] = Field(
        default=None, foreign_key="users.id", primary_key=True, nullable=False, index=True, ondelete="CASCADE"
    )
    name: str = Field(default=None, nullable=True, index=True)
    dob: date = Field(default=None, nullable=True, index=True)
    fav_driver: str = Field(
        default=None, foreign_key="current_drivers.id", nullable=True, index=True, ondelete="CASCADE"
    )
    fav_constructor: str = Field(
        default=None, foreign_key="current_constructors.id", nullable=True, index=True, ondelete="CASCADE"
    )
    country: str = Field(default=None, index=True, nullable=True)
    prediciton_points: int = Field(
        sa_column=Column(Integer, server_default=text("0"), nullable=False)
    )

class Drivers(SQLModel, table=True):
    _tablename_  = 'driver_details'
    id: int = Field(default=None, primary_key=True)
    driver_name: str = Field(index=True, default=None, nullable=False)
    nationality: str = Field(index=True, default=None, nullable=False)
    seasons: str = Field(index=True, default=None, nullable=False)
    drivers_championships: str = Field(index=True, default=None)
    race_entries: int = Field(index=True, default=0)
    race_starts: int = Field(index=True, default=0)
    pole_positions: int = Field(index=True, default=0)
    race_wins: int = Field(index=True, default=0)
    podiums: int = Field(index=True, default=0)
    fastest_laps: int = Field(index=True, default=0)
    points: Decimal = Field(index=True, default=None)

