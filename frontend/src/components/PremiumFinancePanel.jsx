import { motion } from "framer-motion";
import "./premiumFinancePanel.css";
import TradingViewChart from "./TradingViewChart";

export default function PremiumFinancePanel({
  activeModule = "Resumen",
  onBack,
  onOpenModule,
}) {
  const moduleText = {
    Resumen: "Panel general de capital, riesgo y evolución de cartera.",
    MEFF: "Derivados: futuros, puts, calls, coberturas y margen.",
    BME: "Acciones: mercado continuo, posiciones, señales y liquidez.",
    Crypto: "Activos digitales, volatilidad, wallet y liquidez.",
  };

  return (
    <main className="finance-page">
      <div className="finance-shell">
        <header className="finance-topbar">
          <button className="back-button" onClick={onBack}>
            ← Volver
          </button>

          <div className="brand-pill">WithinPivot Private</div>
        </header>

        <section className="finance-hero">
          <div>
            <p className="eyebrow">Módulo activo</p>
            <h1>{activeModule}</h1>
            <p className="finance-description">{moduleText[activeModule]}</p>
          </div>

          <div className="module-buttons">
            <button onClick={() => onOpenModule("MEFF")}>MEFF</button>
            <button onClick={() => onOpenModule("BME")}>BME</button>
            <button onClick={() => onOpenModule("Crypto")}>Crypto</button>
          </div>
        </section>

        <section className="alert-row">
          <motion.div className="alert-card primary-alert" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            Señal activa en {activeModule}
          </motion.div>

          <motion.div className="alert-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            Actualizado hace 2 min
          </motion.div>

          <motion.div className="alert-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            Riesgo bajo control
          </motion.div>
        </section>

        <section className="kpi-grid">
          <motion.div className="kpi-card" whileHover={{ y: -6 }}>
            <span>Capital</span>
            <strong>248.500 €</strong>
            <small>+8.4%</small>
          </motion.div>

          <motion.div className="kpi-card" whileHover={{ y: -6 }}>
            <span>Rentabilidad</span>
            <strong>+12%</strong>
            <small>Mes actual</small>
          </motion.div>

          <motion.div className="kpi-card" whileHover={{ y: -6 }}>
            <span>Riesgo</span>
            <strong>Moderado</strong>
            <small>Controlado</small>
          </motion.div>

          <motion.div className="kpi-card" whileHover={{ y: -6 }}>
            <span>Estrategias</span>
            <strong>7</strong>
            <small>3 cubiertas</small>
          </motion.div>
        </section>

        <section className="dashboard-grid">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <span>Vista operativa</span>
                <strong>{activeModule} / Evolución simulada</strong>
              </div>

              <button className="detail-button">Ver detalle</button>
            </div>

         <div className="real-chart-wrap">
              <TradingViewChart symbol="BME:SAN" />
         </div>
          </div>

          <aside className="side-card">
            <p className="eyebrow">Acciones rápidas</p>

            <button>Crear simulación</button>
            <button>Guardar escenario</button>
            <button>Revisar cobertura</button>
            <button>Enviar informe</button>
          </aside>
        </section>
      </div>
    </main>
  );
}