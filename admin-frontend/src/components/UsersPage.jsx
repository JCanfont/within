import { useState } from "react";
import "./usersPage.css";

export default function UsersPage({ goBack }) {
  const [users, setUsers] = useState([
    { name: "Jordi", role: "Admin" },
    { name: "Laura", role: "User" },
    { name: "Carlos", role: "User" },
  ]);

  const [newUser, setNewUser] = useState("");

  function addUser() {
    if (!newUser) return;

    setUsers([...users, { name: newUser, role: "User" }]);
    setNewUser("");
  }

  return (
    <main className="users-page">
      <button className="back-btn" onClick={goBack}>
        ← Volver
      </button>

      <h1>Usuarios</h1>

      <div className="create-user">
        <input
          placeholder="Nombre usuario"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button onClick={addUser}>Crear</button>
      </div>

      <div className="users-list">
        {users.map((u, i) => (
          <div key={i} className="user-card">
            <span>{u.name}</span>
            <small>{u.role}</small>
          </div>
        ))}
      </div>
    </main>
  );
}