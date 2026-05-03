import { useEffect, useState } from "react";
import "./App.css";

const actions = [
  "Membresía",
  "BME / Mercado continuo",
  "Wallet",
  "Compras",
  "Criptos",
  "Arte digital",
  "Estrategias conjuntas",
];

export default function App() {
  const [operation, setOperation] = useState(null);
  const [ibexPrice, setIbexPrice] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/user/market-operation/jordi`)
      .then((res) => res.json())
      .then((data) => setOperation(data))
      .catch(() => setOperation(null));
  }, []);

  useEffect(() => {
    function loadPrice() {
      fetch(`${import.meta.env.VITE_API_URL}/market/price/ibex`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.price) {
            setIbexPrice(data.price);
          }
        })
        .catch(() => setIbexPrice(null));
    }

    loadPrice();

    const interval = setInterval(loadPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="topbar">
        <div>
          <p className="eyebrow">WITHINPIVOT PRIVATE ACCESS</p>
          <h1>Panel del inversor</h1>
        </div>

        <div className="user-pill">
          <span className="pulse" />
          Online
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Dashboard usuario</p>
          <h2>Control total de posición, mercado y wallet.</h2>
          <p>
            Una vista privada para seguir estrategias, capital, membresía,
            mercado continuo, activos digitales y operaciones conjuntas.
          </p>
        </div>

        <div className="hero-panel">
          <span>Valor cartera</span>
          <strong>12.480 €</strong>
          <small>+8,4% estimado</small>
        </div>
      </section>

      <section className="metrics">
        <div>
          <span>Disponible</span>
          <strong>3.200 €</strong>
        </div>
        <div>
          <span>Invertido</span>
          <strong>9.280 €</strong>
        </div>
        <div>
          <span>Riesgo</span>
          <strong>Moderado</strong>
        </div>
        <div>
          <span>Estado</span>
          <strong>Activo</strong>
        </div>
      </section>

      <main className="grid">
        <section className="card chart-card">
          <div className="card-head">
            <div>
              <p className="eyebrow">Mercado</p>
              <h3>IBEX / Trading View</h3>
            </div>
            <span className="tag">2 min delay</span>
          </div>

          <div className="chart-box">
            <iframe
              title="TradingView"
              src="https://s.tradingview.com/widgetembed/?symbol=BME%3AIBC&interval=60&theme=dark&style=1&locale=es"
              frameBorder="0"
              scrolling="no"
            />
          </div>
        </section>

        {operation && (
          <section className="card operation-card">
            <div className="card-head">
              <div>
                <p className="eyebrow">Operación activa</p>
                <h3>
                  {operation.instrumento} · {operation.direccion}
                </h3>
              </div>
              <span className="tag active">Activa</span>
            </div>

            <div className="wallet-row">
              <span>Precio actual IBEX</span>
              <strong>{ibexPrice ? ibexPrice : "Cargando..."}</strong>
            </div>

            <div className="wallet-row">
              <span>Pivote superior</span>
              <strong>{operation.pivote_superior}</strong>
            </div>

            <div className="wallet-row">
              <span>Pivote inferior</span>
              <strong>{operation.pivote_inferior}</strong>
            </div>

            <div className="wallet-row">
              <span>Prima MEFF</span>
              <strong>{operation.prima_meff}</strong>
            </div>

            <div className="wallet-row">
              <span>Límite usuario</span>
              <strong>{operation.limite_usuario}</strong>
            </div>

            <div className="wallet-row">
              <span>Umbral de pérdida</span>
              <strong className="negative">{operation.umbral_perdida}</strong>
            </div>

            <StrategyGuide operation={operation} currentPrice={ibexPrice} />
          </section>
        )}

        <section className="card wallet-card">
          <p className="eyebrow">Wallet</p>
          <h3>Balance privado</h3>

          <div className="balance">12.480 €</div>
          <p className="muted">Valor estimado actual</p>

          <div className="wallet-row">
            <span>Cash</span>
            <strong>3.200 €</strong>
          </div>
          <div className="wallet-row">
            <span>Mercado</span>
            <strong>6.740 €</strong>
          </div>
          <div className="wallet-row">
            <span>Digital</span>
            <strong>2.540 €</strong>
          </div>
          <div className="wallet-row">
            <span>Resultado</span>
            <strong className="positive">+8,4%</strong>
          </div>
        </section>

        <section className="actions">
          {actions.map((item, index) => (
            <button key={item}>
              <span className="icon">{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

function StrategyGuide({ operation, currentPrice }) {
  const price = currentPrice || 0;
  const upper = Number(operation.pivote_superior);
  const lower = Number(operation.pivote_inferior);
  const loss = Number(operation.umbral_perdida);

  const insideRange = price <= upper && price >= lower;
  const danger = price > 0 && price <= loss;

  return (
    <div className="strategy-guide">
      <div className="guide-head">
        <span>Guía estratégica</span>
        <strong>
          {!price
            ? "Esperando precio"
            : danger
            ? "Zona de pérdida"
            : insideRange
            ? "Dentro de rango"
            : "Fuera de rango"}
        </strong>
      </div>

      <div
        className={`guide-alert ${
          !price ? "warning" : danger ? "danger" : insideRange ? "ok" : "warning"
        }`}
      >
        <span>Precio actual estimado</span>
        <strong>{price ? price : "Cargando..."}</strong>
      </div>

      <div className="guide-chart">
        <div className="guide-line upper">
          <span>Pivote superior</span>
          <strong>{upper}</strong>
        </div>

        {price > 0 && (
          <div className="guide-price">
            <span>Precio actual</span>
            <strong>{price}</strong>
          </div>
        )}

        <div className="guide-zone">
          <span>Zona de trabajo</span>
        </div>

        <div className="guide-line lower">
          <span>Pivote inferior</span>
          <strong>{lower}</strong>
        </div>

        <div className="guide-line loss">
          <span>Umbral pérdida</span>
          <strong>{loss}</strong>
        </div>
      </div>
    </div>
  );
}