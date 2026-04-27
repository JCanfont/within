import { useState } from "react";

const MARKETS = {
  ibex: { name: "IBEX 35", symbol: "CAPITALCOM:SP35", interval: "60" },
  sp500: { name: "S&P 500", symbol: "OANDA:SPX500USD", interval: "60" },
  nasdaq: { name: "Nasdaq 100", symbol: "OANDA:NAS100USD", interval: "60" },
  dax: { name: "DAX 40", symbol: "CAPITALCOM:DE40", interval: "60" },
  eurostoxx: { name: "EuroStoxx 50", symbol: "EUREX:FESX1!", interval: "D" },
};

export default function BME() {
  const [marketKey, setMarketKey] = useState("ibex");
  const market = MARKETS[marketKey];

  return (
    <div
      style={{
        padding: 28,
        maxWidth: 1280,
        margin: "0 auto",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ color: "#facc15", fontSize: 12, fontWeight: 800 }}>
          MERCADO
        </div>
        <h2 style={{ margin: 0, fontSize: 30 }}>BME / Mercado</h2>
      </div>

      {/* SELECTOR */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.92)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>
          Selecciona mercado
        </div>

        <select
          value={marketKey}
          onChange={(e) => setMarketKey(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0f172a",
            color: "white",
            fontWeight: 700,
          }}
        >
          {Object.keys(MARKETS).map((k) => (
            <option key={k} value={k}>
              {MARKETS[k].name}
            </option>
          ))}
        </select>
      </div>

      {/* GRAFICO */}
      <div
        style={{
          background: "rgba(17, 24, 39, 0.92)",
          borderRadius: 18,
          padding: 20,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ color: "#9ca3af", fontSize: 12 }}>
              Gráfico técnico
            </div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {market.name}
            </div>
          </div>

          <div
            style={{
              background: "rgba(250,204,21,0.12)",
              color: "#facc15",
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            TradingView
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 520,
            borderRadius: 16,
            overflow: "hidden",
            background: "#020617",
          }}
        >
          <iframe
            key={market.symbol}
            src={`https://s.tradingview.com/widgetembed/?symbol=${market.symbol}&interval=${market.interval}&theme=dark&style=1&timezone=Europe/Madrid&locale=es`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="TradingView Chart"
          />
        </div>
      </div>
    </div>
  );
}
