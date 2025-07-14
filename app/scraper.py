from decimal import Decimal
from fastapi import Depends
from sqlmodel import Session, select
import pandas as pd
import re
from app.database import get_session
import app.models as models

# from app.database import get_session

WEB_URL = "https://en.wikipedia.org/wiki/List_of_Formula_One_drivers"

def fetch_and_insert_new_drivers(db: Session = Depends(get_session)):
    tables = pd.read_html(WEB_URL)
    df = tables[2]
    df.columns = df.columns.str.strip()
    rename_map = {
        "Driver name": "driver_name",
        "Nationality": "nationality",
        "Seasons competed": "seasons",
        "Drivers' Championships": "drivers_championships",
        "Race entries": "race_entries",
        "Race starts": "race_starts",
        "Pole positions": "pole_positions",
        "Race wins": "race_wins",
        "Podiums": "podiums",
        "Fastest laps": "fastest_laps",
        "Points[a]": "points"
    }
    
    df.rename(columns=rename_map, inplace=True)

    remove_alphabets = [
        "race_entries", "race_starts", "pole_positions",
        "race_wins", "podiums", "fastest_laps"
    ]

    for field in remove_alphabets:
        df[field] = df[field].astype(str).str.replace(r'[^0-9]', '', regex=True).replace('', '0')

    numeric_fields = [
        "race_entries", "race_starts", "pole_positions",
        "race_wins", "podiums", "fastest_laps"
    ]
    for field in numeric_fields:
        df[field] = df[field].astype(str).str.replace(",", "").astype(int)
    def parse_decimal(value):
        try:
            return Decimal(str(value).replace(",", "").strip())
        except:
            return Decimal(0)
    df["points"] = df["points"].apply(parse_decimal)
    
    def clean_name(name):
        name = str(name).strip()
        name = re.sub(r"[^ \-\wÀ-ÖØ-öø-ÿĀ-žḀ-ỿ]", "", name, flags=re.UNICODE)
        return name

# Apply
    df["driver_name"] = df["driver_name"].apply(clean_name)

    new_entries = 0
    for _, row in df.iterrows():
        driver = row["driver_name"]
        seas = row["seasons"]
        points = row["points"]
        find_driver = db.exec(select(models.Drivers).where(
            (
                (models.Drivers.driver_name == driver) &
                (models.Drivers.seasons == seas) &
                (models.Drivers.points == points)
            )
        )).first()
        if not find_driver:
            db.add(models.Drivers(
                driver_name = row["driver_name"],
                nationality = row["nationality"],
                seasons = row["seasons"],
                drivers_championships = row["drivers_championships"],
                race_entries = row["race_entries"],
                race_starts = row["race_starts"],
                pole_positions = row["pole_positions"],
                race_wins = row["race_wins"],
                podiums = row["podiums"],
                fastest_laps = row["fastest_laps"],
                points = row["points"]
            ))
            new_entries += 1

    db.commit()
    print("New rows: ", new_entries)