import { useState } from "react";

const API = "http://127.0.0.1:8000";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("jordi");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Login incorrecto");
      return;
    }

    localStorage.setItem("admin_token", data.token);
    onLogin();
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ color: "#facc15", fontSize: 12, fontWeight: 800 }}>
          ADMIN PLATFORM
        </div>

        <h2>Acceso administrador</h2>

        <input
          value={username}
          placeholder="Usuario"
          onChange={(e) => setUsername(e.target.value)}
          style={input}
        />

        <input
          value={password}
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") login();
          }}
          style={input}
        />

        <button onClick={login} style={button}>
          Entrar
        </button>

        {error && <div style={{ color: "#f87171", marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at top, #111827 0%, #0b0f1a 45%, #060913 100%)",
};

const card = {
  width: "100%",
  maxWidth: 420,
  background: "rgba(17, 24, 39, 0.92)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 36,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#0b0f1a",
  color: "white",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  background: "#facc15",
  color: "#000",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
};