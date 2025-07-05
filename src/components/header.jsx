import logo from "../assets/logo-corte.png";

export default function Header() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      marginBottom: "2rem"
    }}>
      <img src={logo} alt="Corte Electoral" style={{ height: 80 }} />
      <div>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>CORTE ELECTORAL</h1>
        <div style={{ fontSize: "1.1rem", color: "#333" }}>República Oriental del Uruguay</div>
      </div>
    </div>
  );
}