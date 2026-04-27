import { useState } from "react";
import "./loginPage.css";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@withinpivot.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  function handleLogin() {
    if (email === "admin@withinpivot.com" && password === "1234") {
      onLogin({
        name: "Administrador",
        role: "admin",
        email,
      });
      return;
    }

    setError("Credenciales incorrectas");
  }

  return (
    <main className="login-page">
      <div className="login-glow one"></div>
      <div className="login-glow two"></div>

      <section className="login-card">
        <p className="login-eyebrow">WithinPivot Admin</p>

        <h1>Acceso privado</h1>

        <p className="login-subtitle">
          Entra al panel de administración para gestionar usuarios, simulaciones
          y señales.
        </p>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button onClick={handleLogin}>Entrar</button>

        <small>
          Demo: admin@withinpivot.com / 1234
        </small>
      </section>
    </main>
  );
}