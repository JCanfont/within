from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

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