import json

def get_candles():
    with open("data/ibex.json", "r") as f:
        return json.load(f)