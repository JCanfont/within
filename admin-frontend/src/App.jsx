import { useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import UsersPage from "./components/UsersPage";
import SimulationsPage from "./components/SimulationsPage";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("dashboard");

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  if (screen === "dashboard") {
    return (
      <AdminDashboard
        goTo={setScreen}
        user={user}
        onLogout={() => {
          setUser(null);
          setScreen("dashboard");
        }}
      />
    );
  }

  if (screen === "users") {
    return <UsersPage goBack={() => setScreen("dashboard")} />;
  }

  if (screen === "simulations") {
    return <SimulationsPage goBack={() => setScreen("dashboard")} />;
  }

  return (
    <main style={styles.page}>
      <button style={styles.button} onClick={() => setScreen("dashboard")}>
        ← Volver
      </button>

      <h1 style={styles.title}>{screen}</h1>
      <p style={styles.text}>Pantalla en construcción</p>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050816",
    color: "white",
    padding: "40px",
    fontFamily: "Inter, system-ui, Arial",
  },
  button: {
    background: "rgba(255,255,255,0.1)",
    color: "white",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "30px",
    cursor: "pointer",
  },
  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  text: {
    color: "#a7b0c0",
  },
};