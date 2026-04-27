import { useState } from "react";
import PremiumHero from "./components/PremiumHero";
import PremiumFinancePanel from "./components/PremiumFinancePanel";

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div style={styles.app}>
      {screen === "home" && (
        <PremiumHero onStart={() => setScreen("dashboard")} />
      )}

      {screen === "dashboard" && (
        <PremiumFinancePanel
          activeModule="Resumen"
          onBack={() => setScreen("home")}
          onOpenModule={(moduleName) => setScreen(moduleName)}
        />
      )}

      {screen === "MEFF" && (
        <PremiumFinancePanel
          activeModule="MEFF"
          onBack={() => setScreen("dashboard")}
          onOpenModule={(moduleName) => setScreen(moduleName)}
        />
      )}

      {screen === "BME" && (
        <PremiumFinancePanel
          activeModule="BME"
          onBack={() => setScreen("dashboard")}
          onOpenModule={(moduleName) => setScreen(moduleName)}
        />
      )}

      {screen === "Crypto" && (
        <PremiumFinancePanel
          activeModule="Crypto"
          onBack={() => setScreen("dashboard")}
          onOpenModule={(moduleName) => setScreen(moduleName)}
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    backgroundColor: "#070a11",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, Arial",
  },
};