import json
import os
import random

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FILE = os.path.join(BASE_DIR, "data", "wallets.json")

def load_data():
    if not os.path.exists(FILE):
        return {}

    with open(FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def generate_wallet():
    return "0x" + "".join(random.choice("ABCDEF0123456789") for _ in range(32))

def get_wallet(username):
    data = load_data()
    username = username.lower()

    if username not in data:
        data[username] = {
            "address": generate_wallet(),
            "balance": 0
        }
        save_data(data)

    return data[username]

def add_funds(username, amount):
    data = load_data()
    username = username.lower()

    if username not in data:
        data[username] = {
            "address": generate_wallet(),
            "balance": 0
        }

    data[username]["balance"] += amount
    save_data(data)