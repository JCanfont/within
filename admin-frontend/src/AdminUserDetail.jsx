import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API = "http://127.0.0.1:8000";

const TYPES = [
  { key: "nft", label: "NFT" },
  { key: "physical", label: "Activos físicos" },
  { key: "exploitation", label: "Explotación" },
  { key: "liquid", label: "Líquido" },
  { key: "contracts", label: "Contratos" },
];

const COLORS = ["#facc15", "#22c55e", "#3b82f6", "#ef4444", "#a855f7"];

export default function AdminUserDetail({ username, onBack }) {
  const [data, setData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [policy, setPolicy] = useState({});
  const [risk, setRisk] = useState(null);

  const [form, setForm] = useState({
    type: "nft",
    market: "",
    submarket: "",
    name: "",
    initial_value: "",
    current_value: "",
    start_date: "",
    expiry_date: "",
    free_float_pct: "",
    guarantee: "",
    contract: "",
    status: "open",
    notes: "",
  });

  const loadData = () => {
    fetch(`${API}/admin/user-detail?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setData(d));

    fetch(`${API}/admin/user-positions?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setPositions(d.positions || []));

    fetch(`${API}/admin/get-policy?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setPolicy(d.policy || {}));

    fetch(`${API}/admin/risk-status?username=${username}`)
      .then((r) => r.json())
      .then((d) => d.success && setRisk(d))
      .catch(() => setRisk(null));
  };

  useEffect(() => {
    loadData();
  }, [username]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createPosition = () => {
    fetch(`${API}/admin/add-position`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, ...form }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) {
          alert(d.error || "No se pudo crear la posición");
          return;
        }

        alert("Posición creada");

        setForm({
          type: "nft",
          market: "",
          submarket: "",
          name: "",
          initial_value: "",
          current_value: "",
          start_date: "",
          expiry_date: "",
          free_float_pct: "",
          guarantee: "",
          contract: "",
          status: "open",
          notes: "",
        });

        loadData();
      });
  };

  const updatePosition = (id, field, value) => {
    fetch(`${API}/admin/update-position`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, id, [field]: value }),
    }).then(loadData);
  };

  if (!data) {
    return (
      <div style={container}>
        <button onClick={onBack} style={btn}>← Volver</button>
        Cargando...
      </div>
    );
  }

  const total = positions.reduce(
    (a, p) => a + Number(p.current_value || 0),
    0
  );

  const distribution = TYPES.map((t) => ({
    name: t.label,
    key: t.key,
    value: positions
      .filter((p) => p.type === t.key)
      .reduce((a, p) => a + Number(p.current_value || 0), 0),
  })).filter((d) => d.value > 0);

  return (
    <div style={container}>
      <button onClick={onBack} style={btn}>← Volver</button>

      <h2>{data.profile?.name} ({username})</h2>

      <div style={card}>
        <h3>Distribución de activos</h3>

        {total === 0 && (
          <div>No hay posiciones todavía. Añade una posición abajo.</div>
        )}

        {total > 0 && (
          <div style={{ width: "100%", height: 340 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={115}
                  innerRadius={55}
                  paddingAngle={3}
                  label
                >
                  {distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div style={card}>
        <h3>Estado de riesgo</h3>

        {!risk && <div>Cargando riesgo...</div>}

        {risk && (
          <>
            <div>
              Estado:{" "}
              <strong
                style={{
                  color:
                    risk.status === "OK"
                      ? "#22c55e"
                      : risk.status === "WARNING"
                      ? "#facc15"
                      : "#ef4444",
                }}
              >
                {risk.status}
              </strong>
            </div>

            <div>Exposición: {risk.exposure}</div>
            <div>Drawdown: {risk.drawdown}%</div>

            {risk.alerts?.map((a, i) => (
              <div key={i} style={{ color: "#ef4444" }}>
                ⚠ {a}
              </div>
            ))}
          </>
        )}
      </div>

      <div style={card}>
        <h3>Control de riesgo</h3>

        <input
          placeholder="Máximo por operación"
          style={input}
          value={policy.max_ticket || ""}
          onChange={(e) => setPolicy({ ...policy, max_ticket: e.target.value })}
        />

        <input
          placeholder="Drawdown máximo %"
          style={input}
          value={policy.drawdown || ""}
          onChange={(e) => setPolicy({ ...policy, drawdown: e.target.value })}
        />

        <input
          placeholder="Exposición máxima"
          style={input}
          value={policy.max_exposure || ""}
          onChange={(e) =>
            setPolicy({ ...policy, max_exposure: e.target.value })
          }
        />

        <input
          placeholder="Activos excluidos: nft,contracts"
          style={input}
          value={policy.excluded_assets?.join(",") || ""}
          onChange={(e) =>
            setPolicy({
              ...policy,
              excluded_assets: e.target.value
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
        />

        <select
          style={input}
          value={policy.mode || "admin"}
          onChange={(e) => setPolicy({ ...policy, mode: e.target.value })}
        >
          <option value="admin">Admin opera</option>
          <option value="self">Usuario opera</option>
          <option value="hybrid">Híbrido</option>
        </select>

        <button
          style={mainBtn}
          onClick={() => {
            fetch(`${API}/admin/set-policy`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, policy }),
            }).then(loadData);
          }}
        >
          Guardar política
        </button>
      </div>

      <div style={card}>
        <h3>Introducir nueva posición</h3>

        <select
          value={form.type}
          onChange={(e) => updateForm("type", e.target.value)}
          style={input}
        >
          {TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>

        <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="Nombre del activo" style={input} />
        <input value={form.market} onChange={(e) => updateForm("market", e.target.value)} placeholder="Mercado" style={input} />
        <input value={form.submarket} onChange={(e) => updateForm("submarket", e.target.value)} placeholder="Submercado / blockchain" style={input} />
        <input value={form.initial_value} onChange={(e) => updateForm("initial_value", e.target.value)} placeholder="Valor inicial" type="number" style={input} />
        <input value={form.current_value} onChange={(e) => updateForm("current_value", e.target.value)} placeholder="Valor actual" type="number" style={input} />
        <input value={form.start_date} onChange={(e) => updateForm("start_date", e.target.value)} type="date" style={input} />
        <input value={form.expiry_date} onChange={(e) => updateForm("expiry_date", e.target.value)} type="date" style={input} />
        <input value={form.free_float_pct} onChange={(e) => updateForm("free_float_pct", e.target.value)} placeholder="Free float %" style={input} />
        <input value={form.guarantee} onChange={(e) => updateForm("guarantee", e.target.value)} placeholder="Garantía" style={input} />
        <input value={form.contract} onChange={(e) => updateForm("contract", e.target.value)} placeholder="Contrato electrónico / hash / URL" style={input} />

        <select
          value={form.status}
          onChange={(e) => updateForm("status", e.target.value)}
          style={input}
        >
          <option value="open">Abierta</option>
          <option value="closed">Cerrada</option>
          <option value="expired">Vencida</option>
          <option value="withdrawn">Retirada</option>
        </select>

        <textarea
          value={form.notes}
          onChange={(e) => updateForm("notes", e.target.value)}
          placeholder="Notas"
          style={{ ...input, minHeight: 80 }}
        />

        <button style={mainBtn} onClick={createPosition}>
          Crear posición
        </button>
      </div>

      <div style={card}>
        <h3>Modificar posiciones</h3>

        {positions.length === 0 && <div>No hay posiciones</div>}

        {positions.map((p) => (
          <div key={p.id} style={posCard}>
            <input defaultValue={p.name || ""} placeholder="Nombre" style={input} onBlur={(e) => updatePosition(p.id, "name", e.target.value)} />

            <select defaultValue={p.type || "nft"} style={input} onChange={(e) => updatePosition(p.id, "type", e.target.value)}>
              {TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>

            <input defaultValue={p.market || ""} placeholder="Mercado" style={input} onBlur={(e) => updatePosition(p.id, "market", e.target.value)} />
            <input defaultValue={p.submarket || ""} placeholder="Submercado / blockchain" style={input} onBlur={(e) => updatePosition(p.id, "submarket", e.target.value)} />
            <input defaultValue={p.initial_value || ""} type="number" placeholder="Valor inicial" style={input} onBlur={(e) => updatePosition(p.id, "initial_value", e.target.value)} />
            <input defaultValue={p.current_value || ""} type="number" placeholder="Valor actual" style={input} onBlur={(e) => updatePosition(p.id, "current_value", e.target.value)} />
            <input defaultValue={p.start_date || ""} type="date" style={input} onChange={(e) => updatePosition(p.id, "start_date", e.target.value)} />
            <input defaultValue={p.expiry_date || ""} type="date" style={input} onChange={(e) => updatePosition(p.id, "expiry_date", e.target.value)} />
            <input defaultValue={p.free_float_pct || ""} placeholder="Free float %" style={input} onBlur={(e) => updatePosition(p.id, "free_float_pct", e.target.value)} />
            <input defaultValue={p.guarantee || ""} placeholder="Garantía" style={input} onBlur={(e) => updatePosition(p.id, "guarantee", e.target.value)} />
            <input defaultValue={p.contract || ""} placeholder="Contrato" style={input} onBlur={(e) => updatePosition(p.id, "contract", e.target.value)} />

            <select defaultValue={p.status || "open"} style={input} onChange={(e) => updatePosition(p.id, "status", e.target.value)}>
              <option value="open">Abierta</option>
              <option value="closed">Cerrada</option>
              <option value="expired">Vencida</option>
              <option value="withdrawn">Retirada</option>
            </select>

            <textarea defaultValue={p.notes || ""} placeholder="Notas" style={{ ...input, minHeight: 80 }} onBlur={(e) => updatePosition(p.id, "notes", e.target.value)} />

            <div style={{ color: "#9ca3af", marginTop: 8 }}>
              Beneficio: {p.profit} ({p.profit_pct}%) · Días a vencimiento: {p.days_to_expiry ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = {
  padding: 20,
  background: "#0b0f1a",
  color: "white",
  minHeight: "100vh",
};

const card = {
  padding: 20,
  marginTop: 20,
  background: "#111827",
  borderRadius: 12,
};

const posCard = {
  padding: 14,
  marginTop: 14,
  background: "#1f2937",
  borderRadius: 10,
};

const btn = {
  padding: 10,
  background: "#1f2937",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const mainBtn = {
  padding: 12,
  marginTop: 10,
  background: "#facc15",
  color: "#000",
  fontWeight: 800,
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#0b0f1a",
  color: "white",
  boxSizing: "border-box",
};