import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FILE = os.path.join(BASE_DIR, "data", "wallets.json")


def load_data():
    if not os.path.exists(FILE):
        return {}

    with open(FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data):
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_wallet(username):
    username = username.lower()
    data = load_data()

    if username not in data:
        data[username] = {"balance": 0}
        save_data(data)

    return data[username]


def add_funds(username, amount):
    username = username.lower()
    data = load_data()

    if username not in data:
        data[username] = {"balance": 0}

    data[username]["balance"] = float(data[username]["balance"]) + float(amount)
    save_data(data)