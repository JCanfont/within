import { useState } from "react";
import "./login.css";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");

  return (
    <main className="login-page">
      <div className="login-card">
        <h1>WithinPivot</h1>
        <p>Acceso administrativo</p>

        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={() => {
            if (name) onLogin({ name });
          }}
        >
          Entrar
        </button>
      </div>
    </main>
  );
}