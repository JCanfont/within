import { useEffect, useState } from "react";

export default function Wallet({ username }) {
  const [network, setNetwork] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("waiting");
  const [lastTx, setLastTx] = useState(null);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [assetPrice, setAssetPrice] = useState("0.002");
  const [assetName, setAssetName] = useState("Activo Premium");

  const addresses = {
    ETH: "0xC84C0aE5c2099f145cDe053aC2b94CC617553927",
    BTC: "bc1TU_DIRECCION_BTC",
  };

  const statusText = {
    waiting: "Esperando pago",
    detected: "Pago detectado",
    confirmed: "Saldo acreditado",
  };

  const statusColor = {
    waiting: "#9ca3af",
    detected: "#3b82f6",
    confirmed: "#22c55e",
  };

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

  const showMessage = (text, ms = 1800) => {
    setMessage(text);
    if (window.__walletMessageTimeout) {
      window.clearTimeout(window.__walletMessageTimeout);
    }
    window.__walletMessageTimeout = window.setTimeout(() => {
      setMessage("");
    }, ms);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(addresses[network]);
      showMessage("Dirección copiada", 1500);
    } catch {
      showMessage("No se pudo copiar la dirección", 1500);
    }
  };

  const loadWallet = () => {
    fetch(`http://127.0.0.1:8000/wallet?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.balance !== undefined) {
          setBalance(data.balance);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!username) return;
    loadWallet();
  }, [username]);

  const resetVisualStateForNetwork = (nextNetwork) => {
    setNetwork(nextNetwork);
    setLastTx(null);
    setStatus("waiting");
    setMessage("");
    setIsChecking(false);
  };

  const checkPayment = async () => {
    if (isChecking) return;

    if (network !== "ETH") {
      showMessage("La detección automática está preparada primero para Ethereum");
      return;
    }

    setIsChecking(true);

    try {
      const checkRes = await fetch("http://127.0.0.1:8000/check-payment");
      const data = await checkRes.json();

      if (!data.success) {
        setStatus("waiting");
        showMessage(data.error || "No hay pagos detectados");
        setIsChecking(false);
        return;
      }

      setLastTx(data);
      setStatus("detected");

      if (amount && Number(data.amount) < Number(amount)) {
        showMessage("Pago detectado pero inferior al importe esperado");
        setIsChecking(false);
        return;
      }

      const creditRes = await fetch("http://127.0.0.1:8000/credit-from-chain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          amount: data.amount,
          hash: data.hash,
        }),
      });

      const creditData = await creditRes.json();

      if (creditData.success) {
        setStatus("confirmed");
        setBalance(creditData.new_balance);
        showMessage("Saldo acreditado correctamente");
      } else {
        showMessage(creditData.error || "No se pudo acreditar");
      }
    } catch {
      showMessage("Error consultando o acreditando pagos");
    } finally {
      setIsChecking(false);
    }
  };

  const buyAsset = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/buy-membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          price: Number(assetPrice),
          name: assetName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBalance(data.new_balance);
        showMessage("Activo comprado correctamente", 2000);
      } else {
        showMessage(data.error || "No se pudo completar la compra", 2000);
      }
    } catch {
      showMessage("Error en la compra", 2000);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ color: "#facc15", fontSize: 12, fontWeight: 700 }}>
            MÓDULO ACTIVO
          </div>
          <h2 style={{ margin: 0, fontSize: 30, color: "white" }}>Wallet</h2>
        </div>

        <div style={{ ...cardStyle, minWidth: 220 }}>
          <div style={labelStyle}>Usuario</div>
          <div style={{ fontSize: 18, color: "#facc15" }}>{username}</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Red</div>
          <select
            value={network}
            onChange={(e) => resetVisualStateForNetwork(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f172a",
              color: "white",
            }}
          >
            <option value="ETH">Ethereum</option>
            <option value="BTC">Bitcoin</option>
          </select>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Dirección de depósito</div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: "break-all",
              color: "#e5e7eb",
              marginBottom: 12,
            }}
          >
            {addresses[network]}
          </div>

          <button
            onClick={copyAddress}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#facc15",
              color: "#000",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Copiar dirección
          </button>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Estado</div>
          <div
            style={{
              color: statusColor[status],
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            {isChecking ? "Verificando..." : statusText[status]}
          </div>

          {message && (
            <div style={{ color: "#cbd5e1", fontSize: 13 }}>
              {message}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Saldo interno</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#22c55e",
            }}
          >
            {balance}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={cardStyle}>
          <div style={{ ...labelStyle, marginBottom: 10 }}>
            Importe esperado para acreditar
          </div>

          <input
            type="number"
            placeholder="Ej: 0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f172a",
              color: "white",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              marginTop: 12,
              color: "#9ca3af",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            Si introduces un importe esperado, el sistema solo marcará el pago
            como válido cuando detecte una cantidad igual o superior.
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ ...labelStyle, marginBottom: 10 }}>
            Cómo funciona
          </div>

          <div style={{ color: "#e5e7eb", fontSize: 14, lineHeight: 1.6 }}>
            1. Elige la red.
            <br />
            2. Copia la dirección de depósito.
            <br />
            3. Envía fondos a esa dirección.
            <br />
            4. Verifica el pago.
            <br />
            5. El saldo queda acreditado.
          </div>

          <button
            onClick={checkPayment}
            disabled={isChecking}
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: isChecking ? "#6b7280" : "#facc15",
              color: "#000",
              fontWeight: 700,
              cursor: isChecking ? "not-allowed" : "pointer",
            }}
          >
            {isChecking ? "Verificando..." : "Verificar pago"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={cardStyle}>
          <div style={{ ...labelStyle, marginBottom: 10 }}>
            Compra de activo
          </div>

          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Nombre del activo"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f172a",
              color: "white",
              boxSizing: "border-box",
              marginBottom: 12,
            }}
          />

          <input
            type="number"
            value={assetPrice}
            onChange={(e) => setAssetPrice(e.target.value)}
            placeholder="Precio del activo"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0f172a",
              color: "white",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              marginTop: 12,
              color: "#9ca3af",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            El activo se comprará con cargo al saldo interno del usuario.
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ ...labelStyle, marginBottom: 10 }}>
            Ejecutar compra
          </div>

          <div style={{ color: "#e5e7eb", fontSize: 14, lineHeight: 1.6 }}>
            Si el saldo es suficiente, el sistema descontará el importe y creará
            el activo en tu cartera.
          </div>

          <button
            onClick={buyAsset}
            style={{
              marginTop: 14,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: "#f97316",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Comprar activo
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ ...labelStyle, marginBottom: 10 }}>
          Última transacción detectada
        </div>

        {!lastTx ? (
          <div style={{ color: "#9ca3af", fontSize: 14 }}>
            Aún no se ha detectado ninguna transacción.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}
          >
            <div>
              <div style={labelStyle}>Desde</div>
              <div
                style={{
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  fontSize: 13,
                }}
              >
                {lastTx.from}
              </div>
            </div>

            <div>
              <div style={labelStyle}>Importe</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {lastTx.amount} ETH
              </div>
            </div>

            <div style={{ gridColumn: "1 / span 2" }}>
              <div style={labelStyle}>Hash</div>
              <div
                style={{
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  fontSize: 13,
                }}
              >
                {lastTx.hash}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}