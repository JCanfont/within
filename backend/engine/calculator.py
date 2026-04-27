def calculate_levels(strategy: dict):
    put_strike = strategy["put_strike"]
    call_strike = strategy["call_strike"]
    put_premium = strategy["put_premium"]
    call_premium = strategy["call_premium"]

    total_premium = put_premium + call_premium
    pivot = (put_strike + call_strike) / 2
    risk_up = call_strike + total_premium
    risk_down = put_strike - total_premium

    return {
        "pivot": pivot,
        "risk_up": risk_up,
        "risk_down": risk_down
    }