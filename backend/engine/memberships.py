import json
import os
import time

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FILE = os.path.join(BASE_DIR, "data", "memberships.json")


def load_data():
    if not os.path.exists(FILE):
        return {}

    with open(FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_data(data):
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_user_memberships(username):
    data = load_data()
    return data.get(username.lower(), [])


def get_all_memberships():
    return load_data()


def add_membership(username, asset_type, name, value, status="active"):
    username = username.lower()
    data = load_data()

    if username not in data:
        data[username] = []

    new_item = {
        "id": int(time.time() * 1000),
        "asset_type": asset_type,
        "name": name,
        "value": value,
        "status": status,
    }

    data[username].append(new_item)
    save_data(data)


def change_status(username, membership_id, new_status):
    username = username.lower()
    data = load_data()

    for item in data.get(username, []):
        if item["id"] == membership_id:
            item["status"] = new_status
            break

    save_data(data)