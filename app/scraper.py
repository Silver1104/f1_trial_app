from decimal import Decimal
from fastapi import Depends
from pydantic import constr
import requests
from sqlmodel import Session, select
import pandas as pd
import re
from app.database import get_session
import app.models as models

# from app.database import get_session
current = 2025
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

def fetch_current_season_drivers(db: Session = Depends(get_session)):
    url = f"https://api.jolpi.ca/ergast/f1/{current}/driverstandings"
    res = requests.get(url)
    current_season_drivers = res.json()["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]
    existing_drivers = {driver.id: driver for driver in db.exec(select(models.Current_Drivers)).all()}
    current_season_drivers_id = set()
    for driver_stats in current_season_drivers:
        position = driver_stats["position"]
        points = driver_stats["points"]
        d = driver_stats["Driver"]
        driver_id = d["driverId"]
        current_season_drivers_id.add(driver_id)
        full_name = f"{d['givenName']} {d['familyName']}"
        perm_number = d["permanentNumber"]
        code = d["code"]
        dob = d["dateOfBirth"]
        nationality = d["nationality"]
        constructor = driver_stats["Constructors"][-1]['name']
        if driver_id in existing_drivers:
            driver = existing_drivers[driver_id]
            driver.active = True
            if driver.curr_team != constructor or driver.full_name != full_name or driver.code != code or driver.perm_number != perm_number or driver.curr_points != points or driver.curr_pos != position:
                driver.full_name = full_name
                driver.code = code
                driver.curr_points = points
                driver.curr_pos = position
                driver.perm_number = perm_number
                driver.curr_team = constructor
                db.add(driver)
        else:
            driver = models.Current_Drivers(
                id=driver_id,
                perm_number=perm_number,
                code=code,
                full_name = full_name,
                dob = dob,
                nationality=nationality,
                curr_points=points,
                curr_pos=position,
                curr_team=constructor
            )
            db.add(driver)

    for driver in existing_drivers.values():
        if driver.id not in current_season_drivers_id and driver.active:
            driver.active = False
            db.add(driver)
        
    db.commit()

def fetch_current_season_constructors(db: Session = Depends(get_session)):
    url = f"https://api.jolpi.ca/ergast/f1/{current}/constructorstandings"
    res = requests.get(url)
    current_season_constructors = res.json()["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]
    existing_constructors = {constructor.id: constructor for constructor in db.exec(select(models.Current_Constructors)).all()}
    current_season_constructors_id = set()
    for constructor_stats in current_season_constructors:
        position = constructor_stats["position"]
        points = constructor_stats["points"]
        d = constructor_stats["Constructor"]
        constructor_id = d["constructorId"]
        current_season_constructors_id.add(constructor_id)
        name = d["name"]
        nationality = d["nationality"]
        if constructor_id in existing_constructors:
            constructor = existing_constructors[constructor_id]
            if constructor.curr_points != points or constructor.curr_pos != position:
                constructor.curr_points = points
                constructor.curr_pos = position
                db.add(constructor)
        else:
            constructor = models.Current_Constructors(
                id=constructor_id,
                name=name,
                nationality=nationality,
                curr_points=points,
                curr_pos=position,
            )
            db.add(constructor)
        
    db.commit()