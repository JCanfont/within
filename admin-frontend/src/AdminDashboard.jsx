import { motion } from "framer-motion";
import "./adminDashboard.css";

export default function AdminDashboard({ goTo, user, onLogout }) {
  const kpis = [
    ["Usuarios activos", "42", "+6 esta semana"],
    ["Simulaciones", "128", "23 nuevas"],
    ["Capital monitorizado", "2.48M €", "+12.4%"],
    ["Alertas abiertas", "7", "3 críticas"],
  ];

  const modules = ["MEFF", "BME", "Crypto", "Carteras", "Alertas", "Informes"];

  return (
    <main className="admin-page">
      <div className="admin-glow one"></div>
      <div className="admin-glow two"></div>

      <div className="admin-shell">
        <header className="admin-topbar">
  <div className="admin-logo">
    WithinPivot Admin · {user?.name}
  </div>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <nav className="admin-nav">
      <button onClick={() => goTo("dashboard")}>Dashboard</button>
      <button onClick={() => goTo("users")}>Usuarios</button>
      <button onClick={() => goTo("signals")}>Señales</button>
      <button onClick={() => goTo("simulations")}>Simulaciones</button>
      <button onClick={() => goTo("reports")}>Informes</button>
    </nav>

    <button
      onClick={onLogout}
      style={{
        padding: "10px 14px",
        borderRadius: "999px",
        background: "rgba(255,0,0,0.2)",
        border: "1px solid rgba(255,0,0,0.4)",
        color: "white",
        cursor: "pointer",
      }}
    >
      Salir
    </button>
  </div>
</header>
        
        <motion.section
          className="admin-hero"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="admin-eyebrow">Centro de control</p>
            <h1>Administra la plataforma como un banco privado</h1>
            <p>
              Controla usuarios, módulos, simulaciones, señales, riesgo y estado
              operativo.
            </p>
          </div>

          <div className="admin-status-card">
            <span>Sistema</span>
            <strong>Online</strong>
            <small>Última actualización: hace 2 min</small>
          </div>
        </motion.section>

        <section className="admin-kpi-grid">
          {kpis.map((item, index) => (
            <motion.div
              className="admin-kpi-card"
              key={item[0]}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -8, scale: 1.025 }}
            >
              <span>{item[0]}</span>
              <strong>{item[1]}</strong>
              <small>{item[2]}</small>
            </motion.div>
          ))}
        </section>

        <section className="admin-main-grid">
          <div className="admin-panel large">
            <div className="panel-header">
              <div>
                <span>Actividad global</span>
                <strong>Usuarios y operaciones</strong>
              </div>

              <button type="button" onClick={() => goTo("users")}>
                Ver todo
              </button>
            </div>

            <div className="admin-table">
              <div className="admin-row head">
                <span>Usuario</span>
                <span>Módulo</span>
                <span>Estado</span>
                <span>Riesgo</span>
              </div>

              <div className="admin-row">
                <span>Jordi</span>
                <span>MEFF</span>
                <span className="ok">Activo</span>
                <span>Moderado</span>
              </div>

              <div className="admin-row">
                <span>Laura</span>
                <span>BME</span>
                <span className="ok">Activo</span>
                <span>Bajo</span>
              </div>

              <div className="admin-row">
                <span>Carlos</span>
                <span>Crypto</span>
                <span className="warn">Revisar</span>
                <span>Alto</span>
              </div>
            </div>
          </div>

          <aside className="admin-panel actions">
            <p className="admin-eyebrow">Acciones rápidas</p>

            <button type="button" onClick={() => goTo("users")}>
              Crear usuario
            </button>

            <button type="button" onClick={() => goTo("signals")}>
              Publicar señal
            </button>

            <button type="button" onClick={() => goTo("simulations")}>
              Guardar simulación
            </button>

            <button type="button" onClick={() => goTo("dashboard")}>
              Actualizar módulo
            </button>

            <button type="button" onClick={() => goTo("reports")}>
              Generar informe
            </button>
          </aside>
        </section>

        <section className="admin-modules">
          {modules.map((module, index) => (
            <motion.div
              key={module}
              className="module-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <span>{module}</span>
              <strong>Disponible</strong>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  );
}