from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from urllib.request import urlopen
import csv
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

operations = []


class MarketOperation(BaseModel):
    pivote_superior: float
    pivote_inferior: float
    instrumento: str
    direccion: str
    prima_meff: str
    limite_usuario: str
    umbral_perdida: float
    usuarios: List[str]


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/admin/market-operation")
def create_operation(op: MarketOperation):
    operations.append(op)
    return {
        "status": "ok",
        "message": "Operación guardada",
        "total": len(operations),
        "operation": op,
    }


@app.get("/user/market-operation/{user_id}")
def get_user_operation(user_id: str):
    for op in reversed(operations):
        normalized_users = [u.lower() for u in op.usuarios]

        if user_id.lower() in normalized_users:
            return op

    return None


@app.get("/market/price/ibex")
def get_ibex_price():
    try:
        url = "https://stooq.com/q/l/?s=^ibex&f=sd2t2ohlcv&h&e=csv"
        response = urlopen(url, timeout=8).read().decode("utf-8")

        reader = csv.DictReader(io.StringIO(response))
        row = next(reader)

        close_price = float(row["Close"])

        return {
            "symbol": "IBEX",
            "price": close_price,
            "date": row.get("Date"),
            "time": row.get("Time"),
            "source": "stooq",
            "delay": "delayed",
            "status": "ok",
        }

    except Exception as e:
        return {
            "symbol": "IBEX",
            "price": None,
            "status": "error",
            "message": str(e),
        }