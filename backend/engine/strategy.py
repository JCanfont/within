import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STRATEGY_FILE = os.path.join(BASE_DIR, "data", "strategy.json")


def _default_strategy():
    return {
        "underlying": "IBEX35",
        "put_strike": 13000,
        "call_strike": 13500,
        "put_premium": 120,
        "call_premium": 100,
    }


def get_strategy():
    if not os.path.exists(STRATEGY_FILE):
        save_strategy(_default_strategy())

    with open(STRATEGY_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_strategy(strategy: dict):
    with open(STRATEGY_FILE, "w", encoding="utf-8") as f:
        json.dump(strategy, f, indent=2)