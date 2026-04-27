import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API = "http://127.0.0.1:8000";

export default function Dashboard({ username, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [positions, setPositions] = useState([]);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/user-detail?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setProfile(d));

    fetch(`${API}/admin/user-positions?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setPositions(d.positions || []));

    fetch(`${API}/admin/risk-status?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setRisk(d));
  }, [username]);

  if (!profile) return <div style={{ padding: 40 }}>Cargando...</div>;

  return (
    <motion.div
      style={bg}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div style={glow1} />
      <div style={glow2} />

      {/* HEADER */}
      <motion.div
        style={header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <div style={brand}>WITHINPIVOT</div>
          <div style={user}>{profile.profile?.name}</div>
        </div>

        <button style={btn} onClick={onLogout}>
          Salir
        </button>
      </motion.div>

      {/* BALANCE */}
      <motion.div style={card} whileHover={{ scale: 1.02 }}>
        <div style={label}>Balance</div>
        <div style={balance}>
          {Number(profile.balance).toLocaleString()} €
        </div>
      </motion.div>

      {/* RIESGO */}
      <motion.div style={card} whileHover={{ scale: 1.02 }}>
        <div style={label}>Riesgo</div>

        <div style={{
          ...riskText,
          color:
            risk?.status === "OK"
              ? "#22c55e"
              : risk?.status === "WARNING"
              ? "#facc15"
              : "#ef4444"
        }}>
          {risk?.status}
        </div>

        <div style={sub}>Exposición: {risk?.exposure} €</div>
        <div style={sub}>Drawdown: {risk?.drawdown}%</div>
      </motion.div>

      {/* POSICIONES */}
      <motion.div style={card}>
        <div style={title}>Posiciones</div>

        {positions.map((p, i) => (
          <motion.div
            key={p.id}
            style={row}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div>
              <div style={rowTitle}>{p.name}</div>
              <div style={rowSub}>{p.market}</div>
            </div>

            <div style={value}>
              {Number(p.current_value).toLocaleString()} €
            </div>

            <div style={{
              color: p.profit >= 0 ? "#22c55e" : "#ef4444",
              fontWeight: "bold"
            }}>
              {p.profit} €
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* 🎨 ESTILOS */

const bg = {
  minHeight: "100vh",
  background: `
    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.15), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(250,204,21,0.12), transparent 40%),
    linear-gradient(180deg, #020617 0%, #020617 40%, #000 100%)
  `,
  color: "white",
  padding: 30,
  fontFamily: "system-ui"
};

const glow1 = {
  position: "fixed",
  width: 300,
  height: 300,
  borderRadius: "50%",
  background: "rgba(250,204,21,0.15)",
  filter: "blur(100px)",
  top: -100,
  left: -100
};

const glow2 = {
  position: "fixed",
  width: 350,
  height: 350,
  borderRadius: "50%",
  background: "rgba(59,130,246,0.15)",
  filter: "blur(100px)",
  bottom: -120,
  right: -120
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20
};

const brand = {
  color: "#facc15",
  fontWeight: "bold",
  letterSpacing: "2px"
};

const user = {
  fontSize: 20,
  fontWeight: "bold"
};

const card = {
  background: "rgba(15,23,42,0.7)",
  padding: 20,
  borderRadius: 20,
  marginBottom: 20,
  backdropFilter: "blur(10px)"
};

const label = {
  color: "#94a3b8"
};

const balance = {
  fontSize: 34,
  fontWeight: "bold",
  color: "#facc15"
};

const riskText = {
  fontSize: 20,
  fontWeight: "bold"
};

const sub = {
  color: "#94a3b8",
  marginTop: 5
};

const title = {
  fontWeight: "bold",
  marginBottom: 10
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10
};

const rowTitle = {
  fontWeight: "bold"
};

const rowSub = {
  fontSize: 12,
  color: "#94a3b8"
};

const value = {
  fontWeight: "bold"
};

const btn = {
  background: "#facc15",
  color: "black",
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer"
};