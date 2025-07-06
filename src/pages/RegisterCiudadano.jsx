import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

export default function RegisterCiudadano() {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    ci: "",
    cc: "",
    fecha_nacimiento: "",
    contrasena: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fecha = new Date(form.fecha_nacimiento);
      const fechaISO = fecha.toISOString().slice(0, 10);

      await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
        ...form,
        ci: Number(form.ci),
        fecha_nacimiento: fechaISO,
      });
      setSuccess("Registro exitoso");
      setError("");
    } catch (err) {
      setError("Error en el registro");
      setSuccess("");
    }
  };

  return (
    <div className="centered">
      <form className="card" onSubmit={handleSubmit}>
        <Header />
        <h2>Registro de Ciudadano</h2>
        <input
          name="nombres"
          placeholder="Nombres"
          onChange={handleChange}
          required
        />
        <input
          name="apellidos"
          placeholder="Apellidos"
          onChange={handleChange}
          required
        />
        <input name="ci" placeholder="CI" onChange={handleChange} required />
        <input name="cc" placeholder="CC" onChange={handleChange} required />
        <input
          name="fecha_nacimiento"
          type="date"
          onChange={handleChange}
          required
        />
        <input
          name="contrasena"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
        <button type="button" onClick={() => navigate("/")}>
          Volver al login
        </button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </form>
    </div>
  );
}