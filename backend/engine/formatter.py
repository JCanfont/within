def format_forecast(levels: dict):
    risk_up = levels["risk_up"]
    risk_down = levels["risk_down"]

    return (
        f"A partir de {risk_up:.0f} por subida o de {risk_down:.0f} por bajada, "
        f"la estrategia comenzará a entrar en pérdidas."
    )