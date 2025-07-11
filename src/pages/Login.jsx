import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function Login({ onLogin }) {
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ciNumber = Number(ci.trim());
      if (isNaN(ciNumber)) {
        setError("La CI debe ser un número");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          ci: ciNumber,
          password: password.trim(),
        }
      );
      onLogin(res.data);
      if (res.data.es_admin === true) {
        navigate("/admin");
      } else if (res.data.es_miembro_mesa === true) {
        navigate("/miembro-mesa");
      } else {
        navigate("/panel");
      }
    } catch (err) {
      setError("CI o CC inválida o usuario no encontrado");
    }
  };

  return (
    <div className="centered">
      <div className="card">
          <Header />
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Cédula de Identidad"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button onClick={() => navigate("/register")}>Registro Ciudadano</button>
      </div>
    </div>
  );
}