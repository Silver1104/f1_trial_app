

import datetime
from decimal import Decimal
from typing import Optional
from pydantic import EmailStr, Field
from sqlalchemy import TIMESTAMP, Column, text
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    _tablename_ = 'users'
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False)
    email: EmailStr = Field(index=True, nullable=False)
    password: str = Field(index=True, nullable=False)
    created_at: Optional[datetime.datetime] = Field(
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("now()"), nullable=False)
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
