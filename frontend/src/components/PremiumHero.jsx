import { motion } from "framer-motion";
import "./premium.css";

export default function PremiumHero({ onStart }) {
  return (
    <div className="hero-container">
      <div className="hero-bg"></div>

      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          WithinPivot
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hero-subtitle"
        >
          Plataforma privada para visualizar capital, estrategias y riesgo.
        </motion.p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={onStart}>
            Empezar
          </button>

          <button className="btn-secondary" onClick={onStart}>
            Ver demo
          </button>
        </div>
      </div>

      <motion.div
        className="hero-mockup"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mockup-card">
          <div className="mockup-chart"></div>
          <div className="mockup-stats">
            <div>+12.4%</div>
            <div>Portfolio</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}