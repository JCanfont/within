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