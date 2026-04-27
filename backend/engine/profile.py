import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROFILE_FILE = os.path.join(BASE_DIR, "data", "profile.json")


def _default_profile():
    return {
        "name": "Jordi",
        "membership": "Active Access",
        "balance": "84.500 €",
        "ytd_profit": "+7.820 €",
        "open_operations": 2
    }


def get_profile():
    if not os.path.exists(PROFILE_FILE):
        save_profile(_default_profile())

    with open(PROFILE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_profile(profile: dict):
    with open(PROFILE_FILE, "w", encoding="utf-8") as f:
        json.dump(profile, f, indent=2)