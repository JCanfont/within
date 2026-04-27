import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FILE = os.path.join(BASE_DIR, "data", "users.json")


def load_users():
    if not os.path.exists(FILE):
        return {}

    with open(FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_user(username):
    users = load_users()
    return users.get(username.lower())


def get_all_users():
    return load_users()