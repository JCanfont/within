from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import json
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
SIMULATIONS_FILE = BASE_DIR / "simulations.json"


class Simulation(BaseModel):
    owner: str
    asset: str
    type: str
    strike: str = ""
    premium: str = ""
    expiry: str = ""


def load_simulations() -> List[dict]:
    if not SIMULATIONS_FILE.exists():
        return []

    try:
        with open(SIMULATIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_simulations(simulations: List[dict]):
    with open(SIMULATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(simulations, f, ensure_ascii=False, indent=2)


@app.get("/")
def root():
    return {"status": "ok", "message": "WithinPivot backend running"}


@app.get("/simulations")
def get_simulations():
    return load_simulations()


@app.post("/simulations")
def create_simulation(simulation: Simulation):
    simulations = load_simulations()
    simulations.insert(0, simulation.model_dump())
    save_simulations(simulations)
    return {
        "status": "saved",
        "simulation": simulation.model_dump(),
        "total": len(simulations),
    }