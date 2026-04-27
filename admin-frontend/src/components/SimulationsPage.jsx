import { useEffect, useState } from "react";
import "./simulationsPage.css";

const API_URL = "http://127.0.0.1:8000";

export default function SimulationsPage({ goBack }) {
  const [form, setForm] = useState({
    owner: "Jordi",
    asset: "IBEX",
    type: "PUT vendida",
    strike: "",
    premium: "",
    expiry: "",
  });

  const [simulations, setSimulations] = useState([]);
  const [status, setStatus] = useState("Cargando simulaciones...");

  useEffect(() => {
    loadSimulations();
  }, []);

  async function loadSimulations() {
    try {
      const response = await fetch(`${API_URL}/simulations`);
      const data = await response.json();

      setSimulations(data);
      setStatus("Conectado al backend");
    } catch (error) {
      console.error(error);
      setStatus("Error conectando con backend");
    }
  }

  function updateForm(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function saveSimulation() {
    if (!form.asset || !form.type || !form.strike) {
      setStatus("Falta activo, tipo o strike");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/simulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Error guardando simulación");
      }

      setStatus("Simulación guardada correctamente");

      setForm({
        owner: "Jordi",
        asset: "IBEX",
        type: "PUT vendida",
        strike: "",
        premium: "",
        expiry: "",
      });

      await loadSimulations();
    } catch (error) {
      console.error(error);
      setStatus("No se pudo guardar la simulación");
    }
  }

  return (
    <main className="sim-page">
      <div className="sim-shell">
        <header className="sim-topbar">
          <button className="sim-back" onClick={goBack}>
            ← Volver
          </button>

          <div className="sim-pill">{status}</div>
        </header>

        <section className="sim-hero">
          <div>
            <p className="sim-eyebrow">Core del administrador</p>
            <h1>Simulaciones de estrategias</h1>
            <p>
              Registra operaciones, strikes, primas y vencimientos. Ahora las
              simulaciones se guardan en el backend.
            </p>
          </div>

          <div className="sim-status">
            <span>Simulaciones guardadas</span>
            <strong>{simulations.length}</strong>
            <small>Backend FastAPI</small>
          </div>
        </section>

        <section className="sim-grid">
          <div className="sim-card">
            <h2>Nueva simulación</h2>

            <label>Propietario</label>
            <input
              value={form.owner}
              onChange={(e) => updateForm("owner", e.target.value)}
            />

            <label>Activo</label>
            <select
              value={form.asset}
              onChange={(e) => updateForm("asset", e.target.value)}
            >
              <option>IBEX</option>
              <option>Mini IBEX</option>
              <option>SAN</option>
              <option>BBVA</option>
              <option>BTC</option>
              <option>ETH</option>
            </select>

            <label>Tipo de operación</label>
            <select
              value={form.type}
              onChange={(e) => updateForm("type", e.target.value)}
            >
              <option>PUT vendida</option>
              <option>CALL vendida</option>
              <option>FUTURO comprado</option>
              <option>FUTURO vendido</option>
              <option>Straddle</option>
              <option>Strangle</option>
            </select>

            <label>Strike / Nivel</label>
            <input
              value={form.strike}
              onChange={(e) => updateForm("strike", e.target.value)}
              placeholder="Ej. 18000"
            />

            <label>Prima</label>
            <input
              value={form.premium}
              onChange={(e) => updateForm("premium", e.target.value)}
              placeholder="Ej. 120"
            />

            <label>Vencimiento</label>
            <input
              type="date"
              value={form.expiry}
              onChange={(e) => updateForm("expiry", e.target.value)}
            />

            <button className="save-sim" onClick={saveSimulation}>
              Guardar simulación
            </button>
          </div>

          <div className="sim-card list">
            <div className="sim-list-header">
              <div>
                <span>Registro</span>
                <strong>Simulaciones guardadas</strong>
              </div>
            </div>

            <div className="sim-list">
              {simulations.length === 0 && (
                <div className="sim-row">
                  <div>
                    <strong>Sin simulaciones</strong>
                    <span>Crea la primera simulación desde el formulario.</span>
                  </div>
                </div>
              )}

              {simulations.map((sim, index) => (
                <div className="sim-row" key={index}>
                  <div>
                    <strong>{sim.asset}</strong>
                    <span>{sim.type}</span>
                  </div>

                  <div>
                    <small>Strike</small>
                    <span>{sim.strike || "-"}</span>
                  </div>

                  <div>
                    <small>Prima</small>
                    <span>{sim.premium || "-"}</span>
                  </div>

                  <div>
                    <small>Vencimiento</small>
                    <span>{sim.expiry || "-"}</span>
                  </div>

                  <div>
                    <small>Propietario</small>
                    <span>{sim.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}