import { useEffect, useState } from "react";

export default function AdminDashboard({ username }) {
  const [data, setData] = useState(null);

  const loadAdmin = () => {
    fetch(`http://127.0.0.1:8000/admin-dashboard?username=${username}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  };

  useEffect(() => {
    if (!username) return;
    loadAdmin();
  }, [username]);

  if (!data) {
    return (
      <div style={{ padding: 30, color: "white" }}>
        Cargando control global...
      </div>
    );
  }

  if (!data.success) {
    return (
      <div style={{ padding: 30, color: "white" }}>
        {data.error || "No autorizado"}
      </div>
    );
  }

  const cardStyle = {
    background: "rgba(17, 24, 39, 0.92)",
    borderRadius: 18,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
    color: "white",
  };

  const labelStyle = {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 6,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>
          PANEL ADMINISTRADOR
        </div>
        <h2 style={{ margin: 0 }}>Control global</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Usuarios totales</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{data.total_users}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Saldo agregado</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#22c55e" }}>
            {data.total_balance}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Activos emitidos</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{data.total_assets}</div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ ...labelStyle, marginBottom: 12 }}>Usuarios</div>

        <div style={{ display: "grid", gap: 10 }}>
          {data.users.map((u) => (
            <div
              key={u.username}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 2fr",
                padding: 12,
                borderRadius: 10,
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div>
                <div style={labelStyle}>Usuario</div>
                <div style={{ fontWeight: 700 }}>{u.name}</div>
              </div>

              <div>
                <div style={labelStyle}>Saldo</div>
                <div>{u.balance}</div>
              </div>

              <div>
                <div style={labelStyle}>Activos</div>
                <div>{u.assets}</div>
              </div>

              <div>
                <div style={labelStyle}>Último activo</div>
                <div>{u.last_asset}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ ...labelStyle, marginBottom: 12 }}>Actividad reciente</div>

        {data.recent.length === 0 ? (
          <div style={{ color: "#9ca3af" }}>No hay actividad todavía.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {data.recent.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr 1fr",
                  padding: 12,
                  borderRadius: 10,
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div>
                  <div style={labelStyle}>Usuario</div>
                  <div>{item.username}</div>
                </div>

                <div>
                  <div style={labelStyle}>Activo</div>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                </div>

                <div>
                  <div style={labelStyle}>Valor</div>
                  <div>{item.value}</div>
                </div>

                <div>
                  <div style={labelStyle}>Estado</div>
                  <div>{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}