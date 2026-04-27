import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SIGNAL_FILE = os.path.join(BASE_DIR, "data", "signal.json")


def _default_signal():
    return {
        "pivot": 13250,
        "status": "Seguimiento activo",
        "forecast_text": "Pivote central en vigilancia.",
        "comment": "Señal manual introducida desde backend."
    }


def get_signal():
    if not os.path.exists(SIGNAL_FILE):
        save_signal(_default_signal())

    with open(SIGNAL_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_signal(signal: dict):
    with open(SIGNAL_FILE, "w", encoding="utf-8") as f:
        json.dump(signal, f, indent=2)