import { useState } from "react";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

export default function AdminApp() {
  const [logged, setLogged] = useState(
    localStorage.getItem("admin_token") ? true : false
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111827 0%, #0b0f1a 45%, #060913 100%)",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {!logged ? (
        <AdminLogin onLogin={() => setLogged(true)} />
      ) : (
        <AdminDashboard
          onLogout={() => {
            localStorage.removeItem("admin_token");
            setLogged(false);
          }}
        />
      )}
    </div>
  );
}