import { useEffect, useState } from "react";

export default function Memberships({ username }) {
  const [items, setItems] = useState([]);

  const loadMemberships = () => {
    fetch(`http://127.0.0.1:8000/memberships?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!username) return;
    loadMemberships();
  }, [username]);

  const cardStyle = {
    background: "rgba(17, 24, 39, 0.92)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 18,
    color: "white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
  };

  const labelStyle = {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 6,
  };

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#facc15", fontSize: 12, fontWeight: 700 }}>
          MÓDULO ACTIVO
        </div>
        <h2 style={{ margin: 0, fontSize: 30 }}>Mis Activos</h2>
      </div>

      {items.length === 0 ? (
        <div style={{ color: "#9ca3af" }}>
          No tienes activos todavía.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => (
            <div key={item.id} style={cardStyle}>
              <div style={labelStyle}>Tipo</div>
              <div style={{ marginBottom: 10 }}>{item.asset_type}</div>

              <div style={labelStyle}>Nombre</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
                {item.name}
              </div>

              <div style={labelStyle}>Valor</div>
              <div style={{ marginBottom: 10 }}>{item.value}</div>

              <div style={labelStyle}>Estado</div>
              <div
                style={{
                  color: item.status === "active" ? "#22c55e" : "#f59e0b",
                  fontWeight: 700,
                }}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}