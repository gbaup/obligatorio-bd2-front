import { useEffect, useState } from "react";
import axios from "axios";

export default function GestionMesasPanel() {
  const [mesas, setMesas] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [nuevoCircuito, setNuevoCircuito] = useState("");

  const cargarMesas = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/mesas`);
    setMesas(res.data);
  };

  const cargarCircuitos = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/circuitos`);
    setCircuitos(res.data);
  };

  useEffect(() => {
    cargarMesas();
    cargarCircuitos();
  }, []);

  const handleCrearMesa = async (e) => {
    e.preventDefault();
    if (!nuevoCircuito) return;
    await axios.post(`${import.meta.env.VITE_BASE_URL}/mesas`, {
      id_circuito: parseInt(nuevoCircuito, 10),
    });
    setNuevoCircuito("");
    cargarMesas();
  };

  const handleEliminarMesa = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/mesas/${id}`);
    cargarMesas();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 24 }}>
      <h3>Gestión de Mesas</h3>
      <form onSubmit={handleCrearMesa} style={{ marginBottom: 12 }}>
        <select
          value={nuevoCircuito}
          onChange={(e) => setNuevoCircuito(e.target.value)}
          required
        >
          <option value="">Seleccione un circuito</option>
          {circuitos.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} - {c.localidad} ({c.direccion})
            </option>
          ))}
        </select>
        <button type="submit" style={{ marginLeft: 8 }}>
          Crear Mesa
        </button>
      </form>
      <ul>
        {mesas.map((mesa) => (
          <li key={mesa.id}>
            Mesa #{mesa.id} - Circuito: {mesa.id_circuito} - Abierta:{" "}
            {mesa.abierto ? "Sí" : "No"}
            <button
              style={{ marginLeft: 8, color: "red" }}
              onClick={() => handleEliminarMesa(mesa.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
